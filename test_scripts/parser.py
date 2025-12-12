import json


def parse_openapi_to_chunks(openapi_file):
    """
    Convert OpenAPI spec into text chunks for RAG embedding.
    Includes comprehensive extraction of Request/Response 'examples'.
    """

    with open(openapi_file, "r", encoding="utf-8") as f:
        spec = json.load(f)

    chunks = []

    # Extract metadata
    info = spec.get("info", {})
    title = info.get("title", "API")
    # Handle server URL safely
    servers = spec.get("servers", [])
    base_url = servers[0].get("url", "") if servers else ""

    # Process each endpoint
    paths = spec.get("paths", {})

    for path, methods in paths.items():
        for method, details in methods.items():
            if method.lower() not in ["get", "post", "put", "delete", "patch"]:
                continue

            # Build comprehensive text representation
            chunk_text = []

            # 1. Header
            chunk_text.append(f"API: {title}")
            chunk_text.append(f"Endpoint: {method.upper()} {path}")
            chunk_text.append(f"Full URL: {base_url}{path}")
            chunk_text.append("")

            # 2. Summary and description
            if details.get("summary"):
                chunk_text.append(f"Summary: {details['summary']}")
            if details.get("description"):
                chunk_text.append(f"Description: {details['description']}")
            chunk_text.append("")

            # 3. Parameters
            params = details.get("parameters", [])
            if params:
                chunk_text.append("Parameters:")
                for param in params:
                    name = param.get("name")
                    location = param.get("in")
                    required = "REQUIRED" if param.get("required") else "optional"
                    # Handle schema inside param
                    schema = param.get("schema", {})
                    param_type = schema.get("type", "string")
                    description = param.get("description", "")
                    chunk_text.append(
                        f"  - {name} ({location}, {required}, {param_type}): {description}"
                    )
                chunk_text.append("")

            # 4. Request Body
            request_body = details.get("requestBody", {})
            if request_body:
                chunk_text.append("Request Body:")
                if request_body.get("description"):
                    chunk_text.append(f"  Description: {request_body['description']}")

                content = request_body.get("content", {})
                for content_type, content_info in content.items():
                    chunk_text.append(f"  Content-Type: {content_type}")

                    # 4a. Schema Properties
                    schema = content_info.get("schema", {})
                    if schema.get("properties"):
                        chunk_text.append("  Schema Fields:")
                        required_fields = schema.get("required", [])
                        for prop_name, prop_details in schema["properties"].items():
                            is_required = prop_name in required_fields
                            prop_type = prop_details.get("type", "object")
                            prop_desc = prop_details.get("description", "")
                            req_marker = "[REQUIRED]" if is_required else "[optional]"
                            chunk_text.append(
                                f"    - {prop_name} ({prop_type}) {req_marker}: {prop_desc}"
                            )

                    # 4b. Extract Request Examples (The Fix)
                    examples = content_info.get("examples", {})
                    if examples:
                        chunk_text.append("\n  Request Examples:")
                        for example_name, example_data in examples.items():
                            # OpenAPI 'examples' usually have a 'value' key holding the actual payload
                            val = example_data.get("value")
                            if val:
                                chunk_text.append(
                                    f"    --- Scenario: {example_name} ---"
                                )
                                chunk_text.append(json.dumps(val, indent=2))
                                chunk_text.append("")

                    # Fallback for singular 'example'
                    elif content_info.get("example"):
                        chunk_text.append("\n  Request Example:")
                        chunk_text.append(json.dumps(content_info["example"], indent=2))
                chunk_text.append("")

            # 5. Responses
            responses = details.get("responses", {})
            if responses:
                chunk_text.append("Responses:")
                for code, response in responses.items():
                    desc = response.get("description", "No description")
                    chunk_text.append(f"  Status {code}: {desc}")

                    content = response.get("content", {})
                    for content_type, content_info in content.items():

                        # 5a. Extract Response Examples (The Fix)
                        examples = content_info.get("examples", {})
                        if examples:
                            chunk_text.append(f"    Examples ({content_type}):")
                            for example_name, example_data in examples.items():
                                val = example_data.get("value")
                                if val:
                                    chunk_text.append(
                                        f"      --- Scenario: {example_name} ---"
                                    )
                                    # Indent the JSON for readability
                                    formatted_json = json.dumps(val, indent=2)
                                    # Indent the whole block to align with hierarchy
                                    indented_json = "\n".join(
                                        "      " + line
                                        for line in formatted_json.splitlines()
                                    )
                                    chunk_text.append(indented_json)
                                    chunk_text.append("")

                        # Fallback for singular 'example'
                        elif content_info.get("example"):
                            chunk_text.append(f"    Example ({content_type}):")
                            formatted_json = json.dumps(
                                content_info["example"], indent=2
                            )
                            indented_json = "\n".join(
                                "      " + line for line in formatted_json.splitlines()
                            )
                            chunk_text.append(indented_json)

                chunk_text.append("")

            # Create chunk object
            chunk = {
                "text": "\n".join(chunk_text),
                "metadata": {
                    "endpoint": f"{method.upper()} {path}",
                    "method": method.upper(),
                    "path": path,
                    "api": title,
                    "summary": details.get("summary", ""),
                },
            }

            chunks.append(chunk)

    return chunks


# Main execution
if __name__ == "__main__":
    print("Parsing ClickPost OpenAPI spec...")

    # Ensure this filename matches your uploaded file
    chunks = parse_openapi_to_chunks("clickpost_openapi_formatted.json")

    print(f"\n✅ Created {len(chunks)} chunks")

    if chunks:
        avg_size = sum(len(c["text"]) for c in chunks) / len(chunks)
        print(f"Average chunk size: {avg_size:.0f} characters")

    # Save chunks
    output_filename = "clickpost_chunks_clean.json"
    with open(output_filename, "w", encoding="utf-8") as f:
        json.dump(chunks, f, indent=2, ensure_ascii=False)

    print(f"📄 Saved to: {output_filename}")

    # Show a sample to verify the examples are present
    if chunks:
        print("\n" + "=" * 70)
        print("SAMPLE CHUNK WITH EXAMPLES")
        print("=" * 70)
        # We print the first 2000 chars to verify the request examples are there
        print(chunks[0]["text"][:2000])
        print("=" * 70)

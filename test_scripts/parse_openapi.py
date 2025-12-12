import json

def parse_openapi_to_chunks(openapi_file):
    """
    Convert OpenAPI spec into text chunks for RAG embedding.
    Each endpoint becomes one chunk with full context.
    """

    with open(openapi_file, 'r', encoding='utf-8') as f:
        spec = json.load(f)

    chunks = []

    # Extract metadata
    info = spec.get('info', {})
    title = info.get('title', 'API')
    base_url = spec.get('servers', [{}])[0].get('url', '')

    # Process each endpoint
    paths = spec.get('paths', {})

    for path, methods in paths.items():
        for method, details in methods.items():
            if method.lower() not in ['get', 'post', 'put', 'delete', 'patch']:
                continue

            # Build comprehensive text representation
            chunk_text = []

            # Header
            chunk_text.append(f"API: {title}")
            chunk_text.append(f"Endpoint: {method.upper()} {path}")
            chunk_text.append(f"Full URL: {base_url}{path}")
            chunk_text.append("")

            # Summary and description
            if details.get('summary'):
                chunk_text.append(f"Summary: {details['summary']}")
            if details.get('description'):
                chunk_text.append(f"Description: {details['description']}")
            chunk_text.append("")

            # Parameters
            params = details.get('parameters', [])
            if params:
                chunk_text.append("Parameters:")
                for param in params:
                    name = param.get('name')
                    location = param.get('in')
                    required = "REQUIRED" if param.get('required') else "optional"
                    param_type = param.get('schema', {}).get('type', 'string')
                    description = param.get('description', '')

                    chunk_text.append(f"  - {name} ({location}, {required}, {param_type}): {description}")
                chunk_text.append("")

            # Request Body
            request_body = details.get('requestBody', {})
            if request_body:
                chunk_text.append("Request Body:")
                if request_body.get('description'):
                    chunk_text.append(f"  Description: {request_body['description']}")

                content = request_body.get('content', {})
                for content_type, schema_info in content.items():
                    chunk_text.append(f"  Content-Type: {content_type}")

                    schema = schema_info.get('schema', {})
                    if schema.get('properties'):
                        chunk_text.append("  Required Fields:")
                        required_fields = schema.get('required', [])
                        for prop_name, prop_details in schema['properties'].items():
                            is_required = prop_name in required_fields
                            prop_type = prop_details.get('type', 'object')
                            prop_desc = prop_details.get('description', '')
                            req_marker = "[REQUIRED]" if is_required else "[optional]"
                            chunk_text.append(f"    - {prop_name} ({prop_type}) {req_marker}: {prop_desc}")

                    # Add example if available
                    if schema_info.get('example'):
                        chunk_text.append(f"  Example: {json.dumps(schema_info['example'], indent=2)}")
                chunk_text.append("")

            # Responses
            responses = details.get('responses', {})
            if responses:
                chunk_text.append("Responses:")
                for code, response in responses.items():
                    chunk_text.append(f"  {code}: {response.get('description', 'No description')}")

                    # Add response schema if available
                    content = response.get('content', {})
                    for content_type, schema_info in content.items():
                        if schema_info.get('example'):
                            chunk_text.append(f"    Example Response: {json.dumps(schema_info['example'], indent=2)[:500]}")
                chunk_text.append("")

            # Create chunk object
            chunk = {
                "text": "\n".join(chunk_text),
                "metadata": {
                    "endpoint": f"{method.upper()} {path}",
                    "method": method.upper(),
                    "path": path,
                    "api": title,
                    "summary": details.get('summary', '')
                }
            }

            chunks.append(chunk)

    return chunks

# Main execution
if __name__ == "__main__":
    print("Parsing ClickPost OpenAPI spec...")

    chunks = parse_openapi_to_chunks("clickpost_openapi_formatted.json")

    print(f"\n✅ Created {len(chunks)} chunks")
    print(f"Average chunk size: {sum(len(c['text']) for c in chunks) / len(chunks):.0f} characters")

    # Save chunks
    with open("clickpost_chunks.json", "w", encoding="utf-8") as f:
        json.dump(chunks, f, indent=2, ensure_ascii=False)

    print(f"📄 Saved to: clickpost_chunks.json")

    # Show sample chunks
    print("\n" + "="*70)
    print("SAMPLE CHUNK (First Endpoint)")
    print("="*70)
    print(chunks[0]['text'][:1500])
    print("\n[...truncated...]")
    print("\n" + "="*70)
    print(f"Metadata: {json.dumps(chunks[0]['metadata'], indent=2)}")
    print("="*70)

import requests
import json

url = "https://docs.clickpost.ai/openapi/634e78c76acdf1003cf664db"

print(f"Fetching ClickPost OpenAPI spec...")
print(f"URL: {url}\n")

try:
    response = requests.get(url, timeout=10)
    response.raise_for_status()
    
    print(f"✅ Response received")
    print(f"Status Code: {response.status_code}")
    print(f"Content-Type: {response.headers.get('content-type')}")
    print(f"Size: {len(response.text)} bytes\n")
    
    # Try parsing as JSON
    data = response.json()
    
    # Save formatted JSON
    with open("clickpost_openapi_formatted.json", "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print("📄 Saved to: clickpost_openapi_formatted.json\n")
    
    # Print summary
    print("="*70)
    print("OPENAPI SPEC SUMMARY")
    print("="*70)
    
    if 'openapi' in data or 'swagger' in data:
        version = data.get('openapi') or data.get('swagger')
        print(f"OpenAPI Version: {version}")
        
        # Info section
        info = data.get('info', {})
        print(f"\nTitle: {info.get('title')}")
        print(f"Version: {info.get('version')}")
        print(f"Description: {info.get('description', 'N/A')[:200]}")
        
        # Servers
        servers = data.get('servers', [])
        if servers:
            print(f"\nBase URL: {servers[0].get('url')}")
        
        # Paths/Endpoints
        paths = data.get('paths', {})
        print(f"\n📍 Total Endpoints: {len(paths)}")
        
        # List all endpoints
        print("\n" + "="*70)
        print("ALL ENDPOINTS")
        print("="*70)
        
        for i, (path, methods) in enumerate(paths.items(), 1):
            print(f"\n{i}. {path}")
            for method, details in methods.items():
                if method in ['get', 'post', 'put', 'delete', 'patch']:
                    summary = details.get('summary', details.get('description', 'No description'))
                    print(f"   {method.upper():6} - {summary[:80]}")
        
        # Show detailed view of first 2 endpoints
        print("\n" + "="*70)
        print("DETAILED VIEW - FIRST 2 ENDPOINTS")
        print("="*70)
        
        for i, (path, methods) in enumerate(list(paths.items())[:2], 1):
            print(f"\n{'#'*70}")
            print(f"ENDPOINT {i}: {path}")
            print(f"{'#'*70}")
            
            for method, details in methods.items():
                if method in ['get', 'post', 'put', 'delete', 'patch']:
                    print(f"\n  Method: {method.upper()}")
                    print(f"  Summary: {details.get('summary', 'N/A')}")
                    print(f"  Description: {details.get('description', 'N/A')}")
                    
                    # Parameters
                    params = details.get('parameters', [])
                    if params:
                        print(f"\n  Parameters ({len(params)}):")
                        for param in params:
                            required = "required" if param.get('required') else "optional"
                            print(f"    - {param.get('name')} ({param.get('in')}, {required}): {param.get('description', 'N/A')[:50]}")
                    
                    # Request Body
                    request_body = details.get('requestBody', {})
                    if request_body:
                        print(f"\n  Request Body: {request_body.get('description', 'Present')}")
                        content = request_body.get('content', {})
                        if content:
                            print(f"    Content-Types: {list(content.keys())}")
                    
                    # Responses
                    responses = details.get('responses', {})
                    if responses:
                        print(f"\n  Responses:")
                        for code, resp in responses.items():
                            print(f"    {code}: {resp.get('description', 'N/A')}")
        
        print("\n" + "="*70)
        print(f"✅ Full spec saved to: clickpost_openapi_formatted.json")
        print("="*70)
        
    else:
        print("⚠️  This doesn't appear to be a standard OpenAPI spec")
        print(f"Top-level keys: {list(data.keys())}")
        print(f"\nFirst 1000 characters of response:")
        print(json.dumps(data, indent=2)[:1000])
        
except requests.exceptions.RequestException as e:
    print(f"❌ Failed to fetch: {e}")
except json.JSONDecodeError as e:
    print(f"❌ Failed to parse JSON: {e}")
    print(f"\nFirst 500 characters of response:")
    print(response.text[:500])
except Exception as e:
    print(f"❌ Unexpected error: {e}")

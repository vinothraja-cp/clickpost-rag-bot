import requests
import json

# List of ClickPost OpenAPI URLs
openapi_urls = {
    "clickpost": "https://docs.clickpost.ai/openapi/634e78c76acdf1003cf664db",
    "serviceability": "https://docs.clickpost.ai/openapi/6380cc6906fcf5006ec60dc7",
    "edd": "https://docs.clickpost.ai/openapi/651e4afa6d0e43006e1bca30",
    "tracking": "https://docs.clickpost.ai/openapi/6426725b5d5091022af9c61a"
}

for name, url in openapi_urls.items():
    print(f"\n{'='*60}")
    print(f"Fetching: {name}")
    print(f"{'='*60}")
    
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        
        # Try parsing as JSON
        data = response.json()
        
        # Print basic info
        print(f"✅ Successfully fetched {name}")
        print(f"Content-Type: {response.headers.get('content-type')}")
        print(f"Size: {len(response.text)} bytes")
        
        # Check if it's OpenAPI spec
        if 'openapi' in data or 'swagger' in data:
            version = data.get('openapi') or data.get('swagger')
            print(f"OpenAPI Version: {version}")
            print(f"Info: {data.get('info', {})}")
            print(f"Number of paths: {len(data.get('paths', {}))}")
            
            # Show first endpoint as sample
            paths = data.get('paths', {})
            if paths:
                first_path = list(paths.keys())[0]
                print(f"\nSample endpoint: {first_path}")
                print(f"Methods: {list(paths[first_path].keys())}")
        else:
            print(f"⚠️  Not a standard OpenAPI format")
            print(f"Keys: {list(data.keys())[:10]}")
        
        # Save to file for inspection
        with open(f"{name}_openapi.json", "w") as f:
            json.dump(data, f, indent=2)
        print(f"📄 Saved to {name}_openapi.json")
        
    except requests.exceptions.RequestException as e:
        print(f"❌ Failed to fetch: {e}")
    except json.JSONDecodeError:
        print(f"⚠️  Response is not JSON")
        print(f"First 500 chars: {response.text[:500]}")

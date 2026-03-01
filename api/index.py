"""
GoldCard Pay API - Simple Test Version
"""

import sys

def handler(request):
    # Test if basic Python works
    print("DEBUG: Handler called", file=sys.stderr)
    
    return {
        "statusCode": 200,
        "headers": {"Content-Type": "application/json"},
        "body": '{"message": "Hello from Vercel Python!"}'
    }

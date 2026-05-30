import os
import sys
import urllib.request
import urllib.error

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from app import create_app

app = create_app()
with app.app_context():
    from flask_jwt_extended import create_access_token
    token = create_access_token(identity="admin_test", additional_claims={"role": "admin"})
    
    try:
        req = urllib.request.Request('http://127.0.0.1:5001/api/students/', headers={"Authorization": f"Bearer {token}"})
        res = urllib.request.urlopen(req)
        print("Status code:", res.getcode())
        print("Response:", res.read().decode()[:200])
    except urllib.error.HTTPError as e:
        print("HTTP Error:", e.code)
        print("Reason:", e.read().decode())
    except Exception as e:
        print("Error:", e)

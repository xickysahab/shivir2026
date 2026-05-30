import os
import sys

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from app import create_app
from model import Student
from flask import json

app = create_app()
with app.app_context():
    from routes.students import get_students
    # We can't easily call get_students directly due to @role_required decorator relying on request context and JWT
    # Let's mock a request using Flask test client
    client = app.test_client()
    
    # Generate a JWT for admin
    from flask_jwt_extended import create_access_token
    token = create_access_token(identity="admin_test", additional_claims={"role": "admin"})
    
    response = client.get('/api/students/', headers={"Authorization": f"Bearer {token}"})
    print("Status code:", response.status_code)
    try:
        data = json.loads(response.data)
        print("Success:", data.get('success'))
        if not data.get('success'):
            print("Message:", data.get('message'))
        else:
            print("Fetched students count:", len(data.get('data', [])))
            if data.get('data'):
                print("First student kit_received:", data['data'][0].get('kit_received'))
    except Exception as e:
        print("Error parsing response:", e)
        print("Raw response:", response.data)

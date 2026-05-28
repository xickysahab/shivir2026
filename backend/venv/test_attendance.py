import jwt
from datetime import datetime, timedelta
import json

secret = 'shivir2026-super-secret-jwt-key'
payload = {
    "iat": int(datetime.utcnow().timestamp()),
    "nbf": int(datetime.utcnow().timestamp()),
    "exp": int((datetime.utcnow() + timedelta(hours=3)).timestamp()),
    "jti": "1234",
    "sub": "asd",
    "role": "teacher",
    "name": "ASD Teacher",
    "assigned_level": "Level 1"
}
print(jwt.encode(payload, secret, algorithm="HS256"))

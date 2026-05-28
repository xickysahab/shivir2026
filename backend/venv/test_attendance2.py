from app import app, db
from flask_jwt_extended import create_access_token
import os

with app.app_context():
    # Generate token
    token = create_access_token(
        identity="asd",
        additional_claims={'role': 'teacher', 'name': 'ASD Teacher', 'assigned_level': 'Level 1'}
    )
    print(token)

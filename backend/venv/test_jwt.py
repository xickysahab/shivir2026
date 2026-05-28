from app import create_app
from flask_jwt_extended.config import config

app = create_app()
with app.app_context():
    print("Expires:", config.access_expires)

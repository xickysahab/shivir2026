from flask import Flask
from flask_cors import CORS
from config import Config
from extensions import db, bcrypt
from flask_jwt_extended import JWTManager

# Import Blueprints
from routes.auth import auth_bp
from routes.students import students_bp
from routes.users import users_bp
from routes.attendance import attendance_bp
from routes.logs import logs_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Fix 308 redirect issue — trailing slash redirects drop Authorization header
    app.url_map.strict_slashes = False
    
    # Setup JWT
    app.config['JWT_SECRET_KEY'] = 'shivir2026-super-secret-jwt-key'  # Change this in production
    jwt = JWTManager(app)

    # Initialize extensions
    db.init_app(app)
    bcrypt.init_app(app)

    # Allow frontend (Vite dev server) to call backend
    CORS(app, resources={r"/api/*": {
        "origins": "*",
        "methods": ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "supports_credentials": True
    }})

    # Create tables on first request
    with app.app_context():
        db.create_all()

    @app.errorhandler(Exception)
    def handle_exception(e):
        import traceback
        return traceback.format_exc(), 500

    # Register Blueprints
    app.register_blueprint(auth_bp, url_prefix='/api')
    app.register_blueprint(students_bp, url_prefix='/api/students')
    app.register_blueprint(users_bp, url_prefix='/api/users')
    app.register_blueprint(attendance_bp, url_prefix='/api/attendance')
    app.register_blueprint(logs_bp, url_prefix='/api/logs')

    @app.route('/api/health', methods=['GET'])
    def health_check():
        from flask import jsonify
        return jsonify({"status": "active"}), 200

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, port=5001)

from flask import Flask
from flask import Blueprint, jsonify, request

def create_app():
    app = Flask(__name__)
    from route import main
    app.register_blueprint(main)
    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)

from flask import Flask
from route import main
from flask_cors import CORS


def create_app():
    app = Flask(__name__)
    CORS(app)
    app.register_blueprint(main)
    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)

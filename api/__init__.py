from flask import Flask
from route import main
from flask_cors import CORS


def create_app():
    app = Flask(__name__)
    CORS(app)
    cors = CORS(app, resources={
        r"/*":{
        "origins":"*"
        }

    })
    app.register_blueprint(main)
    return app


if __name__ == "__main__":
    ##Adding support for HTTPS by implementing self-signed certificates. This prototype was implemented by Abhinav Gupta
    app = create_app()
    app.run(debug=True, ssl_context=('cert.pem', 'priv_key.pem'))

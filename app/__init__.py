
from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

from app import routes
from app.tests.FraudDetection import instagramData
from app.tests.FraudDetection import fraudPredict


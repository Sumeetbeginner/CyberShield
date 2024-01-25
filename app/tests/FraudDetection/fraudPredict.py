import joblib
from flask import Flask, jsonify, request
from app import app
import requests
import json

model = joblib.load(r'F:\CyberShield\app\tests\FraudDetection\fraud_detection_model.joblib')

@app.route('/fraud_result', methods=['POST'])
def fraud_result():
    data = request.get_json()
    
    totalWeight = data['noOfPosts']
    captionData = data['captionData']
    bioText = data['bioText']
    
    fraud_result = 0
    
    for i in range(0, totalWeight-1):
        currCaptionData = captionData[i]
        
        if 'Caption' in currCaptionData and currCaptionData['Caption'] is not None:
            currText = currCaptionData['Caption']
            
            # Convert to lowercase
            currText = currText.lower()
            print(currText)
            
            prediction = model.predict([currText])
            fraud_result += prediction[0]
            print(prediction[0])
        

    # Handle bioText similarly
    if 'Caption' in bioText and bioText['Caption'] is not None:
        bioText = bioText['Caption']
        bioText = bioText.lower()
        prediction = model.predict([bioText])
        fraud_result += prediction[0]
        print(bioText)
        print(prediction[0])
    
    
    fraud_percent = (fraud_result / (totalWeight + 1)) * 100
    
    return ({'result': fraud_percent})
        

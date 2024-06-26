from fastapi.testclient import TestClient
from fastapi import HTTPException
import pytest
from unittest.mock import MagicMock
from .main import app
from . import main

client = TestClient(app)

def fake_predict(filename):
    raise Exception("new Exception")

original_predict= main.predict

def fake_load_audio_to_tensor(file, type):
    raise Exception("new Exception")

original_load_audio_to_tensor= main.load_audio_to_tensor

def fake_get_symptoms_df(item):
    raise Exception("new Exception")

original_get_symptoms_df= main.get_symptoms_df

def test_read_main():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {'message': 'Hello World'}


def test_pill_predict_wrong_file_format():
    test_file = './test_files/test.txt'
    files = {'file': ('test.txt', open(test_file, 'rb'))}
    response = client.post('/PillAI', files=files)
    assert response.status_code == 400
    assert response.json() == {"message": "Image format must be jpg, jpeg, or png!"}


def test_pill_predict():
    test_file = './test_files/0.jpg'
    files = {'file': ('0.jpg', open(test_file, 'rb'))}
    response = client.post('/PillAI', files=files)
    assert response.status_code == 200

    
def test_test():
    main.predict=fake_predict
    test_file = './test_files/0.jpg'
    files = {'file': ('0.jpg', open(test_file, 'rb'))}
    response = client.post('/PillAI', files=files)
    assert response.status_code == 500
    assert response.json() == {'detail': 'Error: HTTPException'}
    main.predict=original_predict

def test_snoring_AI_wav():
    test_file = './test_files/1_4.wav'
    files = {'file': ('1_4.wav', open(test_file, 'rb'))}
    response = client.post('/SnoringAI', files=files)
    assert response.status_code == 200

def test_snoring_AI_mp3():
    test_file = './test_files/test_audio_short2.mp3'
    files = {'file': ('test_audio_short2.mp3', open(test_file, 'rb'))}
    response = client.post('/SnoringAI', files=files)
    assert response.status_code == 200

def test_snoring_AI_HTTPException():
    main.load_audio_to_tensor=fake_load_audio_to_tensor
    test_file = './test_files/1_4.wav'
    files = {'file': ('1_4.wav', open(test_file, 'rb'))}
    response = client.post('/SnoringAI', files=files)
    assert response.status_code == 500
    assert response.json() == {'detail': 'Error: HTTPException'}
    main.load_audio_to_tensor=original_load_audio_to_tensor

def test_snoring_AI_wrong_file_format():
    test_file = './test_files/test.txt'
    files = {'file': ('test.txt', open(test_file, 'rb'))}
    response = client.post('/SnoringAI', files=files)
    assert response.status_code == 400
    assert response.json() == {"message": "Audio format must be mp3, wav!"}

def test_symptom_predict_wrong_json_format():
    symptoms = {"symptoms": ["itching", "skin rash", "nodal skin eruptions", "dischromic  patches"]}
    response = client.post('/SymptomChecker', json=symptoms)
    assert response.status_code == 200


def test_symptom_predict():
    main.get_symptoms_df=fake_get_symptoms_df
    symptoms = {"symptoms": ["itching", "skin rash", "nodal skin eruptions", "dischromic  patches"]}
    response = client.post('/SymptomChecker', json=symptoms)
    assert response.status_code == 500
    main.get_symptoms_df=original_get_symptoms_df

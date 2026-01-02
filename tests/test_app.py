import os
import sys
import json
import pytest

# ensure project root is importable when pytest runs from tests/
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from run import app


@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as c:
        yield c


def test_home(client):
    rv = client.get('/')
    assert rv.status_code == 200
    assert b'Boston House Price Prediction' in rv.data


def test_predict_api_missing(client):
    rv = client.post('/predict_api', json={})
    assert rv.status_code in (400, 500)

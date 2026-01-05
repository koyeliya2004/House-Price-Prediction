import os
import numpy as np
from flask import Blueprint, current_app, request, jsonify, render_template

bp = Blueprint('main', __name__)

FEATURE_ORDER = ['CRIM', 'ZN', 'INDUS', 'CHAS', 'NOX', 'RM', 'Age', 'DIS', 'RAD', 'TAX', 'PTRATIO', 'B', 'LSTAT']


def _resolve_predictor(raw):
    # simple resolver that returns an instance with predict
    if raw is None:
        return None
    if hasattr(raw, 'predict') and not isinstance(raw, type):
        return raw
    # sklearn search objects
    if hasattr(raw, 'best_estimator_'):
        return _resolve_predictor(getattr(raw, 'best_estimator_'))
    # dict-like
    if isinstance(raw, dict):
        for k in ('model', 'estimator', 'best_estimator_', 'best_estimator'):
            if k in raw:
                return _resolve_predictor(raw[k])
        # fallback to first
        if len(raw) > 0:
            return _resolve_predictor(next(iter(raw.values())))
    return None


@bp.route('/')
def home():
    return render_template('home.html')


@bp.route('/health')
def health():
    """Health check endpoint for Render deployment"""
    model = current_app.model
    scaler = current_app.scaler
    status = 'healthy' if model is not None and scaler is not None else 'unhealthy'
    return jsonify({
        'status': status,
        'model_loaded': model is not None,
        'scaler_loaded': scaler is not None
    }), 200 if status == 'healthy' else 503


@bp.route('/predict_api', methods=['POST'])
def predict_api():
    model = current_app.model
    scaler = current_app.scaler
    if model is None or scaler is None:
        return jsonify({'error': 'model not loaded'}), 500

    payload = request.get_json(silent=True)
    if payload is None:
        data = request.form.to_dict()
    else:
        data = payload.get('data') if isinstance(payload, dict) and 'data' in payload else payload

    if not data:
        return jsonify({'error': 'no input data provided'}), 400

    try:
        if isinstance(data, dict):
            a = np.array([float(data.get(f, 0)) for f in FEATURE_ORDER], dtype=float).reshape(1, -1)
        else:
            a = np.array(list(data), dtype=float).reshape(1, -1)
        a_scaled = scaler.transform(a)
        predictor = _resolve_predictor(model)
        if predictor is None:
            return jsonify({'error': 'predictor not available'}), 500
        out = predictor.predict(a_scaled)
        return jsonify({'prediction': float(out[0])})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@bp.route('/predict', methods=['POST'])
def predict():
    model = current_app.model
    scaler = current_app.scaler
    if model is None or scaler is None:
        return render_template('home.html', prediction_text='Model not loaded')

    try:
        data = [float(request.form.get(f, 0)) for f in FEATURE_ORDER]
        a = np.array(data).reshape(1, -1)
        a_scaled = scaler.transform(a)
        predictor = _resolve_predictor(model)
        if predictor is None:
            return render_template('home.html', prediction_text='Predictor not available')
        out = predictor.predict(a_scaled)[0]
        return render_template('home.html', prediction_text=f"The House price prediction is {float(out):.3f}")
    except Exception as e:
        return render_template('home.html', prediction_text=f"Error: {e}")

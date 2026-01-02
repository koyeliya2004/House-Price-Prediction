import os
import sys
import pickle
from flask import Flask, request, jsonify, render_template
import numpy as np

# Compatibility shim: some pickled models reference private sklearn symbols
# (e.g. '_passthrough_scorer') from older scikit-learn versions. Ensure
# the attribute exists before unpickling so loading doesn't fail.
try:
    import sklearn.metrics._scorer as _sk_scorer
    if not hasattr(_sk_scorer, '_passthrough_scorer'):
        def _passthrough_scorer(estimator, X, y, *args, **kwargs):
            try:
                return estimator.score(X, y)
            except Exception:
                return 0.0

        _sk_scorer._passthrough_scorer = _passthrough_scorer
except Exception:
    # If sklearn isn't available or has a different layout, continue and
    # allow errors to be handled when loading the model.
    pass

app = Flask(__name__)

# Load model files with graceful errors so deploy logs show helpful messages
MODEL_PATH = os.environ.get('MODEL_PATH', 'housepred.pkl')
SCALER_PATH = os.environ.get('SCALER_PATH', 'scaler.pkl')

try:
    with open(MODEL_PATH, 'rb') as fh:
        model = pickle.load(fh)
except Exception as e:
    print(f"ERROR: failed to load model from {MODEL_PATH}: {e}")
    model = None

try:
    with open(SCALER_PATH, 'rb') as fh:
        scaler = pickle.load(fh)
except Exception as e:
    print(f"ERROR: failed to load scaler from {SCALER_PATH}: {e}")
    scaler = None

# If CatBoostRegressor from the pickled model lacks sklearn tags (older versions),
# add a compatible __sklearn_tags__ to avoid sklearn utilities failing at runtime.
try:
    import catboost
    from run import app
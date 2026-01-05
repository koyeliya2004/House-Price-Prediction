import os
import sys
import pickle
from flask import Flask, request, jsonify, render_template
import numpy as np
from flask_cors import CORS

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

# IMPORTANT: Patch CatBoostRegressor BEFORE loading the pickled model
# to ensure sklearn compatibility with sklearn >= 1.6 which requires __sklearn_tags__
try:
    import catboost
    from catboost import CatBoostRegressor
    
    # Always patch to ensure compatibility with latest sklearn
    try:
        # sklearn >= 1.6 uses Tags dataclass
        from sklearn.utils._tags import Tags, TargetTags, InputTags, RegressorTags
        
        def _sklearn_tags(self):
            return Tags(
                estimator_type="regressor",
                target_tags=TargetTags(required=True),
                transformer_tags=None,
                classifier_tags=None,
                regressor_tags=RegressorTags(poor_score=False),
                array_api_support=False,
                no_validation=False,
                non_deterministic=False,
                requires_fit=True,
                _skip_test=True,
                input_tags=InputTags(allow_nan=True),
            )
    except ImportError:
        # Fallback for older sklearn (< 1.6)
        def _sklearn_tags(self):
            return {
                'non_deterministic': False,
                'requires_positive_X': False,
                'requires_positive_y': False,
                'X_types': ['2darray'],
                'poor_score': False,
                'no_validation': False,
                'multioutput': False,
                'allow_nan': True,
                'stateless': False,
                'multilabel': False,
                '_skip_test': True,
                '_xfail_checks': False,
                'multioutput_only': False,
                'binary_only': False,
                'requires_fit': True,
                'preserves_dtype': [],
                'requires_y': True,
                'pairwise': False,
            }
    
    CatBoostRegressor.__sklearn_tags__ = _sklearn_tags
except Exception as e:
    print(f"Warning: Could not patch CatBoost sklearn compatibility: {e}")

app = Flask(__name__)

# Enable CORS for all origins to allow frontend from Vercel/other domains
CORS(app, resources={
    r"/*": {
        "origins": "*",
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

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

# Import routes from the blueprints
from house_price.routes import bp

app.register_blueprint(bp)

# Attach model and scaler to app for easy access from routes
app.model = model
app.scaler = scaler

if __name__ == "__main__":
    # For development, run with Flask development server
    # For production, use gunicorn: gunicorn -w 4 -b 0.0.0.0:5000 app:app
    app.run(debug=True, host="0.0.0.0", port=5000)
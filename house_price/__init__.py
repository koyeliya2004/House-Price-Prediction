import os
import pickle
from flask import Flask


def create_app(config=None):
    app = Flask(__name__, template_folder=os.path.join(os.path.dirname(__file__), '..', 'templates'))

    # load config
    MODEL_PATH = os.environ.get('MODEL_PATH', os.path.join(os.path.dirname(__file__), '..', 'housepred.pkl'))
    SCALER_PATH = os.environ.get('SCALER_PATH', os.path.join(os.path.dirname(__file__), '..', 'scaler.pkl'))

    # compatibility shims (private sklearn symbols, catboost tags) kept minimal
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
        pass

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

    # small CatBoost shim
    try:
        import catboost
        CatBoostRegressor = getattr(catboost, 'CatBoostRegressor', None)
        if CatBoostRegressor is not None and not hasattr(CatBoostRegressor, '__sklearn_tags__'):
            @classmethod
            def __sklearn_tags__(cls):
                return {"non_deterministic": False}

            CatBoostRegressor.__sklearn_tags__ = __sklearn_tags__
    except Exception:
        pass

    # make available on app object
    app.model = model
    app.scaler = scaler

    # delayed import to avoid circulars
    from .routes import bp as routes_bp
    app.register_blueprint(routes_bp)

    return app

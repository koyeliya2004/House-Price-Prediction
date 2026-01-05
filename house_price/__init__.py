import os
import pickle
from flask import Flask
from flask_cors import CORS


def create_app(config=None):
    app = Flask(__name__, template_folder=os.path.join(os.path.dirname(__file__), '..', 'templates'))
    
    # Enable CORS for all origins to allow frontend from Vercel/other domains
    CORS(app, resources={
        r"/*": {
            "origins": "*",
            "methods": ["GET", "POST", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"]
        }
    })

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

    # IMPORTANT: Patch CatBoostRegressor BEFORE loading the pickled model
    # to ensure sklearn compatibility with sklearn >= 1.6 which requires __sklearn_tags__
    try:
        import catboost
        CatBoostRegressor = getattr(catboost, 'CatBoostRegressor', None)
        if CatBoostRegressor is not None:
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

    # make available on app object
    app.model = model
    app.scaler = scaler

    # delayed import to avoid circulars
    from .routes import bp as routes_bp
    app.register_blueprint(routes_bp)

    return app

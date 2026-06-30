from .core.tf_env import bootstrap_tf_runtime

bootstrap_tf_runtime()

from .application import create_app

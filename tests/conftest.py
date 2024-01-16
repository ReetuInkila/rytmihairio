import sys
import pytest
sys.path.append('/home/reetu/dev/syke/server')

from main import app as flask_app

@pytest.fixture()
def app():
    yield flask_app

@pytest.fixture()
def client(app):
    return app.test_client()

@pytest.fixture()
def runner(app):
    return app.test_cli_runner()
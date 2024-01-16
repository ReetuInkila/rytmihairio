from server.secret import secret

def test_verify_recaptcha_success(client, monkeypatch):
    # Mock the secret function to return a known value
    monkeypatch.setattr('secret.secret', lambda key: 'mocked_secret_key')

    # Mock the requests.post method to simulate a successful reCAPTCHA verification
    def mock_post(url, *args, **kwargs):
        class MockResponse:
            @staticmethod
            def json():
                return {'success': True}

        return MockResponse()

    monkeypatch.setattr('requests.post', mock_post)

    # Send a request to the verify_recaptcha endpoint
    response = client.post('/verify', json={'captchaValue': 'mocked_captcha_value'})

    # Assert that the response is as expected for a successful verification
    assert response.status_code == 200
    assert 'access_token' in response.json

def test_verify_recaptcha_failure(client):
    # Send a request to the verify_recaptcha endpoint
    response = client.post('/verify', json={'captchaValue': 'fake_captcha_value'})

    # Assert that the response is as expected for a failed verification
    assert response.status_code == 401
    assert 'message' in response.json
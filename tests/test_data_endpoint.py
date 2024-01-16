
def test_data_unauthenticated(client):
    response = client.get('/data')
    assert response.status_code == 401 
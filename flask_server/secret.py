from google.cloud import secretmanager

project_number = '274493427411'
def secret(secret):
    client = secretmanager.SecretManagerServiceClient()
    name = f"projects/{project_number}/secrets/{secret}/versions/latest"
    response = client.access_secret_version(name=name)
    return(response.payload.data.decode("UTF-8"))
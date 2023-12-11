import os
from dotenv import load_dotenv
from google.cloud import secretmanager

load_dotenv()

project_id = os.getenv("PROJECT_ID")
def secret(secret):
    client = secretmanager.SecretManagerServiceClient()
    name = f"projects/{project_id}/secrets/{secret}/versions/latest"
    response = client.access_secret_version(name=name)
    return(response.payload.data.decode("UTF-8"))
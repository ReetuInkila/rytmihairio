FROM python:3.8-slim

WORKDIR /app
COPY ./app /app
COPY /app/package.json /workspace/

RUN pip install -r requirements.txt

EXPOSE 5000

CMD ["python", "main.py"]

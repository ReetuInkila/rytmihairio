FROM python:3.8-slim

WORKDIR /app
COPY . .
RUN pip install -r requirements.txt
ENV FLASK_APP=main.py
EXPOSE 5000
CMD ["gunicorn", "-b", ":5000", "main:app"]

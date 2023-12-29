FROM python:3.9

WORKDIR /app
COPY . /app
RUN pip install -r requirements.txt
ENV FLASK_APP=main.py
EXPOSE 5030
CMD ["python", "server.py"]
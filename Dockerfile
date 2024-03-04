FROM node:alpine as frontend
WORKDIR /
COPY ./web-app/package.json ./web-app/yarn.lock ./
RUN yarn
COPY ./web-app/ ./
RUN yarn build


FROM python:3.8-slim

WORKDIR /app
COPY ./flask_server/requirements.txt .

RUN pip install -r requirements.txt

COPY ./flask_server/ ./
COPY --from=frontend /build ./frontend

ENTRYPOINT ["gunicorn", "--bind=0.0.0.0:8080", "main:app"]
EXPOSE 8080
FROM python:3.8-slim

WORKDIR /app

COPY ./app /app

# Install required dependencies
RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

# Set environment variables
ENV PORT 8080

# Expose the specified port
EXPOSE $PORT

# Command to run the application
CMD exec gunicorn --bind :$PORT --workers 1 --threads 8 --timeout 0 main:app
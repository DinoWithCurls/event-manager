FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y postgresql-client gcc libpq-dev && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# copy source code
COPY . .

# explicitly copy scripts to root so ENTRYPOINT works
COPY entrypoint.sh /entrypoint.sh
COPY wait-for-db.sh /wait-for-db.sh

RUN chmod +x /entrypoint.sh /wait-for-db.sh

ENTRYPOINT ["/entrypoint.sh"]
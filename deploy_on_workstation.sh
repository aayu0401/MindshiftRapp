#!/usr/bin/env bash
set -euo pipefail
# Usage: run from the directory that contains the repo zip or extracted folder.
ROOT_DIR=$(pwd)
echo "Deploying mindshiftr-monorepo from ${ROOT_DIR}"

# Ensure docker and docker-compose installed
if ! command -v docker >/dev/null 2>&1; then
  echo "docker is required but not installed"
  exit 1
fi
if ! command -v docker-compose >/dev/null 2>&1; then
  echo "docker-compose is required but not installed"
  exit 1
fi

# Create .env from example if missing
if [ ! -f .env ]; then
  cp .env.example .env
  echo "Please update .env with secure secrets. Generating temporary JWT secrets..."
  sed -i "s/JWT_ACCESS_TOKEN_SECRET=change_me_access/JWT_ACCESS_TOKEN_SECRET=$(openssl rand -hex 24)/" .env
  sed -i "s/JWT_REFRESH_TOKEN_SECRET=change_me_refresh/JWT_REFRESH_TOKEN_SECRET=$(openssl rand -hex 24)/" .env
fi

# Run prisma migrate (ensure postgres container up)

docker-compose up -d db redis

echo "Waiting for database to be ready..."

sleep 5

# Run migration in a temporary container
docker-compose run --rm migrate

# Build and start everything
docker-compose up --build -d

echo "Deployment complete. Frontend: http://localhost:5173 Backend: http://localhost:4000"


#!/usr/bin/env bash
# Exit on error
set -o errexit

# Install frontend dependencies and build the static site
npm install
npm run build

# Navigate to backend and install python dependencies
cd backend
pip install -r requirements.txt

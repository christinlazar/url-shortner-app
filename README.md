
# URL Shortener Application

This is a URL shortener application built with Node.js, Express, Redis, and Docker. The app allows users to shorten long URLs and provides an easy-to-use API for shortening and retrieving URLs.

## Features
- Shorten long URLs.
- Retrieve original URLs using shortened links.
- User authentication via Google OAuth.
- Dockerized application for easy deployment.

## Prerequisites

- Docker installed on your machine.
  - [Install Docker](https://docs.docker.com/get-docker/)
- A Google Developer Account for OAuth configuration.
  - [Google Cloud Console](https://console.cloud.google.com/)
  
## Setup Instructions

### 1. Clone the Repository

Clone the repository to your local machine:


git clone https://github.com/your-username/url-shortener.git
cd url-shortener
2. Set Up Environment Variables
Create a .env file in the root directory of the project. You can use .env.example as a template and fill in the required values.

Example .env file:

GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
REDIRECT_URI=https://url-shortner-app-sjpm.onrender.com/auth/google/callback
PORT=3000
REDIS_URL=redis://localhost:6379 

3. Build and Run with Docker
3.1 Using Docker
If you're running the app with Docker, build and run the Docker image using the following commands:

Build the Docker image:

docker build -t url-shortener .
Run the Docker container:

docker run --env-file .env -p 3000:3000 url-shortener

3.2 Using Docker Compose (Optional)
If your project uses docker-compose for handling multiple services (e.g., Redis and the app), you can run the following:

Build and start the app with docker-compose:

docker-compose up --build
This command will automatically set up and link the necessary services (e.g., the Redis service) and run your app.

4. Google OAuth Setup (Important)
To enable Google OAuth authentication, you must configure your Google Developer OAuth credentials.

Go to Google Cloud Console.
Create a new project (or select an existing one).
Navigate to APIs & Services > Credentials.
Create a new OAuth 2.0 Client ID in the OAuth 2.0 Client IDs section.
Set the Authorized redirect URI to https://url-shortner-app-sjpm.onrender.com/auth/google/callback (for production).
For local development, use http://localhost:3000/auth/google/callback.
Add the following keys to your .env file:
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET

5. Accessing the Application
Once the container is running, open your browser and navigate to:

Local development: http://localhost:3000
Production (Render): https://url-shortner-app-sjpm.onrender.com
6. Stopping the Application
To stop the Docker container, press CTRL+C in the terminal where the container is running. If you're using Docker Compose, run:

docker-compose down

7. Common Issues and Solutions
Redis Client Error: getaddrinfo ENOTFOUND redis
If you get a Redis error like getaddrinfo ENOTFOUND redis, it means that Redis is not found. If you're using Docker Compose, ensure the Redis service is correctly defined. If using Docker, ensure the correct Redis URL is set in the .env file.
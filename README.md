# URL Shortener

## Overview
URL Shortener is a simple web application that allows users to shorten long URLs and track analytics such as the number of clicks and unique users for each shortened URL. It is built using Node.js, Express, MongoDB, and Redis to enhance performance with caching.

## Features
- **URL Shortening**: Allows users to shorten long URLs for easy sharing.
- **Custom Aliases**: Users can provide custom aliases for their shortened URLs.
- **URL Redirection**: Redirects users to the original long URL when the short URL is accessed.
- **Analytics Tracking**: Tracks the number of clicks, unique users, and more for each shortened URL.
- **Caching**: Utilizes Redis for caching URLs and analytics to reduce database load and improve performance.

## Tech Stack
- **Frontend**: React.js (Optional, if you want to add a frontend for the URL shortener)
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Caching**: Redis
- **URL Analytics**: MongoDB Aggregation for tracking analytics

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/Url-shortner.git
   cd Url-shortner
Install dependencies:

bash
Copy
Edit
2. Install Dependencies

npm install

3. Set up MongoDB and Redis (Make sure both services are running).

4. Configure the .env file with your Redis and MongoDB connection details (if applicable):

bash
Copy
Edit
MONGODB_URI=mongodb://localhost:27017/url-shortener
REDIS_URL=redis://localhost:6379

5. Start the application:

npm start
The app should be running at http://localhost:5000.
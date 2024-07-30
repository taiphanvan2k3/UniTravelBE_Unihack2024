# Node.js Backend Project

## Introduction

This project is a backend application developed for `Unihack 2024` using Node.js. It uses the following technologies:

- **ExpressJS**: Web framework for Node.js to build APIs.
- **Firebase Authentication**: User authentication via email.
- **Firebase Storage**: Store uploaded images and videos.
- **Gemini API**: Use Gemini to generate travel itineraries for specific locations or provinces.
- **QR Code**: Create and manage QR codes.
- **PayPal**: Payment gateway for buying tickets.
- **Crawl data**: Crawl tourist attractions from travel pages using **Puppeteer**
- **MongoDB**: NoSQL database for data storage.

## Introduction

## Setup

1. **Clone the Repository**

   ```bash
   git clone https://github.com/yourusername/your-repository.git
   cd your-repository

2. **Install Dependencies**
    ```bash
    npm install
    ```
3. **Configure Environment Variables**

    **With Firebase admin**:
    Download the service account key from Firebase and save it as `key.json` in the root directory of the project.

    Create a .env.development file and configure the necessary environment variables:
    ```bash
    # Environment
    NODE_ENV=Development

    # Server Configuration
    PORT=5001

    # MongoDB
    MONGO_URI=your-mongodb-uri

    # Secret Key 
    SECRET_KEY=your-secret-key

    # Firebase Configuration
    FIREBASE_API_KEY=your-firebase-api-key
    FIREBASE_AUTH_DOMAIN=your-firebase-auth-domain
    FIREBASE_PROJECT_ID=your-firebase-project-id
    FIREBASE_STORAGE_BUCKET=your-firebase-storage-bucket
    FIREBASE_MESSAGING_SENDER_ID=your-firebase-messaging-sender-id
    FIREBASE_APP_ID=your-firebase-app-id
    FIREBASE_MEASUREMENT_ID=your-firebase-measurement-id

    # Redis Configuration
    REDIS_CLOUD_URL=your-redis-cloud-url

    # Gemini API
    API_KEY_GEMINI=your-api-key-gemini
    GEMINI_API_KEY=your-gemini-api-key

    # PayPal Configuration
    PAYPAL_CLIENT_ID=your-paypal-client-id
    PAYPAL_CLIENT_SECRET=your-paypal-client-secret

    # SMTP Configuration
    SMTP_USER=your-smtp-user
    SMTP_PASSWORD=your-smtp-password

    # Storage Bucket
    STORAGE_BUCKET=your-storage-bucket

    ```

**4. Start the Application**
    ```bash
    npm start
    ```

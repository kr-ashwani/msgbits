# 🚀 Msgbits Backend - Real-Time Chat Server

A robust, scalable backend server for the Msgbits real-time messaging platform, built with Express.js and TypeScript. Features secure communication, distributed processing, comprehensive logging, and efficient file handling.

## Table of Contents

- [Features](#features)
- [Demo](#-demo)
- [Screenshots](#-screenshots)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Installation](#installation)
- [Development](#development)
- [Deployment](#deployment)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)
- [Support](#support)

## Features

### Core Backend Features

- **Real-Time Communication**

  - Socket.IO with Redis adapter for scalable real-time messaging
  - WebRTC signaling server for audio/video calls
  - Message queuing with BullMQ for reliable message delivery
  - Real-time user status tracking

- **File Management**

  - Secure file uploads with chunked streaming
  - On-the-fly file encryption/decryption
  - Support for EC2 filesystem and S3 storage
  - Efficient media handling

- **Authentication & Security**

  - JWT-based authentication
  - OAuth integration (Google, Facebook, GitHub)
  - Email verification with Nodemailer
  - Rate limiting and request validation

- **Logging & Monitoring**
  - Comprehensive logging with Winston and Morgan
  - Production logs stored in both filesystem and database
  - Request tracking and error monitoring

## 🚀 Demo

Experience the application live at: [Live Demo](https://msgbits.com)

## 📷 Screenshots

### Landing Page

![Landing Page](/screenshots/landing.png)
_Clean, modern landing page showcasing key features and user benefits_

### Authentication

![Login Interface](/screenshots/login.png)
_Secure login interface with multiple authentication options and OTP verification_

### Chat Interface

![Chat Interface](/screenshots/chat.png)
_Feature-rich chat interface with intuitive navigation and real-time status updates_

### Video Call

![Video Call](/screenshots/video-call.png)
_High-quality video conferencing with up to 4 participants and easy-to-use controls_

### File Sharing

![File Sharing](/screenshots/file-sharing.png)
_Comprehensive file sharing interface with image preview, shared media gallery, and chat room details panel_

### Group Chat Administration

![Group Admin](/screenshots/group-admin.png)
_Advanced group management interface with member controls and admin privileges_

### Group Chat Interface

![Group](/screenshots/group.png)
_Real-time group chat interface with member list and shared media gallery_

### Theme Customization

![Themes](/screenshots/themes.png)
_Four distinct theme options for personalized user experience_

### Scalability Features

- **Distributed Architecture**

  - Stateless server design using Redis for temporary state
  - MongoDB for persistent data storage
  - Node.js cluster support for horizontal scaling

- **Performance Optimization**
  - Redis caching layer
  - Efficient database queries
  - Optimized file streaming
  - Message broker for async operations

## Tech Stack

- **Core Framework:** Express.js, TypeScript
- **Database:** MongoDB
- **Caching:** Redis
- **Message Queue:** BullMQ
- **File Processing:** Busboy
- **Email Service:** Nodemailer
- **Documentation:** Swagger
- **Logging:** Winston, Morgan
- **Validation:** Zod
- **Real-time:** Socket.IO

## Architecture

```plaintext
                                 ┌─────────────┐
                                 │   Client    │
                                 └──────┬──────┘
                                        │
                                 ┌──────▼──────┐
                                 │Load Balancer│
                                 └──────┬──────┘
                                        │
                    ┌──────────────────┬┴┬──────────────────┐
                    │                  │ │                  │
              ┌─────▼────┐      ┌─────▼─▼────┐      ┌─────▼────┐
              │ Express.js│      │ Express.js │      │ Express.js│
              │  Server   │      │  Server    │      │  Server   │
              └─────┬────┘      └─────┬──────┘      └─────┬────┘
                    │                 │                    │
        ┌──────────┴─────────────────┼────────────────────┴──────────┐
        │                            │                               │
   ┌────▼────┐                 ┌─────▼─────┐                   ┌────▼────┐
   │  Redis  │                 │  MongoDB  │                   │   S3    │
   └─────────┘                 └───────────┘                   └─────────┘
```

## Installation

1. Clone the repository:

```bash
git clone https://github.com/kr-ashwani/msgbits_backend.git
cd msgbits-backend
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env` file:

```env
MONGODB_URI_PROD = mongodb_prod_uri
MONGODB_URI_DEV = mongodb_dev_uri
NODE_ENV = node_environment
MONGODB_URI_LOG = mongodb_log_uri

REDIS_PORT = redis_port
REDIS_HOST = redis_host

REFRESH_TOKEN_SECRET_KEY_PROD = prod_refresh_token
REFRESH_TOKEN_SECRET_KEY_DEV = dev_refresh_token
REFRESH_TOKEN_EXP_TIME = refresh_token_exp_time

SMTP_SERVICE = smtp_service
SMTP_PORT = smtp_port
SMTP_SECURE = smtp_secure
SMTP_USER = smtp_user
SMTP_PASS = smtp_password

CLIENT_URL = client_url
SELF_URL = self_url
GITHUB_OAUTH_CLIENT_ID = github_oauth_client_id
GITHUB_OAUTH_CLIENT_SECRET = github_oauth_client_id
REDIRECT_CLIENT_URL = client_redirect_url
GOOGLE_CLIENT_ID = google_oauth_client_id


UPLOAD_FILES_TO_S3 = upload_to_s3

AWS_REGION = aws_region
AWS_ACCESS_KEY_ID = aws_access_key
AWS_SECRET_ACCESS_KEY = aws_secret_key
S3_BUCKET = s3_bucket

ENCRYPTION_KEY = enc_key

SOCKETUI_USERNAME = socket_ui_username
SOCKETUI_PASSWORD = socket_ui_password
```

4. Start development server:

```bash
npm run dev
```

## Development

### Directory Structure

```
src/
├── config/          # Configuration files
├── controllers/     # Route controllers
├── middleware/      # Custom middleware
├── models/         # Database models
├── routes/         # API routes
├── services/       # Business logic
├── utils/          # Utility functions
└── validators/     # Zod schemas
```

### Best Practices

- Use TypeScript strict mode
- Implement proper error handling
- Write comprehensive tests
- Follow consistent coding style
- Document API endpoints
- Log important events

## Deployment

### Continuous Integration/Deployment

The application uses GitHub Actions for automated deployment to EC2:

1. On push to main branch:

   - Build is triggered
   - Tests are run
   - Docker image is created and pushed to registry
   - New image is deployed to EC2

2. Production Environment:

   - Running on EC2 instance
   - Redis container for caching and session management
   - Environment variables loaded from production config
   - Automated SSL certificate renewal

3. Monitoring:
   - Application logs stored on EC2 and database
   - Error tracking and alerting
   - Resource utilization monitoring

### Scaling Strategy

- Horizontal scaling using Node.js cluster
- Redis for session storage across instances
- Load balancer distribution
- Auto-scaling based on metrics

## API Documentation

API documentation available at `/api-docs` when running the server, featuring:

- Complete endpoint documentation
- Request/response schemas
- Authentication details
- Example requests
- Error responses

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## License

[MIT](https://choosealicense.com/licenses/mit/)

## Support

- Email: support@msgbits.com
- Discord: [Join our community](https://discord.gg/msgbits)

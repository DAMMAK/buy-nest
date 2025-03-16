# NestJS Microservices E-commerce Platform

A comprehensive, production-ready e-commerce platform built using NestJS, microservices architecture, and Docker. This scalable application follows best practices for cloud-native development and implements numerous advanced features.

## Architecture

This project follows a microservices architecture with the following components:

- **API Gateway**: Entry point for all client requests, with routing, authentication, rate limiting, and security features
- **User Service**: Handles user registration, authentication, and profile management
- **Product Service**: Manages product listings, categories, and inventory with caching
- **Cart Service**: Manages users' shopping carts with real-time updates
- **Order Service**: Processes orders and manages order history
- **Payment Service**: Handles payment processing with Stripe/PayPal integration and circuit breaker pattern
- **Notification Service**: Sends email/SMS notifications via event-driven architecture

## Key Features

### Infrastructure & Deployment
- **Docker & Docker Compose**: Containerization for consistent development and deployment
- **Kubernetes Support**: Production-ready Kubernetes deployment files
- **CI/CD Pipeline**: Automated testing, building, and deployment with GitHub Actions
- **Graceful Shutdown**: Proper handling of application shutdown for reliability

### Scalability & Resilience
- **Microservices Architecture**: Independent, scalable services
- **Event-Driven Communication**: Using RabbitMQ for asynchronous messaging
- **Service Discovery**: With Consul for dynamic service registration/discovery
- **Circuit Breaker Pattern**: Protection against cascading failures
- **Rate Limiting & Throttling**: Protection against traffic spikes

### Performance & Monitoring
- **Redis Caching**: For improved performance on frequently accessed data
- **Database Migrations**: Type-safe schema changes with TypeORM
- **Centralized Logging**: Using ELK stack (Elasticsearch, Logstash, Kibana)
- **Metrics & Monitoring**: Using Prometheus and Grafana
- **Health Checks**: For improved observability and monitoring

### Security
- **JWT Authentication**: Secure user authentication
- **Role-Based Access Control**: Granular permissions
- **Security Headers**: Protection against common web vulnerabilities
- **API Rate Limiting**: Protection against brute force attacks
- **Data Validation**: Input validation across all services

## Technologies Used

- **NestJS**: Progressive Node.js framework for building efficient, scalable applications
- **TypeScript**: For type-safe development
- **TypeORM**: ORM for TypeScript and JavaScript
- **PostgreSQL**: Main database for persistent data
- **Redis**: For caching and rate limiting
- **RabbitMQ**: For event-driven communication
- **Docker & Docker Compose**: For containerization and orchestration
- **Kubernetes**: For production deployment and scaling
- **Consul**: For service discovery
- **ELK Stack**: For centralized logging
- **Prometheus & Grafana**: For monitoring and alerting
- **Stripe**: For payment processing
- **SendGrid & Twilio**: For email and SMS notifications

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Node.js (v16+)
- npm or yarn

### Installation

1. Clone the repository:

git clone https://github.com/yourusername/ecommerce-platform.git
cd ecommerce-platform

```bash Create a .env file in the root directory with the following variables:
```
JWT_SECRET=your-jwt-secret
STRIPE_SECRET_KEY=your-stripe-secret-key
SENDGRID_API_KEY=your-sendgrid-api-key
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=your-twilio-phone-number

```
## API Endpoints

### Authentication
- POST /auth/login - User login

### Users
- POST /users - Register a new user
- GET /users - Get all users (admin)
- GET /users/:id - Get user by ID
- PUT /users/:id - Update user
- DELETE /users/:id - Delete user

### Products
- POST /products - Create a new product
- GET /products - Get all products
- GET /products/:id - Get product by ID
- PUT /products/:id - Update product
- DELETE /products/:id - Delete product

### Cart
- GET /cart - Get user's cart
- POST /cart/items - Add item to cart
- PUT /cart/items/:productId - Update item quantity
- DELETE /cart/items/:productId - Remove item from cart
- DELETE /cart - Clear cart

### Orders
- POST /orders - Create a new order
- GET /orders - Get user's orders
- GET /orders/:id - Get order by ID
- PUT /orders/:id/status - Update order status

### Payments
- POST /payments/process - Process payment
- GET /payments/order/:orderId - Get payment by order ID

## Development

### Running Individual Services

For development, you can run individual services:

```bash
# Start dependencies (Kafka, PostgreSQL, Redis)
docker-compose up -d zookeeper kafka user-db product-db cart-db order-db payment-db

# Run a specific service
cd user-service
npm install
npm run start:dev
```

#### Project Structure
```
e-commerce-platform/
├── api-gateway/           # API Gateway service
├── user-service/          # User management service
├── product-service/       # Product catalog service
├── cart-service/          # Shopping cart service
├── order-service/         # Order management service
├── payment-service/       # Payment processing service
├── notification-service/  # Notification service
├── shared-lib/            # Shared code and interfaces
├── docker-compose.yml     # Docker Compose configuration
└── README.md              # Project documentation
```




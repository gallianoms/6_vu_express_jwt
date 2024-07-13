# Express JWT

This project demonstrates a basic authentication and authorization system using Express.js and JWT (JSON Web Tokens). It provides endpoints to authenticate users and access data based on user roles.

## Technologies Used

- Express.js
- CORS
- JSON Web Tokens (JWT)

## Installation

To run this project locally, make sure you have Node.js installed. Then, clone the repository and install dependencies:

```bash
git clone https://github.com/gallianoms/6_vu_express_jwt
cd 6_vu_express_jwt
npm install
npm run dev
```

## Getting Started

1. Set up environment variables:

   - `PORT`: Port number (default is 3000)
   - `SECRET_KEY`: Secret key for JWT

2. Start the server:

## API Endpoints

Base URL Local: `http://localhost:3000`

Base URL Online: `https://express-jwt-gallianoms-gallianoms-projects.vercel.app?_vercel_share=Yi2jUrNLFVVjInnPApEi825FlL1rtASY`

### Ping

- **GET** `/api/login/ping`
  - Returns "pong" to indicate server is running.

### Authentication

- **POST** `/api/login/authenticate`
  - Authenticates user based on provided credentials (role and password).
  - Returns a JWT token upon successful authentication.
  - Example JSON payload (send header as Content-Type: application/json):
    ```json
    {
      "role": "admin",
      "password": "admin"
    }
    ```
  - Valid roles: admin, tester, user.

### Admin Resources

- **GET** `/api/admin`

  - Requires JWT token in `Authorization` header.
  - Returns a list of all admins.

- **GET** `/api/admin/:id`
  - Requires JWT token in `Authorization` header.
  - Returns details of the admin with specified ID.

### Customer Resources

- **GET** `/api/customers`

  - Requires JWT token in `Authorization` header.
  - Returns a list of all customers.

- **GET** `/api/customers/:id`
  - Requires JWT token in `Authorization` header.
  - Returns details of the customer with specified ID.

## JWT Token

- Tokens issued by `/api/login/authenticate` endpoint are valid for 6 hours for practicality, you should change it in production.

## Error Handling

- **401 Unauthorized**: Invalid credentials or missing JWT token.
- **403 Forbidden**: Invalid or expired JWT token.
- **404 Not Found**: Resource (admin or customer) not found.

## Contributing

Contributions are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

MIT

This README provides a basic structure to get users started with the project, including installation instructions, API documentation, and error handling guidelines.

### Reference Guide

- [Medium Article on JWT Authentication in Node.js](https://medium.com/@diego.coder/autenticaci%C3%B3n-en-node-js-con-json-web-tokens-y-express-ed9d90c5b579)
- [DigitalOcean Tutorial on Node.js JWT with Express.js](https://www.digitalocean.com/community/tutorials/nodejs-jwt-expressjs)

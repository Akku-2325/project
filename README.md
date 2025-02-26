# Jewelry Store Backend API

## Project Overview

This is a RESTful backend API for a jewelry store, built with Node.js and MongoDB. It provides endpoints for user authentication, product management, and order creation. The API supports role-based access control (RBAC), pagination, sorting, and filtering for enhanced functionality.

## Technologies Used

*   **Node.js:** JavaScript runtime environment
*   **MongoDB:** NoSQL database
*   **Mongoose:** MongoDB object modeling tool
*   **JWT (JSON Web Token):** For secure authentication
*   **bcrypt:** For password hashing
*   **validator.js:** For data validation
*   **dotenv:** For managing environment variables
*   **cors:** For enabling Cross-Origin Resource Sharing

## Setup Instructions

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/Akku-2325/project.git
    cd jewelry-store-backend
    ```

    also front: 
    https://github.com/Akku-2325/project2.git

2.  **Install dependencies:**

    npm install

3.  **Configure environment variables:**

    *   Create a `.env` file in the root directory of the project.
    *   Add the following variables to the `.env` file:

        ```
        PORT=3000
        MONGODB_URI=<your_mongodb_connection_string>
        JWT_SECRET=<your_jwt_secret>
        ```

    *   **`MONGODB_URI`**: The connection string to MongoDB Atlas database. Example: `mongodb+srv://webappuser:webappuser@clusterweb4.pqn1r.mongodb.net/`. 
  
4.  **Run the server:**

    ```bash
    node server.js
    ```

## Deployment

The backend API is deployed on Render:

*   **API URL:** `https://jewelry-store-zkn5.onrender.com`  
To deploy the project yourself:

1.  Create an account on [Render](https://render.com).
2.  Create a new web service and connect it to your GitHub repository.
3.  Configure the environment variables in the Render dashboard.
4.  Deploy the web service.

## API Documentation

### Authentication (Public Endpoints)

*   **POST /auth/register:** Register a new user.

    *   Request body:

        ```json
        {
          "username": "newuser",
          "email": "newuser@example.com",
          "password": "password123"
        }
        ```

    *   Response (success):

        ```json
        {
          "message": "User registered successfully",
          "token": "<jwt_token>"
        }
        ```

*   **POST /auth/login:** Authenticate user and return JWT.

    *   Request body:

        ```json
        {
          "email": "newuser@example.com",
          "password": "password123"
        }
        ```

    *   Response (success):

        ```json
        {
          "message": "Logged in successfully",
          "token": "<jwt_token>"
        }
        ```

### User Management (Private Endpoints)

*   **GET /users/profile:** Get logged-in user's profile (requires JWT).
    *   Headers: `Authorization: Bearer <jwt_token>`

    *   Response (success):

        ```json
        {
          "_id": "...",
          "username": "newuser",
          "email": "newuser@example.com",
          "role": "user",
          "createdAt": "...",
          "updatedAt": "...",
          "__v": 0
        }
        ```

*   **PUT /users/profile:** Update logged-in user's profile (requires JWT).
    *   Headers: `Authorization: Bearer <jwt_token>`

    *   Request body:

        ```json
        {
          "username": "updateduser",
          "email": "updated@example.com"
        }
        ```

    *   Response (success):

        ```json
        {
          "_id": "...",
          "username": "updateduser",
          "email": "updated@example.com",
          "role": "user",
          "createdAt": "...",
          "updatedAt": "...",
          "__v": 0
        }
        ```

### Product Management (Private Endpoints - Admin Only)

*   **POST /products:** Create a new product (requires JWT for Admin).
    *   Headers: `Authorization: Bearer <admin_jwt_token>`

    *   Request body:

        ```json
        {
          "name": "Gold Ring",
          "description": "Beautiful gold ring",
          "price": 1500,
          "category": "rings",
          "images": ["https://example.com/gold_ring.jpg"],
          "stockQuantity": 10
        }
        ```

    *   Response (success):

        ```json
        {
          "_id": "...",
          "name": "Gold Ring",
          "description": "Beautiful gold ring",
          "price": 1500,
          "category": "rings",
          "images": ["https://example.com/gold_ring.jpg"],
          "stockQuantity": 10,
          "createdAt": "...",
          "updatedAt": "...",
          "__v": 0
        }
        ```

*   **GET /products:** Get all products (supports pagination, sorting, and filtering).

    *   Query parameters:
        *   `page`: Page number (default: 1).  Example: `/products?page=2`
        *   `limit`: Products per page (default: 10). Example: `/products?limit=5`
        *   `sortBy`: Field to sort by (e.g., `price`, `name`, `createdAt`). Example: `/products?sortBy=price`
        *   `sortOrder`: Sort order (`asc` or `desc`). Example: `/products?sortBy=price&sortOrder=desc`
        *   `category`: Filter by category (e.g., `rings`, `necklaces`). Example: `/products?category=rings`
    *   Response (success):

        ```json
        {
          "products": [
            {
              "_id": "...",
              "name": "Gold Ring",
              "description": "Beautiful gold ring",
              "price": 1500,
              "category": "rings",
              "images": ["https://example.com/gold_ring.jpg"],
              "stockQuantity": 10,
              "createdAt": "...",
              "updatedAt": "...",
              "__v": 0
            },
            ...
          ],
          "page": 1,
          "limit": 10,
          "totalPages": 2,
          "totalProducts": 15
        }
        ```

*   **GET /products/:id:** Get a specific product by ID.

*   **PUT /products/:id:** Update a specific product (requires JWT for Admin).
    *   Headers: `Authorization: Bearer <admin_jwt_token>`
    *   Request body:

        ```json
        {
          "price": 1600,
          "stockQuantity": 8
        }
        ```

*   **DELETE /products/:id:** Delete a specific product (requires JWT for Admin).
    *   Headers: `Authorization: Bearer <admin_jwt_token>`

### Order Management (Private Endpoint)

*   **POST /orders:** Create a new order (requires JWT).
    *   Headers: `Authorization: Bearer <jwt_token>`

    *   Request body:

        ```json
        {
          "items": [
            {
              "product": "<product_id_1>",
              "quantity": 1
            },
            {
              "product": "<product_id_2>",
              "quantity": 2
            }
          ],
          "totalAmount": 700
        }
        ```

## Role-Based Access Control (RBAC)

*   **Admin:** Can create, read, update, and delete products.
*   **User:** Can register, login, view products, create orders, and view/update their profile.
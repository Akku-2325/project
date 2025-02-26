# Jewelry Store Backend API

## Project Overview

This is a RESTful backend API for a jewelry store, built with Node.js and MongoDB. It provides endpoints for user authentication, product management, order creation, and shopping cart functionality. The API supports role-based access control (RBAC), pagination, sorting, and filtering for enhanced functionality.

## Technologies Used

*   **Node.js:** JavaScript runtime environment
*   **MongoDB:** NoSQL database
*   **Mongoose:** MongoDB object modeling tool
*   **JWT (JSON Web Token):** For secure authentication
*   **bcrypt:** For password hashing
*   **validator.js:** For data validation
*   **dotenv:** For managing environment variables
*   **cors:** For enabling Cross-Origin Resource Sharing
*   **Express:** Fast, unopinionated, minimalist web framework for Node.js

## Setup Instructions

1.  **Prerequisites:**

    *   **Node.js:** Ensure you have Node.js version 16 or higher installed. You can download it from [nodejs.org](https://nodejs.org/).
    *   **npm:** Node Package Manager (comes with Node.js).
    *   **MongoDB Atlas Account:** You'll need an account on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) to host your database.

2.  **Clone the repository:**

    ```bash
    git clone <your_repository_url>
    cd <your_project_directory>
    ```

3.  **Install dependencies:**

    ```bash
    npm install
    ```

4.  **Configure environment variables:**

    *   Create a `.env` file in the root directory of the project.
    *   Add the following variables to the `.env` file:

        ```
        PORT=3000
        MONGODB_URI=<your_mongodb_connection_string>
        JWT_SECRET=<your_jwt_secret>
        ```

        *   **`PORT`**: The port the server will listen on (defaults to 3000).
        *   **`MONGODB_URI`**: The connection string to your MongoDB Atlas database.

            *   **How to get your MongoDB URI:**
                1.  Log in to your MongoDB Atlas account.
                2.  Create a new cluster or use an existing one.
                3.  Click the "Connect" button for your cluster.
                4.  Choose "Connect your application."
                5.  Select Node.js as your driver and copy the connection string.
                6.  Replace `<password>` with the password for your database user. The connection string should look like this:  `mongodb+srv://<username>:<password>@cluster0.mongodb.net/<database_name>?retryWrites=true&w=majority`
                7.  **Important:** Ensure your MongoDB Atlas cluster has network access configured to allow connections from Render (or your local machine if testing locally). You can configure this in the "Network Access" section of your MongoDB Atlas dashboard.
                8.  **Also ensure** that you have created a user for the database with the correct privileges. You can create a user in the "Database Access" section.

        *   **`JWT_SECRET`**: A strong, randomly generated secret key for signing JWTs.  **Important: Keep this secret secure!**

            *   Generate a key using: `openssl rand -base64 32` (or any other method to generate a random string).

5.  **Run the server:**

    ```bash
    node server.js
    ```

## Deployment

The backend API is deployed on Render:

*   **API URL:** `https://your-render-app-name.onrender.com` (Replace with your actual Render app URL)  **Important: Use HTTPS!**

**To deploy the project yourself on Render:**

1.  Create an account on [Render](https://render.com).
2.  Create a new web service and connect it to your GitHub repository.
3.  **Configure environment variables:** In the Render dashboard, add the `PORT`, `MONGODB_URI`, and `JWT_SECRET` environment variables.
4.  **Set the Build and Start Commands:**  Specify the following:
    *   **Build Command:** `npm install`
    *   **Start Command:** `node server.js`
5.  Deploy the web service.  See the [Render documentation](https://render.com/docs/deploy-node-web-service) for more detailed instructions.

## API Documentation

All API endpoints return JSON responses.  Ensure you set the `Content-Type` header to `application/json` for POST and PUT requests.

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
          "token": "<jwt_token>",
          "user": {
                "id": "...",
                "username": "newuser",
                "email": "newuser@example.com",
                "role": "user"
            }
        }
        ```

    *   Response (error, email already registered):

        ```json
        {
          "message": "Email is already registered"
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
          "token": "<jwt_token>",
          "user": {
                "id": "...",
                "username": "newuser",
                "email": "newuser@example.com",
                "role": "user"
            }
        }
        ```

    *   Response (error, invalid credentials):

        ```json
        {
          "message": "Invalid credentials"
        }
        ```

### User Management (Private Endpoints)

*   **GET /users/profile:** Get logged-in user's profile (requires JWT).

    *   Headers: `Authorization: Bearer <jwt_token>` (Replace `<jwt_token>` with your actual JWT token)

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

    *   Response (error, no token provided):

        ```json
        {
          "message": "No token, authorization denied"
        }
        ```

*   **PUT /users/profile:** Update logged-in user's profile (requires JWT).

    *   Headers: `Authorization: Bearer <jwt_token>` (Replace `<jwt_token>` with your actual JWT token)
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

    *   Headers:
        *   `Authorization: Bearer <admin_jwt_token>` (Replace `<admin_jwt_token>` with your actual admin JWT token)
        *   `Content-Type: application/json`

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

    *   Response (error, insufficient role):

        ```json
        {
          "message": "Forbidden: Insufficient role"
        }
        ```

*   **GET /products:** Get all products (supports pagination, sorting, and filtering).

    *   Query parameters:
        *   `page`: Page number (default: 1).  Example: `/products?page=2`
        *   `limit`: Products per page (default: 10). Example: `/products?limit=5`
        *   `sortBy`: Field to sort by (e.g., `price`, `name`, `createdAt`). Example: `/products?sortBy=price`
        *   `sortOrder`: Sort order (`asc` or `desc`). Example: `/products?sortBy=price&sortOrder=desc`
        *   `category`: Filter by category (e.g., `rings`, `necklaces`, `earrings`, `bracelets`). Example: `/products?category=rings`

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

    *   Response (success, no products):

        ```json
        {
          "products": [],
          "page": 1,
          "limit": 10,
          "totalPages": 0,
          "totalProducts": 0
        }
        ```

*   **GET /products/:id:** Get a specific product by ID.

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

    *   Response (error, product not found):

        ```json
        {
          "message": "Product not found"
        }
        ```

*   **PUT /products/:id:** Update a specific product (requires JWT for Admin).

    *   Headers:
        *   `Authorization: Bearer <admin_jwt_token>` (Replace `<admin_jwt_token>` with your actual admin JWT token)
        *   `Content-Type: application/json`
    *   Request body:

        ```json
        {
          "price": 1600,
          "stockQuantity": 8
        }
        ```

    *   Response (success):

        ```json
        {
          "_id": "...",
          "name": "Gold Ring",
          "description": "Beautiful gold ring",
          "price": 1600,
          "category": "rings",
          "images": ["https://example.com/gold_ring.jpg"],
          "stockQuantity": 8,
          "createdAt": "...",
          "updatedAt": "...",
          "__v": 0
        }
        ```

*   **DELETE /products/:id:** Delete a specific product (requires JWT for Admin).

    *   Headers: `Authorization: Bearer <admin_jwt_token>` (Replace `<admin_jwt_token>` with your actual admin JWT token)

    *   Response (success):

        ```json
        {
          "message": "Product deleted"
        }
        ```

### Order Management (Private Endpoints)

*   **POST /orders:** Create a new order (requires JWT).

    *   Headers:
        *   `Authorization: Bearer <jwt_token>` (Replace `<jwt_token>` with your actual JWT token)
        *   `Content-Type: application/json`

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
          "shippingAddress": {
            "street": "123 Main St",
            "city": "Anytown",
            "state": "CA",
            "zip": "91234"
          },
          "paymentMethod": "Credit Card"
        }
        ```

        *   **Important:** Replace `<product_id_1>` and `<product_id_2>` with the actual `_id` values of products from your database.
        *   **shippingAddress requirements:**
            *   `street`: String, required.
            *   `city`: String, required.
            *   `state`: String, required.
            *   `zip`: String, required.
        *   `paymentMethod`: String, required.

    *   Response (success):

        ```json
        {
          "message": "Checkout successful",
          "order": {
            "_id": "...",
            "user": "...",
            "items": [
              {
                "product": "...",
                "quantity": 1,
                "_id": "..."
              },
              {
                "product": "...",
                "quantity": 2,
                "_id": "..."
              }
            ],
            "totalAmount": 700,
            "orderDate": "...",
            "status": "processing",
            "shippingAddress": {
              "street": "123 Main St",
              "city": "Anytown",
              "state": "CA",
              "zip": "91234"
            },
            "paymentMethod": "Credit Card",
            "__v": 0
          }
        }
        ```

### Cart Management (Private Endpoints)
*   **GET /orders/cart:** Get logged-in user's cart (requires JWT).

    * Headers: `Authorization: Bearer <jwt_token>`

*   **POST /orders/cart/items:** Add item to cart (requires JWT).

    * Headers: `Authorization: Bearer <jwt_token>`
    * Request body:

        ```json
        {
            "productId": "<product_id>",
            "quantity": 1,
            "price": 1500
        }
        ```

*   **PUT /orders/cart/items/:productId:** Update item quantity in cart (requires JWT).

    * Headers: `Authorization: Bearer <jwt_token>`
    * Request body:

        ```json
        {
            "quantity": 2,
            "price": 1500
        }
        ```

*   **DELETE /orders/cart/items/:productId:** Remove item from cart (requires JWT).

    * Headers: `Authorization: Bearer <jwt_token>`

*   **DELETE /orders/cart:** Clear cart (cancel order) (requires JWT).

    * Headers: `Authorization: Bearer <jwt_token>`

## Role-Based Access Control (RBAC)

*   **Admin:** Can create, read, update, and delete products.  Requires a valid JWT with the "admin" role.
*   **User:** Can register, login, view products, create orders, view/update their profile, and manage their shopping cart. Requires a valid JWT (no specific role needed).

## Error Handling

The API uses a global error handler to provide consistent error responses.  Error responses typically include a `message` field describing the error.  Common error codes include:

*   **400 Bad Request:**  Invalid input data.
*   **401 Unauthorized:**  Missing or invalid JWT token.
*   **403 Forbidden:**  Insufficient permissions (e.g., a user trying to access an admin-only endpoint).
*   **404 Not Found:**  The requested resource was not found.
*   **500 Internal Server Error:**  An unexpected error occurred on the server.

## Additional Notes

*   This API is a backend component and requires a separate frontend application to interact with it.
*   Remember to secure your API by implementing proper authentication and authorization mechanisms.
*   Always validate and sanitize user input to prevent security vulnerabilities.
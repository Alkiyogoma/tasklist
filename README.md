# Properties Management App - Backend Documentation

## Overview

This repository contains the Laravel backend for the Properties Management application. The backend provides API endpoints to manage users, properties, and utility bills, with authentication handled by Laravel Sanctum.

## Tech Stack

- **Backend Framework**: Laravel
- **Authentication**: Laravel Sanctum
- **Database**: MySQL/PostgreSQL
- **Frontend**: Next.js (separate repository)

## Architecture

This application follows the MVC (Model-View-Controller) architecture with additional emphasis on:

- **Dependency Injection**: Services and repositories are injected where needed
- **Interface Segregation**: Interfaces are used to define contracts for implementation
- **Repository Pattern**: Database operations are abstracted into repository classes
- **Service Layer**: Business logic is contained in service classes

## Database Schema

### Tables

1. **users**

   - `id` - Primary key
   - `name` - User's full name
   - `email` - User's email address (unique)
   - `password` - Hashed password
   - `email_verified_at` - Timestamp for email verification
   - `remember_token` - For "remember me" functionality
   - `created_at` - Timestamp for record creation
   - `updated_at` - Timestamp for record updates

2. **properties**

   - `id` - Primary key
   - `name` - Property name
   - `address` - Property address
   - `type` - Property type (apartment, house, commercial, etc.)
   - `created_at` - Timestamp for record creation
   - `updated_at` - Timestamp for record updates

3. **utility_bills**
   - `id` - Primary key
   - `property_id` - Foreign key to properties table
   - `bill_type` - Type of utility (water, electricity, gas, internet, etc.)
   - `amount` - Bill amount
   - `bill_date` - Date the bill was issued
     - `user_id` - Foreign key to users table (current user, nullable)
   - `paid_date` - Date the bill was paid (nullable)
   - `created_at` - Timestamp for record creation
   - `updated_at` - Timestamp for record updates

### Relationships

- A user can add multiple utility bills (one-to-many)
- A property can have multiple utility bills (one-to-many)

## API Endpoints

### Authentication

- `POST /api/register` - Register a new user
- `POST /api/login` - Login and get auth token
- `POST /api/logout` - Logout and invalidate token
- `GET /api/user` - Get authenticated user details

### Properties

- `GET /api/properties` - List all properties (with filtering options)
- `GET /api/properties/{id}` - Get a specific property details
- `POST /api/properties` - Create a new property
- `PUT /api/properties/{id}` - Update property details
- `DELETE /api/properties/{id}` - Delete a property

### Utility Bills

- `GET /api/properties/{property_id}/utility-bills` - List all utility bills for a property
- `GET /api/utility-bills/{id}` - Get specific utility bill details
- `POST /api/utility-bills` - Create a new utility bill
- `PUT /api/utility-bills/{id}` - Update utility bill details
- `DELETE /api/utility-bills/{id}` - Delete a utility bill

## Setup Instructions

### Prerequisites

- PHP >= 8.1
- Composer
- MySQL or PostgreSQL
- Node.js >= 16.x (for the frontend)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Alkiyogoma/tasklist.git
   cd tasklist_backend
   ```

2. Install PHP dependencies:

   ```bash
   composer install
   ```

3. Create environment file:

   ```bash
   cp .env.example .env
   ```

4. Configure your database in the `.env` file:

   ```
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=properties_management
   DB_USERNAME=root
   DB_PASSWORD=
   ```

5. Generate application key:

   ```bash
   php artisan key:generate
   ```

6. Run database migrations:

   ```bash
   php artisan migrate
   ```

7. Seed the database with test data (optional):

   ```bash
   php artisan db:seed
   ```

8. Configure Sanctum:

   ```bash
   php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
   ```

9. Update CORS in `config/cors.php` to allow requests from your frontend:

   ```php
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],
    'allowed_origins' => ['http://localhost:3000'],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,
   ```

10. Start the development server:
    ```bash
    php artisan serve
    ```

### Connecting Next.js Frontend

1. In your Next.js project, install axios or use fetch for API calls
2. Set the base URL in your environment:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8000/api
   NEXT_BACKEND_API_URL=http://localhost:8000
   ```
3. Configure your Next.js app to send credentials with requests:

   ```javascript
   // With axios
   axios.defaults.withCredentials = true;

   // With fetch
   fetch(url, {
     credentials: "include",
     // other options
   });
   ```

## Important Decisions and Assumptions

### Authentication Strategy

- We've chosen Laravel Sanctum over JWT because:
  - Sanctum provides a simpler implementation for SPA authentication
  - It supports both token-based API and session-based authentication
  - It fits well with Next.js frontend which can maintain cookies

### OOP Implementation

- **Repository Pattern**: All database operations are abstracted into repository classes to decouple the data access layer from business logic
- **Service Layer**: Business logic is contained in service classes that depend on repositories
- **Dependency Injection**: Services and repositories are injected via constructor injection
- **Interfaces**: Each repository and service implements an interface to allow for easy swapping of implementations

### Validation

- All input validation is handled at the controller level using Laravel's built-in validation
- Custom validation rules are implemented for specific business requirements

### Error Handling

- API returns consistent error formats with appropriate HTTP status codes
- Custom exception handlers are implemented to convert exceptions to API responses

### Authorization

- Policy classes are used to define who can perform what actions on which resources
- Authorization checks are performed at the controller level

### Performance Considerations

- Eager loading is used to prevent N+1 query problems
- API resources are used to transform models to JSON responses
- Caching is implemented for frequently accessed resources

## Future Enhancements

- Implement notifications for rent and utility bill due dates
- Add reporting and analytics features
- Implement file uploads for property images and documents
- Add maintenance request functionality

## Troubleshooting

### CORS Issues

If you're experiencing CORS issues when connecting your Next.js frontend:

1. Ensure your frontend URL is listed in the `allowed_origins` array in `config/cors.php`
2. Make sure `supports_credentials` is set to `true`
3. Check that your frontend is sending credentials with requests

### Authentication Issues

If authentication is not working properly:

1. Ensure the Sanctum middleware is properly set up in your routes file
2. Check that your frontend is sending the CSRF token with requests
3. Verify that cookies are being properly set and sent

## About Laravel

Laravel is a web application framework with expressive, elegant syntax. We believe development must be an enjoyable and creative experience to be truly fulfilling.

# Properties Management App - Backend Documentation

## Overview

This repository contains the Laravel backend for the Properties Management application. The backend provides API endpoints to manage users, properties, and utility bills, with authentication handled by Laravel Sanctum.

## Tech Stack

-   **Backend Framework**: Laravel
-   **Authentication**: Laravel Sanctum
-   **Database**: MySQL/PostgreSQL
-   **Frontend**: Next.js (separate repository)

## Architecture

This application follows the MVC (Model-View-Controller) architecture with additional emphasis on:

-   **Dependency Injection**: Services and repositories are injected where needed
-   **Interface Segregation**: Interfaces are used to define contracts for implementation
-   **Repository Pattern**: Database operations are abstracted into repository classes
-   **Service Layer**: Business logic is contained in service classes

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
    - `type` - Property type (residential, commercial, etc.)
    - `created_at` - Timestamp for record creation
    - `updated_at` - Timestamp for record updates

3. **utility_bills**
    - `id` - Primary key
    - `property_id` - Foreign key to properties table
    - `type` - Type of utility (water, electricity, gas, etc.)
    - `amount` - Bill amount
    - `bill_date` - Date the bill was issued
    - `user_id` - Foreign key to users table (current user)
    - `created_at` - Timestamp for record creation
    - `updated_at` - Timestamp for record updates

### Relationships

-   A user can add multiple utility bills (one-to-many)
-   A property can have multiple utility bills (one-to-many)

## API Endpoints

### Authentication

-   `POST /api/register` - Register a new user
-   `POST /api/login` - Login and get auth token
-   `POST /api/logout` - Logout and invalidate token
-   `GET /api/user` - Get authenticated user details

### Properties

-   `GET /api/properties` - List all properties (with filtering options)
-   `GET /api/properties/{id}` - Get a specific property details
-   `POST /api/properties` - Create a new property
-   `PUT /api/properties/{id}` - Update property details
-   `DELETE /api/properties/{id}` - Delete a property

### Utility Bills

-   `GET /api/properties/{property_id}/utility-bills` - List all utility bills for a property
-   `GET /api/utility-bills/{id}` - Get specific utility bill details
-   `POST /api/utility-bills` - Create a new utility bill
-   `PUT /api/utility-bills/{id}` - Update utility bill details
-   `DELETE /api/utility-bills/{id}` - Delete a utility bill

## Setup Instructions

### Prerequisites

-   PHP >= 8.1
-   Composer
-   MySQL or PostgreSQL
-   Node.js >= 16.x (for the frontend)

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

-   We've chosen Laravel Sanctum over JWT because:
    -   Sanctum provides a simpler implementation for SPA authentication
    -   It supports both token-based API and session-based authentication
    -   It fits well with Next.js frontend which can maintain cookies

### OOP Implementation

-   **Repository Pattern**: All database operations are abstracted into repository classes to decouple the data access layer from business logic
-   **Service Layer**: Business logic is contained in service classes that depend on repositories
-   **Dependency Injection**: Services and repositories are injected via constructor injection
-   **Interfaces**: Each repository and service implements an interface to allow for easy swapping of implementations

### Validation

-   All input validation is handled at the controller level using Laravel's built-in validation
-   Custom validation rules are implemented for specific business requirements

### Error Handling

-   API returns consistent error formats with appropriate HTTP status codes
-   Custom exception handlers are implemented to convert exceptions to API responses

### Authorization

-   Policy classes are used to define who can perform what actions on which resources
-   Authorization checks are performed at the controller level

### Performance Considerations

-   Eager loading is used to prevent N+1 query problems
-   API resources are used to transform models to JSON responses
-   Caching is implemented for frequently accessed resources

## Future Enhancements

-   Implement notifications for rent and utility bill due dates
-   Add reporting and analytics features
-   Implement file uploads for property images and documents
-   Add maintenance request functionality
-   User role and permissions to define who can perform what actions on which resources

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

# Project Tests Documentation

This documentation provides an overview of the unit tests created for the Property and UtilityBill models in our Laravel application.

## Overview

These tests ensure that our models function correctly, validating:

-   Model attributes and fillable properties
-   UUID generation via the HasUuid trait
-   Relationship definitions
-   Attribute casting
-   Database interactions

## Test Structure

### Property Model Tests

The `PropertyTest` class tests the core functionality of the Property model:

```php
// Tests\Unit\PropertyTest
```

#### Test Cases:

1. **Fillable Attributes Test**

    - Verifies that only the expected fields can be mass-assigned
    - Fields tested: 'name', 'address', 'type'

2. **UUID Generation Test**

    - Confirms the HasUuid trait properly generates a UUID
    - Verifies that models have both an auto-incrementing ID and a UUID field

3. **Relationship Test**
    - Validates that a Property can have multiple UtilityBill records
    - Confirms the hasMany relationship returns the correct collection type

### UtilityBill Model Tests

The `UtilityBillTest` class tests the UtilityBill model functionality:

```php
// Tests\Unit\UtilityBillTest
```

#### Test Cases:

1. **Fillable Attributes Test**

    - Verifies that only the expected fields can be mass-assigned
    - Fields tested: 'property_id', 'type', 'amount', 'bill_date', 'user_id'

2. **UUID Generation Test**

    - Confirms the HasUuid trait properly generates a UUID
    - Verifies that models have both an auto-incrementing ID and a UUID field

3. **Attribute Casting Test**

    - Validates that 'bill_date' is properly cast to a Carbon date object
    - Confirms that 'amount' is correctly cast to a decimal with 2 places

4. **Property Relationship Test**

    - Verifies the belongsTo relationship with the Property model

5. **User Relationship Test**
    - Validates the belongsTo relationship with the User model

## Database Structure

The tests accommodate a database structure where models have:

-   An auto-incrementing `id` column (primary key)
-   A `uuid` column containing a UUID string
-   Standard foreign keys that use the numeric `id` field

## Running the Tests

To run these tests:

```bash
# Run all tests
php artisan test

# Run specific test class
php artisan test --filter PropertyTest
php artisan test --filter UtilityBillTest
```

## Test Requirements

These tests require:

1. The RefreshDatabase trait to reset the database between tests
2. Property and UtilityBill models with HasUuid trait
3. A User model with factory support
4. Proper database migrations for all involved tables

## Best Practices Demonstrated

1. **Isolated Tests**: Each test focuses on a single aspect of functionality
2. **Comprehensive Coverage**: Tests all important model features
3. **Clear Assertions**: Each test has specific, readable assertions
4. **Database Reset**: Uses RefreshDatabase to maintain a clean testing environment
5. **Relationship Validation**: Confirms both sides of model relationships

## Extending These Tests

When adding new functionality to these models, extend these tests by:

1. Creating a new test method for each new feature
2. Following the naming convention `it_does_something()`
3. Creating minimal test data to verify the specific functionality
4. Adding clear assertions that validate expected outcomes

## Troubleshooting

If tests fail, common issues include:

-   Missing database columns in migrations
-   Incorrect relationship definitions in models
-   Improperly configured HasUuid trait
-   Missing factory definitions for User model

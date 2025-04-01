# Properties Management App - Frontend Documentation

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

# Property Management Dashboard

## Overview

This repository contains the Next.js frontend for the Properties Management application. The frontend provides a user-friendly interface to manage properties and utility bills, connecting to a Laravel backend API.

## Tech Stack

- **Frontend Framework**: Next.js (React)
- **Styling**: TailwindCSS
- **State Management**: React Context API / React Query
- **API Communication**: Axios
- **Form Handling**: React Hook Form
- **Validation**: Yup
- **Charts**: Recharts
- **Date Handling**: date-fns

## Features

### Authentication

- User registration and login
- Protected routes for authenticated users
- Token-based authentication with Laravel Sanctum

### Properties Management

- **Properties List/Overview**:

  - Responsive grid/list view of all properties
  - Quick view of property name, address, and type
  - Filtering and sorting options
  - Add new property button

- **Individual Property Details**:
  - Comprehensive view of property information
  - Utility bills listing
  - Edit property information
  - Navigation to add new utility bills

### Utility Bills Management

- **Utility Bills List**:

  - List of all utility bills for a selected property
  - Display of bill type, amount, and date
  - Sorting and filtering options

- **Utility Bill Entry Form**:
  - Form to add new utility bills
  - Property selection from dropdown
  - Utility type selection (electricity, water, gas)
  - Amount input with validation
  - Date selection with date picker

### Data Visualization (Bonus)

- **Utility Consumption Charts**:
  - Historical visualization of utility usage
  - Monthly comparison charts
  - Trend analysis

## Project Structure

```
properties-management-frontend/
├── public/                  # Static assets
├── src/
│   ├── components/          # Reusable React components
│   │   ├── layout/          # Layout components
│   │   ├── charts/          # Chart components
│   │   ├── forms/           # Form components
│   │   └── ui/              # UI components (buttons, cards, etc.)
│   ├── context/             # React Context for state management
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Library code and utilities
│   │   ├── api.js           # API client setup
│   │   └── auth.js          # login validation schemas
│   ├── pages/               # Next.js pages
│   │   ├── _app.js          # Custom App component
│   │   ├── index.js         # Home page
│   │   ├── login.js         # Login page
│   │   ├── register.js      # Registration page
│   │   ├── properties/      # Property-related pages
│   │   └── utility-bills/   # Utility bill pages
│   │   ├── users/           # staff users pages
│   └── styles/              # Global styles and Tailwind config
└── next.config.js           # Next.js configuration
```

## Prerequisites

- Node.js 14.x or higher
- npm or yarn
- Laravel backend API running (see Backend Configuration)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/tasklist.git
   cd tasklist\tasklist_frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env.local` file in the root directory with the following:

   ```
   NEXT_PUBLIC_API_URL=http://localhost:8000/api
   NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
   ```

4. Start the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser.

## Backend Configuration

This frontend application requires a Laravel PHP backend with the following API endpoints:

### Property API Endpoints

- `GET /api/properties` - Get all properties
- `GET /api/properties/{id}` - Get a single property
- `POST /api/properties` - Create a new property
- `PUT /api/properties/{id}` - Update a property
- `DELETE /api/properties/{id}` - Delete a property

### Utility Bill API Endpoints

- `GET /api/utility-bills` - Get all utility bills
- `GET /api/properties/{id}/utility-bills` - Get utility bills for a property
- `POST /api/utility-bills` - Create a new utility bill
- `PUT /api/utility-bills/{id}` - Update a utility bill
- `DELETE /api/utility-bills/{id}` - Delete a utility bill
- `GET /api/properties/{id}/consumption-history` - Get consumption history for a property

## Development

### Adding New Features

1. Create new components in the `/components` directory
2. Add new pages in the `/pages` directory
3. Update API services in `/services/api.js` as needed

### Building for Production

Start the development server:

```bash
npm run dev
# or
yarn dev
```

Open your browser and visit `http://localhost:3000`

### Building for Production

```bash
npm run build
# or
yarn build
```

To start the production server:

```bash
npm run start
# or
yarn start
```

## License

MIT License

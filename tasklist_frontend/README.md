This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

# Property Management Dashboard

A responsive Next.js and TailwindCSS dashboard for property management with utility bill tracking.

## Features

- **Properties List/Overview**: View all properties with name, address, and type (residential/commercial)
- **Individual Property Details**: View property information and utility bills
- **Utility Bill Entry Form**: Add new utility bills with validation
- **Dashboard**: View statistics and charts for property and utility data

## Tech Stack

- **Frontend**: Next.js, TailwindCSS, Recharts
- **Backend**: Laravel PHP API (not included in this repository)
- **API Communication**: Axios

## Prerequisites

- Node.js 14.x or higher
- npm or yarn
- Laravel backend API running (see Backend Configuration)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/property-management-dashboard.git
   cd property-management-dashboard
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

## Project Structure

- `/pages` - Next.js pages
  - `/dashboard` - Main dashboard
  - `/properties` - Properties list and details
  - `/utility-bills` - Utility bill forms
- `/components` - Reusable React components
  - `/layout` - Layout components (Sidebar, Navbar)
- `/services` - API services
- `/public` - Static assets

## Development

### Adding New Features

1. Create new components in the `/components` directory
2. Add new pages in the `/pages` directory
3. Update API services in `/services/api.js` as needed

### Building for Production

```bash
npm run build
# or
yarn build
```

## License

MIT License

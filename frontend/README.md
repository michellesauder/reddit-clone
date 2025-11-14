# Reddit Clone - Frontend

A Next.js-based frontend application for a Reddit clone. This application provides a modern, responsive user interface for browsing posts, creating content, commenting, and voting.

## Tech Stack

- **Framework**: Next.js 16 (React 19)
- **Styling**: Tailwind CSS 4
- **Language**: TypeScript
- **API Client**: Fetch API with custom wrapper

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Backend API running (see backend README)

## Installation

1. Install dependencies:

```bash
npm install
```

2. Set up environment variables:
   Create a `.env.local` file in the frontend directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Running the Application

### Development Mode

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

The page will auto-reload when you make changes to the code.

### Production Mode

```bash
# Build the application
npm run build

# Start the production server
npm run start
```

## Running with Docker

The frontend can be run using Docker Compose from the project root:

```bash
# From the project root directory
docker-compose up frontend
```

This will build and start the frontend container, making it available at `http://localhost:3000`.

## Features

- **User Authentication**: Register and login functionality
- **Post Management**: Create, view, and browse posts
- **Comments**: View and create comments with nested reply support
- **Voting**: Upvote and downvote posts and comments
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS

## Project Structure

```
frontend/
├── app/
│   ├── page.tsx           # Home page (posts list)
│   ├── layout.tsx          # Root layout
│   ├── globals.css         # Global styles
│   ├── login/              # Login page
│   ├── register/           # Registration page
│   ├── create/             # Create post page
│   └── posts/
│       └── [id]/           # Individual post page
├── lib/
│   ├── api.ts              # API client functions
│   └── auth.ts             # Authentication utilities
└── types/
    └── index.ts            # TypeScript type definitions
```

## API Integration

The frontend communicates with the backend API through the `lib/api.ts` module. The API base URL is configured via the `NEXT_PUBLIC_API_URL` environment variable.

### Available API Functions

- **Authentication**: `authApi.register()`, `authApi.login()`
- **Posts**: `postsApi.getAll()`, `postsApi.getOne()`, `postsApi.create()`
- **Comments**: `commentsApi.getByPost()`, `commentsApi.create()`

## Authentication

User authentication is handled using JWT tokens stored in `localStorage`. The token is automatically included in API requests via the Authorization header.

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint

## Environment Variables

| Variable              | Description                          | Default                 |
| --------------------- | ------------------------------------ | ----------------------- |
| `NEXT_PUBLIC_API_URL` | Backend API base URL                 | `http://localhost:3001` |
| `NODE_ENV`            | Environment (development/production) | `development`           |

## Styling

The project uses Tailwind CSS 4 for styling. Global styles are defined in `app/globals.css`.

## Development

### Adding New Pages

Create new pages by adding files in the `app/` directory following Next.js App Router conventions.

### API Client

To add new API endpoints, extend the `lib/api.ts` file with new functions following the existing pattern.

### Type Safety

TypeScript types are defined in `types/index.ts`. Update these as needed when the API changes.

## Deployment

When deploying to production:

1. Set `NEXT_PUBLIC_API_URL` to your production backend URL
2. Build the application:
   ```bash
   npm run build
   ```
3. Start the production server:
   ```bash
   npm run start
   ```

Or use a platform like Vercel, which provides excellent Next.js support:

1. Connect your repository to Vercel
2. Set the `NEXT_PUBLIC_API_URL` environment variable
3. Deploy

## Learn More

- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API
- [Next.js App Router](https://nextjs.org/docs/app) - Learn about the App Router
- [Tailwind CSS Documentation](https://tailwindcss.com/docs) - Learn about Tailwind CSS

## License

UNLICENSED

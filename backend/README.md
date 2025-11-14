# Reddit Clone - Backend

A NestJS-based REST API backend for a Reddit clone application. This backend provides authentication, post management, comments, and voting functionality.

## Tech Stack

- **Framework**: NestJS (Node.js)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT (JSON Web Tokens) with Passport
- **Language**: TypeScript
- **Validation**: class-validator, class-transformer

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL (or use Docker Compose)
- Docker (optional, for containerized deployment)

## Installation

1. Install dependencies:

```bash
npm install
```

2. Set up environment variables:
   Create a `.env` file in the backend directory:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/reddit_clone"
JWT_SECRET="your-secret-key-change-in-production"
JWT_EXPIRES_IN="7d"
PORT=3001
NODE_ENV=development
ALLOWED_ORIGINS="http://localhost:3000"
```

3. Set up the database:

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev
```

## Running the Application

### Development Mode

```bash
# Start in watch mode (auto-reload on changes)
npm run start:dev
```

The API will be available at `http://localhost:3001`

### Production Mode

```bash
# Build the application
npm run build

# Start in production mode
npm run start:prod
```

### Debug Mode

```bash
npm run start:debug
```

## Running with Docker

The backend can be run using Docker Compose from the project root:

```bash
# From the project root directory
docker-compose up backend
```

This will automatically:

- Set up PostgreSQL database
- Run database migrations
- Start the backend server

## API Endpoints

### Authentication

- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login user

### Posts

- `GET /posts` - Get all posts
- `GET /posts/:id` - Get a single post
- `POST /posts` - Create a new post (requires authentication)

### Comments

- `GET /posts/:postId/comments` - Get comments for a post
- `POST /posts/:postId/comments` - Create a comment (requires authentication)

### Votes

- `POST /votes` - Create or update a vote (requires authentication)

### Users

- `GET /users` - Get user information (requires authentication)

## Project Structure

```
backend/
├── src/
│   ├── auth/          # Authentication module (JWT, guards, decorators)
│   ├── posts/         # Posts module
│   ├── comments/      # Comments module
│   ├── votes/         # Voting module
│   ├── users/         # Users module
│   ├── prisma/        # Prisma service and module
│   ├── app.module.ts  # Root application module
│   └── main.ts        # Application entry point
├── prisma/
│   ├── schema.prisma  # Database schema
│   └── migrations/    # Database migrations
└── test/              # E2E tests
```

## Database Schema

The application uses the following main models:

- **User**: User accounts with email, username, and password
- **Post**: Posts with title, content, and optional link
- **Comment**: Comments on posts with support for nested replies
- **Vote**: Upvotes/downvotes on posts and comments

## Scripts

- `npm run build` - Build the application
- `npm run start` - Start the application
- `npm run start:dev` - Start in development mode with watch
- `npm run start:debug` - Start in debug mode
- `npm run start:prod` - Start in production mode
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run test` - Run unit tests
- `npm run test:e2e` - Run end-to-end tests
- `npm run test:cov` - Run tests with coverage

## Prisma Commands

```bash
# Generate Prisma Client
npx prisma generate

# Create a new migration
npx prisma migrate dev

# Apply migrations in production
npx prisma migrate deploy

# Open Prisma Studio (database GUI)
npx prisma studio
```

## Environment Variables

| Variable          | Description                                  | Default                 |
| ----------------- | -------------------------------------------- | ----------------------- |
| `DATABASE_URL`    | PostgreSQL connection string                 | Required                |
| `JWT_SECRET`      | Secret key for JWT tokens                    | Required                |
| `JWT_EXPIRES_IN`  | JWT token expiration time                    | `7d`                    |
| `PORT`            | Server port                                  | `3001`                  |
| `NODE_ENV`        | Environment (development/production)         | `development`           |
| `ALLOWED_ORIGINS` | Comma-separated list of allowed CORS origins | `http://localhost:3000` |

## CORS Configuration

The backend is configured to accept requests from the frontend. By default, it allows requests from `http://localhost:3000`. You can configure additional origins using the `ALLOWED_ORIGINS` environment variable.

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Deployment

When deploying to production:

1. Set `NODE_ENV=production`
2. Use a strong `JWT_SECRET`
3. Configure `ALLOWED_ORIGINS` with your production frontend URL
4. Ensure your `DATABASE_URL` points to your production database
5. Run `npx prisma migrate deploy` to apply migrations
6. Build and start the application:

```bash
   npm run build
   npm run start:prod
```

## License

UNLICENSED

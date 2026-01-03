# Spaeti Culture

Find Berlin's best late-night spots with seating, toilets & card payment.

## Prerequisites

- [Bun](https://bun.sh/) >= 1.3.0
- [Docker](https://www.docker.com/) (for the PostgreSQL database)

## Development Setup

1. **Install dependencies:**

```bash
bun install
```

2. **Start the PostgreSQL database:**

```bash
docker compose up -d
```

3. **Set up environment variables:**

Create a `.env` file in the project root:

4. **Run database migrations:**

```bash
bun db:migrate
```

5. **Start the development server:**

```bash
bun dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

## Database Commands

| Command | Description |
|---------|-------------|
| `bun db:generate` | Generate migration files from schema changes |
| `bun db:migrate` | Apply pending migrations |
| `bun db:push` | Push schema changes directly (dev only) |
| `bun db:pull` | Pull schema from database |
| `bun db:studio` | Open Drizzle Studio GUI |
| `bun db:seed` | Seed the database with sample data |

## Building For Production

```bash
bun build
```

To run the production build:

```bash
bun start
```

## Testing

```bash
bun test
```

## Linting & Formatting

This project uses [Biome](https://biomejs.dev/) for linting and formatting:

```bash
bun lint    # Fix linting issues
bun format  # Format code
bun check   # Check without fixing
```


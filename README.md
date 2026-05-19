> [!WARNING]
> This project is still being developed!

# Scrapeek

- Scrapeek is a fullstack web scraping platform for creating reusable scraper definitions called blueprints. A blueprint describes where to fetch data from, which fields to extract, and how the result should be then exposed through simple API call.

## Features

- User authentication with Better Auth and social login providers
- End-to-end type safety using RPC, drizzle-zod etc...
- Ability to define blueprint for API, Static and Dynamic scraping of pages with UI
- API key management for programmatic result access
- Simple API call with API key to retrieve scraped data
- Configurable field selectors, typed extracted values, request timeouts...
  pagination options
- Nested container extraction, recursive crawling
- Public blueprints to share with upvotes system
- Legal safety checks which take into consideration `robots.txt` etc..

## Tech Stack

- **Client**
  - TanStack Start _(React)_
  - TanStack Query
  - TanStack Form
  - Tailwind CSS
  - ShadcnUI
  - Zod

- **API**
  - Hono /w RPC
  - DrizzleORM
  - Better auth
  - Postgres/Neon DB
  - Zod
  - Hono typed client

- **Scrapers**
  - Axios
  - Node-html-parser
  - Undici
  - Playwright

- **Tooling**
  - pnpm
  - Turborepo /w pnpm workspaces
  - TypeScript
  - Biome

## Monorepo Structure

```txt
apps/
  api/       Hono API server
  client/    React/TanStack client

packages/
  db/        Drizzle schemas, relations, migrations, validators
  scrapers/  API, static, and dynamic scraper implementations
  shared/    Shared utilities
```

## Requirements

- Node.js `22.14.0`
- pnpm `10.9.0`
- Postgres database, for example Neon

## Getting Started

- Clone the repo and setup each `.env` _(in both `/apps` and `/packages`)_ based on provied `.env.example`
- Install dependencies with `pnpm install`
- Install playwright browser with `pnpm exec playwright install`
- Run DB migrations using `pnpm --filter @scrapeek/db db:migrate`
- Start the dev server  `pnpm dev` _(By default client is on PORT 3000 and API on 3001)_

## Blueprint Types

- **API Blueprints** - to scrape REST API _(GraphQL scraper is planned)_
- **Static Blueprints** - to scrape simple pages wuthout JS rendering
- **Dynamic Blueprints** - to scrape dynamically rendered pages

### Planned features

- GraphQL API scraper
- Blueprint grouping to run multiple scrapers
- Performance optimization
- Rotating proxies setup
- reCaptcha solvers
- Infinite scrolling
- Accessing data behind login wall
- Variables to compose scraped result
- Customization of every aspect of scraper like headers, queries, retries etc...
- CRON intervals to automatically rescrape
- Safety measures to prohibit unsafe pages
- Docker setup
- Dashboard
- Documentation
- Landing page
- Chrome extension to easily select selectors
- MCP and AI friendly setup
- Data compression to easy DB space for heavy scrapers
- Better concurrency + BullMQ setup
- Credit-base subscription system

## License

This project is licensed under the terms in [LICENSE](./LICENSE).

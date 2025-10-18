### Scrapeek

- Scrapeek is a service, that allows you to retrieve data via simple API request from publicly available websites using scrapers that can be extremely simply defined using "blueprints".
- Scrapeek offers extensive features:
  - Ability to scrape:
    - APIs
    - Static sites
    - Dynamic sites generated using JS _(SPAs etc...)_
  - Ability to:
    - Define what to scrape using field/element selectos with custom keys.
    - Define types of scraped data _(normal scrape of website will always return strings)_
    - Define variables and compose result
      - _(for example.: append variable BASE_URL to scraped field "url")_
    - Customize almost every aspect of scraper like headers, queries, timeout between requests etc.
  - Anti-bot measures - Rotating proxies & reCaptcha solvers
  - Ability to handle:
    - Pagination
    - Infinite scrolling
    - Popups removals
    - Data behind login wall _(if not prohibited)_
    - Recursive scrape
  - Ability to set CRON intervals to rescrape
  - Safety measures - only HTTPS and other malicious usage probited
  - Check of robots.txt to prohibit scraping websites that do not allow it
  - Developer friendly
    - Documentation available
    - Scrapeek google extension that will allow to click on element and it will return best possible query selector to create blueprints in seconds
    - Simple API Key management
  - Library of public scrapers defined by users /w upvoting
  - Credit-base subscription system + One-time payments for refills

### Tech stack

- `client`:
  - Typescript
  - Tanstack router/start
  - Tailwind + ShadcnUI
  - Zod
- `api`:
  - Typescript
  - Hono
  - Drizzle /w Neon
  - Zod
  - Better-auth
  - Playwright
- `landing`:
  - Astro
- `docs`:
  - Docusaurus

### Requirements

- Node.js v22.14.0
- pnpm v10.9.0

### Jobseek

- Fullstack application that allows you to provide multiple job listing sites in `sites.json`, which are then scraped and served using simple Hono Backend into React frontend app, that allows you to simply input keywords. _(Be aware that scraping a lot of sites take quite a lot of time)_
- 3 types of scrapers:
  - Static
    - Used for the simplest of sites, that serves static sites
  - Dynamic
    - Used for SPA sites, that load data dynamically and not on load. And also for pages with verification on load
  - API
    - You provide API endpoint, queries or pagination and just select data you want

### Planned refactors

- Zod JSON parsing
- Better composable fields

### Planned features

- API Scraping
- Infinite scrolling
- Specification of popups to close inside config
- Server

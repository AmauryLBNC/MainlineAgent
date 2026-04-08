# Critical Functions Testing

This app now has focused automated coverage for the client-side behaviors that are easiest to break during UI work.

## Covered areas

- `src/hooks/useSectionScroll.ts`
  - manual section transitions
  - idle auto-rotation
  - quiz pause / resume flow
  - event-driven navigation from the header layer

- `src/app/momoia/entreprises/[slug]/utils.ts`
  - metadata normalization and fallbacks
  - localized content selection
  - financial card formatting
  - safe numeric coercion and sector label resolution

- `src/lib/section-navigation.ts`
  - custom event dispatch used by the homepage navigation

- `src/lib/data/companies.ts`
  - query-string parsing for the catalog API
  - sorting rules for company metrics and names

- `src/lib/buffett-api.ts`
  - validation of manual company scoring payloads
  - mapping between the Next.js contract and the Python Buffett API
  - normalization of backend scoring responses

- `buffett_api/yahoo_finance.py`
  - normalization of Yahoo Finance autocomplete results
  - extraction of revenue, debt, free cash flow, EBITDA and shareholder equity from public fundamentals

## Commands

```bash
npm run lint
npm run test
npm run build
```

## Notes

- Vitest is configured to run only `src/**/*.test.{ts,tsx}` so educational examples in `cours/` do not affect app validation.
- The test pool uses threads instead of forks to stay compatible with the Windows sandbox used for verification.

# Veldu Rafbíl (Choose EV)

Veldu Rafbíl is a project on electric cars in Iceland and translates to _Choose an Electric Car_. The two main goals are:

1. Increasing the adoption of electric cars in Iceland, currently [#2 for Passenger plug-in market share of total in the world](https://en.wikipedia.org/wiki/Electric_car_use_by_country)
2. Helping users figure out which specific model to choose

This is a [Next.js](https://nextjs.org) project written in Typescript and styled with [Tailwind](https://tailwindcss.com), deployed using [Vercel](https://vercel.com). The site itself is one page, at `/`, listing all new electric cars available in Iceland including the most relevant information, a link to the seller and more detailed info. An AI advisor answers questions about the cars in Icelandic. The same list is published as JSON for anyone else to read.

## Running it

Requires an LTS release of [Node.js](https://nodejs.org/), 22.22.1 or later.

```bash
npm install
npm run dev
```

The site itself needs no configuration. The AI advisor also needs a [Google AI Studio](https://aistudio.google.com) key in `.env.local`:

```
GOOGLE_GENERATIVE_AI_API_KEY=...
```

`npm run build` makes a production build.

## The car list as JSON

`/api/cars` publishes every car as one document — no key, no rate limit, and
cached at the edge, since it is built at deploy rather than per request. The
fields are named to be read without this repo at hand: `price.list` and
`price.withGrant` are separate, because a new electric car under the ceiling
gets a government grant and the second is what a buyer pays; range is WLTP with
an Icelandic real-world estimate beside it. The envelope carries the grant
figures, those caveats and a `generatedAt`.

`/llms.txt` is the short version of the same thing, for AI agents, following
the [llms.txt convention](https://llmstxt.org).

Prices come from sellers' published price lists and are kept up by hand, so they
can lag. Credit and a link back are appreciated.

## Contributing

Most changes are adding or updating a car in `modules/newCars.ts`. [AGENTS.md](AGENTS.md) covers the conventions and the things that are easy to get wrong.

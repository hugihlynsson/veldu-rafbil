# Veldu Rafbíl (Choose EV)

Veldu Rafbíl is a project on electric cars in Iceland and translates to _Choose an Electric Car_. The two main goals are:

1. Increasing the adoption of electric cars in Iceland, currently [#2 for Passenger plug-in market share of total in the world](https://en.wikipedia.org/wiki/Electric_car_use_by_country)
2. Helping users figure out which specific model to choose

This is a [Next.js](https://nextjs.org) project written in Typescript and styled with [Tailwind](https://tailwindcss.com), deployed using [Vercel](https://vercel.com). It's a single route at `/` that lists all new electric cars available in Iceland including the most relevant information, a link to the seller and more detailed info. An AI advisor answers questions about the cars in Icelandic.

## Running it

Requires [Node.js](https://nodejs.org/) 20.9 or later.

```bash
npm install
npm run dev
```

The site itself needs no configuration. The AI advisor also needs a [Google AI Studio](https://aistudio.google.com) key in `.env.local`:

```
GOOGLE_GENERATIVE_AI_API_KEY=...
```

`npm run build` makes a production build.

## Contributing

Most changes are adding or updating a car in `modules/newCars.ts`. [CLAUDE.md](CLAUDE.md) covers the conventions and the things that are easy to get wrong.

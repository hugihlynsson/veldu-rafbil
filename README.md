# Veldu Rafbíl (Choose EV)

Veldu Rafbíl is a project on electric cars in Iceland and translates to _Choose an Electric Car_. The two main goals are:

1. Increasing the adoption of electric cars is Iceland, currently [#2 for Passenger plug-in market share of total in the world](https://en.wikipedia.org/wiki/Electric_car_use_by_country)
2. Helping users figure out which specific model to choose

This is a [NextJS](https://nextjs.org) project written in Typescript, deployed using [Vercel](http://vercel.com). The root (`/`) lists all new electric cars available in Iceland including the most relevant information, a link to the seller and more detailed info. At `/notadir` lists used electronic cars available at all used car dealerships in Iceland. That page uses `/api/used` to get the data, which is stored in a Firebase project.

Requirements:

- [Node](https://nodejs.org/) 10.15 or later
- [Yarn](https://yarnpkg.com)
- [Vercel CLI](https://vercel.com/download) - `yarn global add vercel`

Run `vercel dev` to spin up the project. It uses the config from `now.json`, installs the required builders and starts serving the routes. It will defer building a route until it is requested — the first load might take some time.

To access `/api/used` you need to have access to a Firebase project (you can follow [this guide](https://firebase.google.com/docs/web/setup) to set one up) and have the following keys in your environment (a `.env` file will be picked up by `vercel dev`):

- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY` – This key should be a base64 encoded version of the original key

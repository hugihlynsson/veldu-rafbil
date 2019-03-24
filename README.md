# Choose EV

This is a monorepo and is deployed using [Now](http://now.sh).

The repo contains two projecs. `ui/` is a [Next](https://nextjs.org) project while `api/` contains the server endpoints. They are both written in Typescript. Files in `api/endpoints/` are deployed as lamdas and routed to as `/api/`. The UI is served from `/`.

Requirements:

- Node 8 or later
- [Yarn](https://yarnpkg.com)

To start working on the UI, run `cd ui`, `yarn install` and finally `yarn dev`. This will start a development server at `localhost:3000`. It will try to connect to endpoints at `localhost:4000`.

To get the endpoints going, run `cd api` and `yarn install`. While the now-cli is [working on supporting `now dev`](https://github.com/zeit/now-cli/pull/1883) the development setup is quite simplistic and currently only supports running one endpoint at a time. From `api/`, run `yarn dev <path-to-the-endpoint>`, for example `yarn dev endpoints/used.ts`. This will start a server at `localhost:4000` where any route will resolve to the chosen path.

To run the server, you'll need to have access to a Firebase project and have the following keys in a `api/.env` file:

- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY` – This key should be a base64 encoded version of the original key

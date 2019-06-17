# Veldu Rafbíl (Choose EV)

This monorepo contains two projecs. `ui/` is a [Next](https://nextjs.org) project while `api/` contains server endpoints. They are both written in Typescript. The project is deployed using [Now](http://now.sh). The UI is served from `/`. Files in `api/endpoints/<filename>` are deployed as lamdas and routed to as `/api/<filename>`. 

Requirements:

- Node 8.10 or later
- [Yarn](https://yarnpkg.com)
- [Now CLI](https://zeit.co/download) - `yarn add global now`

Run `now dev` to spin up the project. It uses the config from `now.json`, installs the specified builders and starts serving the routes. It will defer building a route until it is requested – the first load might take some time.

To access the `api/used.ts` endpoint, you'll need to have access to a Firebase project (you can follow [this guide](https://firebase.google.com/docs/web/setup)) and have the following keys in your environment (a `.env` file will be picked up by `now dev`):

- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY` – This key should be a base64 encoded version of the original key

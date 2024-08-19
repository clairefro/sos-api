# StackOverflow Simulator - API

Relive the good ol' days of SO, with all the nostalgic sass.

This is the API used by the [Stack Overflow Simulator client app](https://github.com/clairefro/sos-client)

## Devlopment and running locally

`cp .env.example .env` <-- add required env vars, such as `OPENAI_API_KEY`

`npm install`
`npm run dev`

This will run the API on port :3000 by default

If you'd like to use the API, either

1. Import the Postman Collection in the project root
2. Clone and launch the [SOS client app](https://github.com/clairefro/sos-client)

## Build

`npm run build`

## Note to self

Prod hosted on Render

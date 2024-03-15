# Welcome to Remix!abcdefgh

- [Remix Docs](https://remix.run/docs)

## Development

From your terminal:

```sh
npm run dev
```

This starts your app in development mode, rebuilding assets on file changes.

## Deployment

First, build your app for production:

```sh
npm run build
```

Then run the app in production mode:

```sh
npm start
```

Now you'll need to pick a host to deploy it to.

### DIY

If you're familiar with deploying node applications, the built-in Remix app server is production-ready.

Make sure to deploy the output of `remix build`

- `build/`
- `public/build/`

gcloud compute firewall-rules create allow-db-access --direction=INGRESS --priority=1000 --network=default --action=ALLOW --rules=tcp:3306--source-ranges=0.0.0.0/0 --target-tags=db

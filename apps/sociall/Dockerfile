FROM node:18-alpine

EXPOSE 3000

WORKDIR /app
COPY . .

ENV NODE_ENV=production
ENV SHOPIFY_APP_URL=https://sociall-heroku-cfdab19fb85b.herokuapp.com/
ENV SHOPIFY_API_KEY=202db42c098da04ff196f0aa16f74cf4
ENV SHOPIFY_API_SECRET=1f2a7bd55af02c0f99e1940a80c3cfbe
ENV SCOPES=write_products


RUN npm install --omit=dev
# Remove CLI packages since we don't need them in production by default.
# Remove this line if you want to run CLI commands in your container.
RUN npm remove @shopify/app @shopify/cli
RUN npm run build

# You'll probably want to remove this in production, it's here to make it easier to test things!
RUN rm -f prisma/dev.sqlite

CMD ["npm", "run", "docker-start"]

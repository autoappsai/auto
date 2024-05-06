Sopify Sociall, powered by Auto

- Docker & deployment to Heroku
  sudo docker build -t sociall-heroku --platform linux/amd64 .
  sudo docker tag sociall-heroku registry.heroku.com/sociall-heroku/web
  docker push registry.heroku.com/sociall-heroku/web
  heroku container:release web -a sociall-heroku

Fix Docker command issue
sudo vi ~/.docker/config.json
Replace “credsStore” with “credStore”
:wq

If unauthorize run heroku container:login

Prod URL: https://admin.shopify.com/store/sociall-store/apps/sociall/app

Prettier: sudo npx prettier --write "\*_/_.{js,jsx}"

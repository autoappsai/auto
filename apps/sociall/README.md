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

-- Test instructions

URL del sitio:https://admin.shopify.com/store/sociall-store/apps/sociall/app
The Facebook app is used inside a Shopify app. Shopify apps are installed in users stores. In order to test the functionality, reviewers will need to access an installed app on a test store. For that you will need to access the Shopify store, with the credentials of the owner of that test store.

1- Access https://admin.shopify.com/store/sociall-store/apps/sociall/app using Chrome.
2- Use credentials to log into Shopify store: team@autoapps.ai / 7jm8HtA5QkLZZNO
3- You will see the index page of the app. Click on "Connect now" and follow the Facebook app oauth flow. If the "Connect Now" button does not appear, please navigate to apps "Setting" link in the sidebar, and click "Disconnect" button, as it may already being connected from other testings.
4- For the Facebook oauth flow you should use the following Facebook test account.

- Facebook account
  user: caritocrespo1@hotmail.com
  password: AyrtonSenna3
  Optional: In case you run into the two factor authentication flow, and you are asked with a code, navigate to the following URL to get the code. Copy it, and go back to the Facebook oauth flow to paste it.
  Code generation URL: https://fbcode.s3.us-west-2.amazonaws.com/index.html
  5- Navigate to Settings link in the side bar and check that the account name is shown. That is the reason why we requested instagram_basic permission.
  6- Create posts for any day of the week. Optionally you can and check that a publish has been made to the Instagram business account connected, on the specified time of day. This is the reason why we request the instagram_content_publish permission.
  Optional: Access instagram.com, using the credentials of the associated business account of the test user at the specified time of the day that you selected when generating the post: auto.sociall / Secreta2413

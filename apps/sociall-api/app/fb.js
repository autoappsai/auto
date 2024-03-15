import axios from "axios";

const fbUrl = "https://graph.facebook.com/v19.0";
const client_id = "761954749115582";
const client_secret = "063ef8a356a9cf22d6cadc61957977d0";

export async function instagramPublish(imageUrl, caption, accessToken) {
  const instagramBusinessAccount = await getInstagramBusinessAccount(accessToken);
  const creationId = await createMediaContainer(
    instagramBusinessAccount,
    imageUrl,
    caption,
    accessToken
  );
  const publicationId = await mediaPublish(instagramBusinessAccount, creationId, accessToken);
  return publicationId ?? null;
}

export async function getInstagramBusinessAccount(accessToken) {
  const { data } = await axios.get(fbUrl + "/me/accounts", {
    params: {
      fields: "id,name,access_token,instagram_business_account",
      access_token: accessToken,
    },
  });
  return data.data[0].instagram_business_account.id ?? null;
}

export async function createMediaContainer(
  instagramBusinessAccount,
  imageUrl,
  aCaption,
  accessToken
) {
  const { data } = await axios.post(fbUrl + "/" + instagramBusinessAccount + "/media", null, {
    params: {
      image_url: imageUrl,
      caption: aCaption,
      access_token: accessToken,
    },
  });

  return data.id ?? null;
}

export async function mediaPublish(instagramBusinessAccount, creationId, accessToken) {
  const { data } = await axios.post(
    fbUrl + "/" + instagramBusinessAccount + "/media_publish",
    null,
    {
      params: {
        creation_id: creationId,
        access_token: accessToken,
      },
    }
  );

  return data.id ?? null;
}

export async function getLongLivedToken(accessToken) {
  const { data } = await axios.get(fbUrl + "/oauth/access_token", {
    params: {
      grant_type: "fb_exchange_token",
      client_id: client_id,
      client_secret: client_secret,
      fb_exchange_token: accessToken,
    },
  });

  return data.access_token;
}

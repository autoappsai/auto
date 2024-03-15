import db from "./db.server";
import axios from "axios";

const serverUrl = "https://sociallapi.autoapps.ai";
//const serverUrl = process.env.API_URL;
//const serverUrl = "http://localhost:3000";
const graphQLUrl = "https://sharing-flamingo-52.hasura.app/v1/graphql";
const graphqlHeaders = {
  headers: {
    "content-type": "application/json",
    "x-hasura-admin-secret":
      "lJIxWxSddHSA6Qg1adOz5uXWxBL2p2I3kKXLkixDGivsv0FYep3FfnBORZmt97kP",
  },
};

export async function initTokenFlow(installationsSocialNetworks_id) {
  const response = await axios.post(serverUrl + "/init-token-flow", {
    installationsSocialNetworks_id: installationsSocialNetworks_id,
  });
  return response.data;
}

export async function getPosts(params) {
  const response = await axios.post(serverUrl + "/posts", params);
  return response.data;
}

export async function createPost(post) {
  const response = await axios.post(serverUrl + "/create-post", post);
  return response.data;
}

export async function appInit(params) {
  const response = await axios.post(serverUrl + "/app-init", params);
  return response.data;
}

// Example, not used for now. Usen in conbinations with api.create-post.jsx endpoint here.
export async function createPostGQL(post) {
  const query1 = `query {Installations_SocialNetworks(where: {installations_id: {_eq: ${post.installations_id}}, socialNetworks_id: {_eq: ${post.socialNetworks_id}}}) {id}}`;

  const response1 = await axios.post(
    graphQLUrl,
    { query: query1 },
    graphqlHeaders,
  );

  const instSocId = response1.data.data.Installations_SocialNetworks[0].id;

  const query2 = `mutation {
    insert_Post_one(object: {imageUrl: "${post.imageUrl}", postDate: "${post.postDate}", timeOfDay: "${post.timeOfDay}", installations_SocialNetworks_id: ${instSocId}, text: "${post.text}", hashtags: "${post.hashtags}"}) {
      id
      imageUrl
      installations_SocialNetworks_id
      postDate
      sent
      text
      createdAt
    }
  }`;

  const response2 = await axios.post(
    graphQLUrl,
    { query: query2 },
    graphqlHeaders,
  );

  console.log("EP " + JSON.stringify(response2.data.data));

  return response2.data.data.insert_Post_one;
}

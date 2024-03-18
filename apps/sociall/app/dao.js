import axios from "axios";
import { GRAPHQL_HEADERS } from "./constants";

//const serverUrl = "https://sociallapi.autoapps.ai";
//const serverUrl = process.env.API_URL;
const serverUrl = "http://localhost:3000";
const graphQLUrl = "https://sharing-flamingo-52.hasura.app/v1/graphql";

let authHeader;

export async function setJwtToken(token) {
  authHeader = {
    headers: {
      Authorization: "Bearer " + token,
    },
  };
}

export async function initTokenFlow(jwtToken) {
  setJwtToken(jwtToken);
  const response = await axios.post(
    serverUrl + "/init-token-flow",
    null,
    authHeader,
  );
  return response.data;
}

export async function getPosts(params, jwtToken) {
  setJwtToken(jwtToken);
  const response = await axios.post(serverUrl + "/posts", params, authHeader);
  return response.data;
}

export async function createPost(post, jwtToken) {
  setJwtToken(jwtToken);
  const response = await axios.post(
    serverUrl + "/create-post",
    post,
    authHeader,
  );
  return response.data;
}

export async function appInit(params) {
  const response = await axios.post(serverUrl + "/app-init", params);
  return response.data;
}

export async function login(params) {
  const response = await axios.post(serverUrl + "/login", params);
  return response.data;
}

// Example, not used for now. Usen in conbinations with api.create-post.jsx endpoint here.
export async function createPostGQL(post) {
  const query1 = `query {Installations_SocialNetworks(where: {installations_id: {_eq: ${post.installations_id}}, socialNetworks_id: {_eq: ${post.socialNetworks_id}}}) {id}}`;

  const response1 = await axios.post(
    graphQLUrl,
    { query: query1 },
    GRAPHQL_HEADERS,
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
    GRAPHQL_HEADERS,
  );

  console.log("EP " + JSON.stringify(response2.data.data));

  return response2.data.data.insert_Post_one;
}

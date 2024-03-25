import { json } from "@remix-run/node";
import { appInit } from "../dao";
import { CORS_HTTP_PARAMS } from "../constants";

export const loader = async ({ request }) => {
  if (request.method === `OPTIONS`) {
    return json("", CORS_HTTP_PARAMS);
  }

  return json({ error: "Invalid request method" }, { status: 405 });
};

export const action = async ({ request }) => {
  switch (request.method) {
    case "POST": {
      const body = await request.json();
      const post = await appInit(body, "Instagram");
      return json(post, CORS_HTTP_PARAMS);
    }
  }
};

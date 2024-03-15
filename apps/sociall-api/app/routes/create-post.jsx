import { json } from "@remix-run/node";
import { createPost } from "../dao";

const corsHttpParams = {
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, HEAD, POST, PUT, DELETE",
    "Access-Control-Allow-Headers": "Content-Type",
  },
};

export const loader = async ({ request }) => {
  if (request.method === `OPTIONS`) {
    return json("", corsHttpParams);
  }

  return json({ error: "Invalid request method" }, { status: 405 });
};

export const action = async ({ request }) => {
  switch (request.method) {
    case "POST": {
      const body = await request.json();
      const post = await createPost(body);
      return json(post, corsHttpParams);
    }
  }
};

import { json } from "@remix-run/node";
import { createPostGQL } from "../dao";
import { authenticate } from "../shopify.server";

// Example endpoint if we are to use GraphQL, not used for now.
export const loader = async ({ request }) => {
  await authenticate.admin(request);
  return json({ error: "Invalid request method" }, { status: 405 });
};

export const action = async ({ request }) => {
  switch (request.method) {
    case "POST": {
      let body = await request.json();

      body.installations_id = parseInt(process.env.INSTALLATION_ID);
      body.socialNetworks_id = parseInt(process.env.SOCIAL_NETWORK_ID);

      const post = await createPostGQL(body);

      console.log("LL " + JSON.stringify(post));

      return post;
    }
  }
};

import { json } from "@remix-run/node";
import { initTokenFlow } from "../dao";
import { validateRequest } from "../jwt";
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
      // Protect Endpoint.
      const username = await validateRequest(request, process.env.JWT_SECRET_KEY);
      if (username === null) {
        return json({ error: "Missing or invalid token" }, { status: 401 });
      }

      await initTokenFlow(username);
      return json("Success", CORS_HTTP_PARAMS);
    }
  }
};

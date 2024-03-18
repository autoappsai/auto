import { json } from "@remix-run/node";
import jwt from "jsonwebtoken";
import { getInstallation } from "../dao.js";

const secretKey = "matias";

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

      const installation = await getInstallation(body.username);

      if (installation !== null && installation.shopifyApiSecret === body.password) {
        const token = jwt.sign(body.username, process.env.JWT_SECRET_KEY);
        return json({ token });
      } else {
        return json({ error: "Invalid username or password" }, { status: 401 });
      }
    }
  }
};

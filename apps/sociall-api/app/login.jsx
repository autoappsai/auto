import { json } from "@remix-run/node";
import { getPostsFrom } from "../dao";
import jwt from "jsonwebtoken";

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
      const { username, password } = req.body;

      // Check if username and password are valid (e.g., querying a database)
      // For demonstration, just checking if username is 'admin' and password is 'password'
      if (username === "admin" && password === "password") {
        // Generate JWT token
        const token = jwt.sign({ username }, secretKey, { expiresIn: "1h" });
        res.json({ token });
      } else {
        res.status(401).json({ message: "Invalid username or password" });
      }
    }
  }
};

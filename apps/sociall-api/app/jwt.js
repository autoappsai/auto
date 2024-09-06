import jwt from "jsonwebtoken";

export async function validateRequest(request, secretKey) {
  const authHeader = request.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return null;
  }

  try {
    const username = jwt.verify(token, secretKey);
    return username;
  } catch (error) {
    console.error("Token verification failed:", error.message);
    return null;
  }
}

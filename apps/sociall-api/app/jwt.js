import jwt from "jsonwebtoken";

export function validateRequest(request, secretKey) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  const token = authHeader.split(" ")[1];

  try {
    const username = jwt.verify(token, secretKey);
    return username;
  } catch (error) {
    return null;
  }
}

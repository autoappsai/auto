import { verify } from "jsonwebtoken";

export function validateRequest(request, secretKey) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return json({ error: "Missing or invalid token" }, { status: 401 });
  }
  const token = authHeader.split(" ")[1];

  try {
    const decoded = verify(token, secretKey);
    // Access granted, return some protected data (replace this with your actual protected resource)
    return json({ message: "Welcome to the protected resource!", user: decoded.username });
  } catch (error) {
    // Token verification failed
    return json({ error: "Invalid token" }, { status: 401 });
  }
}

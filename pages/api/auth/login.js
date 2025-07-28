import { serialize } from "cookie";

export default async function (req, res) {
  if (req.method === "POST") {
    const { username, password } = req.body;

    // Basic hardcoded credentials for demonstration
    if (username === "admin" && password === "password") {
      // In a real app, you'd generate a token and set it securely
      const cookie = serialize("auth", "true", {
        // httpOnly removed so client can read cookie
        secure: process.env.NODE_ENV !== "development",
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: "/",
      });
      res.setHeader("Set-Cookie", cookie);
      res.status(200).json({ message: "Logged in successfully" });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}

import { createAuthClient } from "better-auth/react";

// baseURL is intentionally omitted. The client and the auth server are the same
// Next.js app on the same origin, so Better Auth resolves it from the current
// location. Hardcoding a URL here previously sent every deployed sign-in
// request to http://localhost:3000.
export const authClient = createAuthClient();

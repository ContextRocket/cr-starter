/**
 * Login action stub — no-op for static export.
 *
 * The original uses "use server" and Next.js server actions (cookies,
 * redirect, API calls). In a static export there is no server, so this
 * stub returns an error telling users the feature requires a server.
 */

export async function login(_prevState: unknown, _formData: FormData) {
  return {
    server_error: "Login is not available in the static demo. Please use the full hosted version.",
  };
}

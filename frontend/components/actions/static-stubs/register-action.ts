/**
 * Register action stub — no-op for static export.
 */

export async function register(_prevState: unknown, _formData: FormData) {
  return {
    server_error: "Registration is not available in the static demo. Please use the full hosted version.",
  };
}

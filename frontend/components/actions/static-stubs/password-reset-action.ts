/**
 * Password reset action stub — no-op for static export.
 */

export async function passwordReset(_prevState: unknown, _formData: FormData) {
  return {
    server_error: "Password reset is not available in the static demo. Please use the full hosted version.",
  };
}

export async function passwordResetConfirm(_prevState: unknown, _formData: FormData) {
  return {
    server_error: "Password reset is not available in the static demo. Please use the full hosted version.",
  };
}

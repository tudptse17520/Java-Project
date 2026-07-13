// ---------------------------------------------
// Environment Configuration
// Kiểm chuẩn biến môi trường nghiêm ngặt
// ---------------------------------------------

function requireEnv(value: string | undefined, name: string): string {
  if (!value) {
    throw new Error(
      `❌ Missing required environment variable: ${name}. ` +
        `Please check your .env.local file.`
    );
  }
  return value;
}

export const env = {
  /** Backend API Base URL */
  API_URL: requireEnv(process.env.NEXT_PUBLIC_API_URL, "NEXT_PUBLIC_API_URL"),
} as const;

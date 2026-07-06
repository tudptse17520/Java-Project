// ---------------------------------------------
// Environment Configuration
// Kiểm chuẩn biến môi trường nghiêm ngặt
// ---------------------------------------------

const requiredEnvVars = ["NEXT_PUBLIC_API_URL"] as const;

function getEnvVar(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(
      `❌ Missing required environment variable: ${key}. ` +
        `Please check your .env.local file.`
    );
  }
  return value;
}

export const env = {
  /** Backend API Base URL */
  API_URL: getEnvVar("NEXT_PUBLIC_API_URL"),
} as const;

// Validate all required env vars at module load time
requiredEnvVars.forEach(getEnvVar);

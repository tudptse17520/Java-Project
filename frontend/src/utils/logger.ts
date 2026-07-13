const isDevelopment = process.env.NODE_ENV === "development";

export const logger = {
    info: (message: string, ...args: unknown[]) => {
        if (isDevelopment) {
            console.info(`[INFO - ${new Date().toISOString()}]:`, message, ...args);
        }
    },
    warn: (message: string, ...args: unknown[]) => {
        if (isDevelopment) {
            console.warn(`[WARN - ${new Date().toISOString()}]:`, message, ...args);
        }
    },
    error: (message: string, error?: unknown) => {
        console.error(`[ERROR - ${new Date().toISOString()}]:`, message, error);
    },
};
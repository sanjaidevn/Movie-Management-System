//region Imports

// * Load environment variables from .env
import dotenv from "dotenv";

//endregion Imports


dotenv?.config?.();


//region Env Loader (JSON + Normal .env fallback)

// * Loads env from APP_ENV JSON or standard .env
// * Falls back safely on parse failure
const loadEnv = () => {
    try {
        const raw = process?.env?.APP_ENV ?? "{}";
        const parsed = JSON?.parse?.(raw ?? "{}") ?? {};
        return parsed;
    } catch (error) {
        console.log("Error In ENV Parsing ");
        return {};
    }
};

const env = loadEnv?.();

//endregion Env Loader (JSON + Normal .env fallback)


//region ENV LOGS

// * Log sanitized environment configuration
// * Helps verify .env / APP_ENV loading
console.log(
    `\n SERVER CONFIGURATION LOADED\n` +
    `---------------------------------\n` +
    ` Environment : ${env?.NODE_ENV}\n` +
    ` Port        : ${env?.PORT}\n` +
    ` Client URL  : ${env?.CLIENT_URL}\n` +
    ` Database    : ${env?.MONGO_URI ? "CONFIGURED (Masked)" : "MISSING"}\n` +
    ` JWT Secret  : ${env?.JWT_SECRET ? "CONFIGURED (Masked)" : "MISSING"}\n` +
    ` JWT Expires : ${env?.JWT_EXPIRES_IN}\n` +
    `---------------------------------\n`
);

//endregion ENV LOGS


//region Exports

// * Export resolved environment config
export { env };

//endregion Exports

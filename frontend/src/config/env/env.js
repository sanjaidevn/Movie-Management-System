//region Env 
const env = {
    API_BASE_URL: import.meta.env?.VITE_API_BASE_URL ?? "http://localhost:5000",
    NODE_ENV: import.meta.env?.VITE_NODE_ENV ?? 'development',
};

//endregion Env 

// region Export ENV
export { env }
// endregion
/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_GAPI_KEY: string
	readonly VITE_GAPI_CLIENT_ID: string
}

interface ImportMeta {
	readonly env: ImportMetaEnv
}

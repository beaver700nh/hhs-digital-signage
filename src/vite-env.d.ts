/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GAPI_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

import { AppConfig } from "./_types";
/**
 * Inizializza la configurazione dell'app.
 * Deve essere chiamata **una sola volta** all'avvio dell'app.
 */
export declare function initAppConfig(config: AppConfig): void;
/**
 * Restituisce la configurazione attuale.
 * Lancia un errore se `initAppConfig()` non è stato chiamato prima.
 */
export declare function getAppConfig(): AppConfig;

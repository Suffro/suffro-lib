import { AppConfig } from "./_types";

let _config: AppConfig | null = null;

/**
 * Inizializza la configurazione dell'app.
 * Deve essere chiamata **una sola volta** all'avvio dell'app.
 */
export function initAppConfig(config: AppConfig): void {
	if (_config) {
		throw new Error('❌ AppConfig already initialized.');
	}
	_config = config;
}

/**
 * Restituisce la configurazione attuale.
 * Lancia un errore se `initAppConfig()` non è stato chiamato prima.
 */
export function getAppConfig(): AppConfig {
	if (!_config) {
		throw new Error('❌ No AppConfig initializtion. Use initAppConfig(config) to initialize it.');
	}
	return _config;
}

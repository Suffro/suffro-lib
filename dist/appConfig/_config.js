"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initAppConfig = initAppConfig;
exports.getAppConfig = getAppConfig;
let _config = null;
/**
 * Inizializza la configurazione dell'app.
 * Deve essere chiamata **una sola volta** all'avvio dell'app.
 */
function initAppConfig(config) {
    if (_config) {
        console.error('AppConfig already initialized, returning active configuration');
        return;
    }
    _config = config;
}
/**
 * Restituisce la configurazione attuale.
 * Lancia un errore se `initAppConfig()` non è stato chiamato prima.
 */
function getAppConfig() {
    if (!_config) {
        throw new Error('No AppConfig initializtion. Use initAppConfig(config) to initialize it');
    }
    return _config;
}
//# sourceMappingURL=_config.js.map
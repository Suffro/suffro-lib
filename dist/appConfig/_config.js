"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initAppConfig = initAppConfig;
exports.getAppConfig = getAppConfig;
let _config = null;
function initAppConfig(config) {
    if (_config) {
        console.error('AppConfig already initialized, returning active configuration');
        return;
    }
    _config = config;
}
function getAppConfig() {
    if (!_config) {
        throw new Error('No AppConfig initializtion. Use initAppConfig(config) to initialize it');
    }
    return _config;
}

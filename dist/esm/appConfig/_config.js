let _config = null;
export function initAppConfig(config) {
    if (_config) {
        console.error('AppConfig already initialized, returning active configuration');
        return;
    }
    _config = config;
}
export function getAppConfig() {
    if (!_config) {
        throw new Error('No AppConfig initializtion. Use initAppConfig(config) to initialize it');
    }
    return _config;
}

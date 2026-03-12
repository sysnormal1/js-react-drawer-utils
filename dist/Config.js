let configs = {
    ssoResourcetypeScreenId: 10,
    showResourceAsPopup: false
};
export function config(params) {
    configs = { ...configs, ...params };
    Object.freeze(configs);
}
export function getConfigs() {
    let result = { ...configs };
    Object.freeze(result);
    return result; //avoid change
}

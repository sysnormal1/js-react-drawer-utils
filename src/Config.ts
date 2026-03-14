
export type ConfigParams = {
    ssoResourcetypeScreenId?: number;
    showResourceAsPopup?: boolean;
};

let configs : ConfigParams = {
    ssoResourcetypeScreenId: 10,
    showResourceAsPopup: false
};

export function config(params?: ConfigParams) {
    configs = {...configs, ...params};
    Object.freeze(configs);
}

export function getConfigs() : ConfigParams{
    let result: ConfigParams = {...configs} as const;
    Object.freeze(result);
    return result; //avoid change
}

export type ConfigParams = {
    ssoResourcetypeScreenId?: number;
    showResourceAsPopup?: boolean;
};
export declare function config(params?: ConfigParams): void;
export declare function getConfigs(): ConfigParams;

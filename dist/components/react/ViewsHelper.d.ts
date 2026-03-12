import { ResourcePermissionData } from "@sysnormal/sso-js-integrations";
import type { ActionDispatch, AnyActionArg } from "react";
export type Translater = (text: string) => string;
export type DefaultResourceProps = {
    permission?: ResourcePermissionData | null | undefined;
    loadingPermission?: boolean;
    loadedPermission?: boolean;
    dispatch?: ActionDispatch<AnyActionArg>;
};
export declare function defaultInitialResourceState(props?: DefaultResourceProps): DefaultResourceProps;
export declare function defaultReducer(state?: any, action?: any): any;
export declare function setReducerState(dispatch: ActionDispatch<AnyActionArg>, payload: any): void;

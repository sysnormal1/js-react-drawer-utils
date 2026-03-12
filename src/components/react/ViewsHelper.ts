import { ResourcePermissionData } from "@sysnormal/sso-js-integrations";
import type { ActionDispatch, AnyActionArg } from "react";


export type Translater = (text: string) => string;

export type DefaultResourceProps = {
    permission?: ResourcePermissionData | null | undefined,
    loadingPermission?: boolean,
    loadedPermission?: boolean,
    dispatch?: ActionDispatch<AnyActionArg>;
}

export function defaultInitialResourceState(props?: DefaultResourceProps) : DefaultResourceProps {
    const result: DefaultResourceProps = {
        permission: null,
        loadingPermission: false,//firstValid([props?.loadingPermission,false]),
        loadedPermission: false,//firstValid([props?.loadedPermission,false]),
        dispatch: props?.dispatch
    }
    return result;
}

export function defaultReducer(state?: any, action?: any) : any {
    switch (action.type) {
        case 'SET_DATA':
            return { ...state, ...action.payload};
        default:
            return state;
    }
}

export function setReducerState(dispatch: ActionDispatch<AnyActionArg>, payload: any) : void {
    dispatch({
        type: 'SET_DATA',
        payload: payload
    });
}


import { ListItemWithSubProps } from "./components/react/ListItemWithSub.js";
import { ReactNode } from "react";
import { Translater } from "./components/react/ViewsHelper.js";
import { AuthorizationParams, ResourcePermissionData } from "@sysnormal/sso-js-integrations";
import { RouteObject } from "react-router";
export declare function mountDrawerMenuItem(params: {
    menuItem: ResourcePermissionData;
    currentViewRoute?: string;
    listItemProps?: ListItemWithSubProps;
}): ReactNode | null | undefined;
export declare function mountBrowserRouterItem(params: {
    menuItem: ResourcePermissionData;
    mappedResources: {
        [key: string]: {
            getElement: () => ReactNode;
        };
    };
    currentBrowserObject: RouteObject[];
    authContextGetter?: () => AuthorizationParams;
    translater?: Translater;
}): void;
export declare function mountBrowserRouterObject(params: {
    mappedResources: {
        [key: string]: {
            getElement: () => ReactNode;
        };
    };
    authContextGetter?: () => AuthorizationParams;
    translater?: Translater;
    parser?: (...others: any) => any;
    msgNotHasPermissions?: string;
}): Promise<RouteObject[]>;
export declare function openAll(elements?: any): void;
export declare function filterMenu(event?: any): void;

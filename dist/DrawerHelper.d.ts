import { ListItemWithSubProps } from "./components/react/ListItemWithSub.js";
import { ReactNode } from "react";
import { Translater } from "./components/react/ViewsHelper.js";
import { AuthorizationParams, ResourcePermissionData } from "@sysnormal/sso-js-integrations";
import { RouteObject } from "react-router";
export declare function mountDrawerMenuItem(menuItem: ResourcePermissionData, currentViewRoute?: string, params?: ListItemWithSubProps): ReactNode | null | undefined;
export declare function mountBrowserRouterItem(menuItem: ResourcePermissionData, mappedResources: {
    [key: string]: {
        getElement: () => ReactNode;
    };
}, currentBrowserObject: RouteObject[], authContextGetter?: () => AuthorizationParams, translater?: Translater): void;

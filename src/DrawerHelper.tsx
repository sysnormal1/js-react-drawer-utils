import { firstValid, hasValue, toBool } from "@aalencarv/common-utils";
import ListItemWithSub, { ListItemWithSubProps } from "./components/react/ListItemWithSub.js";
import React, { ReactNode } from "react";
import { Box, List, ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material";
import _ from "lodash";
import { ConfigParams, getConfigs } from "./Config.js";
import { Link } from "react-router";
import DefaultScreen from "./components/react/DefaultScreen.js";
import { Translater } from "./components/react/ViewsHelper.js";
import { AuthorizationParams, getAgentAllowedResources, ResourcePermissionData } from "@sysnormal/sso-js-integrations";
import { RouteObject } from "react-router";
import Root from "./components/react/Root.js";
import ErrorPage from "./components/react/ErrorPage.js";


/**
 * Parameters used by {@link mountDrawerMenuItem}.
 *
 * @remarks
 * This structure defines the information required to convert a
 * {@link ResourcePermissionData} node into a React menu element.
 */
export type MountDrawerMenuItemParams = {

    /**
     * Resource node returned from the SSO permission API.
     *
     * Each node represents a system resource that may contain
     * child resources forming a hierarchical structure.
     */
    menuItem: ResourcePermissionData,

    /**
     * Current route path used to construct nested routes.
     */
    currentViewRoute?: string,

    /**
     * Optional configuration forwarded to {@link ListItemWithSub}.
     */
    listItemProps?: ListItemWithSubProps
}

/**
 * Recursively builds a React drawer menu from a resource tree.
 *
 * @remarks
 * This function converts a {@link ResourcePermissionData} hierarchy
 * into a Material UI navigation structure composed of:
 *
 * - {@link ListItemWithSub} for nodes with children
 * - {@link ListItemButton} for leaf nodes
 *
 * The resulting structure can be used directly inside a navigation
 * drawer or sidebar component.
 *
 * The function automatically:
 *
 * - filters resources marked as hidden from the menu
 * - sorts resources by `resourceNumericOrder`
 * - resolves icons using the provided parser
 * - resolves labels using the provided translator
 * - generates navigation routes for screen resources
 *
 * Resources with children are rendered as expandable menu items,
 * while leaf nodes become navigation links.
 *
 * If the resource type matches the configured screen type
 * (`ssoResourcetypeScreenId`), the item becomes a router link.
 *
 * @param params Configuration parameters for menu generation.
 *
 * @returns A React node representing the menu item, or `null`
 * if the resource should not be rendered.
 *
 * @example
 * ```tsx
 * const menu = resources.map(resource =>
 *   mountDrawerMenuItem({
 *     menuItem: resource,
 *     currentViewRoute: "/app",
 *     listItemProps: {
 *       translater: t,
 *       parser: parseIcon
 *     }
 *   })
 * )
 * ```
 *
 * @see {@link ResourcePermissionData}
 * @see {@link ListItemWithSub}
 */
export function mountDrawerMenuItem(
    params: MountDrawerMenuItemParams
): ReactNode | null | undefined {

    let result: ReactNode | null | undefined = null;

    try {

        const configs: ConfigParams = getConfigs();

        const text: string =
            _.capitalize(
                typeof params.listItemProps?.translater === "function"
                    ? params.listItemProps.translater(params.menuItem.resourceName.toLowerCase())
                    : params.menuItem.resourceName
            );

        const icon: any =
            typeof params.listItemProps?.parser === "function"
                ? params.listItemProps.parser(params.menuItem.resourceIcon)
                : params.menuItem.resourceIcon;

        if (hasValue(params.menuItem?.children)) {

            let children: any[] = [];

            for (let key in params.menuItem.children) {

                if (toBool(firstValid([params.menuItem.children[key].resourceShowInMenu, true])))
                    children.push(params.menuItem.children[key]);
            }

            children.sort((a, b) =>
                (a.resourceNumericOrder || a.resourceId) -
                (b.resourceNumericOrder || b.resourceId)
            );

            for (let key in children) {

                children[key] = mountDrawerMenuItem({
                    ...params,
                    menuItem: children[key],
                    currentViewRoute:
                        params.currentViewRoute +
                        "/" +
                        children[key].resourceName.trim().toLowerCase()
                });
            }

            let linkProps: any = undefined;

            if (params.menuItem.resourceTypeId == configs.ssoResourcetypeScreenId) {

                let showChildrenAsPopup =
                    toBool(firstValid([
                        localStorage?.getItem('showChildrenAsPopup'),
                        configs.showResourceAsPopup
                    ]));

                linkProps = {
                    to:
                        params.menuItem.resourcePath ||
                        (
                            params.currentViewRoute +
                            "/" +
                            params.menuItem.resourceName
                                .trim()
                                .toLowerCase()
                                .replace(/\s/g, '_')
                        )
                };

                if (showChildrenAsPopup || params.menuItem?.target) {

                    linkProps.target = params.menuItem?.target || "_blank";
                    linkProps.rel = "noopener noreferrer";
                }
            }

            result =
                <ListItemWithSub
                    {...params.listItemProps}
                    key={`${params.menuItem.resourceParentId || params.menuItem.resourceId}-${params.menuItem.resourceId}`}
                    text={text}
                    icon={icon}
                    component={
                        params.menuItem.resourceTypeId == configs.ssoResourcetypeScreenId
                            ? Link
                            : undefined
                    }
                    linkProps={linkProps}
                >

                    <List disablePadding={true} sx={{ marginLeft: 1 }}>
                        {children}
                    </List>

                </ListItemWithSub>

        } else {

            if (toBool(firstValid([params.menuItem.resourceShowInMenu, true]))) {

                let linkProps: any = {
                    to:
                        params.menuItem.resourcePath ||
                        (
                            params.currentViewRoute +
                            "/" +
                            params.menuItem.resourceName
                                .trim()
                                .toLowerCase()
                                .replace(/\s/g, '_')
                        )
                };

                let showChildrenAsPopup =
                    toBool(firstValid([
                        localStorage?.getItem('showChildrenAsPopup'),
                        configs.showResourceAsPopup
                    ]));

                if (showChildrenAsPopup || params.menuItem?.target) {

                    linkProps.target = params.menuItem?.target || "_blank";
                    linkProps.rel = "noopener noreferrer";
                }

                result =
                    <ListItemButton
                        key={`${params.menuItem.resourceParentId || params.menuItem.resourceId}-${params.menuItem.resourceId}`}
                        {...linkProps}
                        component={Link}
                        title={text}
                        sx={{
                            minWidth: 1,
                            width: 'fit-content !important'
                        }}
                        onClick={params.listItemProps?.onClick}
                    >

                        <ListItemIcon>
                            {icon}
                        </ListItemIcon>

                        <ListItemText primary={text} />

                    </ListItemButton>;
            }
        }

    } catch (e) {

        console.error(e);
    }

    return result;
}


/**
 * Parameters used by {@link mountBrowserRouterItem}.
 *
 * This structure contains the information required to transform
 * a permission resource entry into a React Router {@link RouteObject}.
 *
 * @remarks
 * The function processes a {@link ResourcePermissionData} node and
 * recursively converts its children into route definitions.
 *
 * @see {@link ResourcePermissionData}
 * @see {@link AuthorizationParams}
 */
export type MountBrowserRouterItemParams = {

    /**
     * Resource entry representing a menu or route item.
     *
     * @see {@link ResourcePermissionData}
     */
    menuItem: ResourcePermissionData;

    /**
     * Map of application routes and their corresponding React elements.
     *
     * The key represents the resource path and the value contains the
     * configuration used to resolve the React element to render.
     */
    mappedResources: {
        [key: string]: {
            /**
             * Function responsible for returning the React element
             * associated with the resource path.
             */
            getElement: () => ReactNode
        }
    };

    /**
     * Target array where the generated {@link RouteObject} instances
     * will be appended.
     */
    currentBrowserObject: RouteObject[];

    /**
     * Getter used to obtain the current authorization context.
     *
     * Implemented as a function to avoid stale closure issues.
     *
     * @see {@link AuthorizationParams}
     */
    authContextGetter?: () => AuthorizationParams;

    /**
     * Translation function used to localize resource names.
     *
     * @see {@link Translater}
     */
    translater?: Translater;
}

/**
 * Converts a {@link ResourcePermissionData} entry into a React Router route.
 *
 * This function recursively traverses the resource permission tree
 * returned by the authorization service and creates the corresponding
 * {@link RouteObject} instances used by `createBrowserRouter`.
 *
 * @remarks
 * Only resources that have a matching entry in `mappedResources`
 * will generate routes.
 *
 * Each generated route is wrapped by {@link DefaultScreen}, which
 * ensures that the component is rendered only when the user has
 * permission to access the resource.
 *
 * Child resources are processed recursively to build the complete
 * router structure.
 *
 * @param params {@link MountBrowserRouterItemParams}
 *
 * @example
 * ```ts
 * mountBrowserRouterItem({
 *   menuItem: resource,
 *   mappedResources,
 *   currentBrowserObject: routes,
 *   authContextGetter
 * })
 * ```
 *
 * @see {@link ResourcePermissionData}
 * @see {@link DefaultScreen}
 */
export function mountBrowserRouterItem(params: MountBrowserRouterItemParams): void {

    try {

        if (hasValue(params.menuItem.resourcePath)) {

            if (params.mappedResources[params.menuItem.resourcePath]) {

                let routine: RouteObject = {
                    path: params.menuItem.resourcePath,
                    element: (
                        <DefaultScreen
                            key={params.menuItem.resourcePath}
                            /* 
                             Forces component re-render when the route path changes.
                             This ensures the permission state is reset when
                             navigating to a different resource.
                            */
                            topBarTitle={params.menuItem.resourceName}
                            authContextGetter={params.authContextGetter}
                            translater={params.translater}
                        >
                            {params.mappedResources[params.menuItem.resourcePath].getElement()}
                        </DefaultScreen>
                    )
                }

                params.currentBrowserObject.push(routine);
            }
        }

        if (hasValue(params.menuItem.children)) {

            for (let key in (params.menuItem.children || [])) {

                mountBrowserRouterItem({
                    ...params,
                    menuItem: params.menuItem.children[key]
                });

            }
        }

    } catch (e) {
        console.error(e);
    }
}



/**
 * Parameters used to mount the Browser Router object with dynamic resources.
 */
export type MountBrowserRouterObjectParams = {

    /**
     * Map of application resources.
     * 
     * The key represents the resource path and the value contains the configuration
     * used to render the React element associated with that path.
     */
    mappedResources: {
        [key: string]: {
            /**
             * Function responsible for returning the React element that should be
             * rendered for the given resource path.
             */
            getElement: () => ReactNode;
        };
    };

    /**
     * Function that returns the current authorization context.
     * 
     * Implemented as a getter to avoid stale closure issues.
     * 
     * @see {@link import("@sysnormal/sso-js-integrations").AuthorizationParams}
     */
    authContextGetter: () => AuthorizationParams;

    /**
     * Full URL used to retrieve the list of allowed resources.
     * 
     * This can also be configured through the library initialization config.
     */
    url?: string;

    /**
     * Alternative to `url`.
     * 
     * Represents the endpoint path used to retrieve the allowed resources.
     * Can also be configured during the initialization phase.
     */
    endpoint?: string;

    /**
     * System identifier used by the SSO server or the destination system.
     * 
     * Can also be configured in the initialization configuration.
     */
    systemId?: number;

    /**
     * Translation function used to translate resource names.
     * 
     * Commonly an i18n translation function such as `i18n.t`.
     */
    translater?: Translater;

    /**
     * Parser responsible for converting stored HTML (such as icons from the database)
     * into renderable React content.
     */
    parser?: (...others: any[]) => any;

    /**
     * Message displayed when the user does not have permission to access a resource.
     */
    msgNotHasPermissions?: string;
};


/**
 * Builds the `RouteObject[]` configuration used by `createBrowserRouter`.
 *
 * This function dynamically generates the application routes based on the
 * resources returned by the authorization service. Only routes that the
 * current agent is allowed to access will be included.
 *
 * The generated structure also injects the root layout component and
 * a fallback error route.
 *
 * @async
 * @param params See {@link MountBrowserRouterObjectParams}. Configuration parameters used to resolve authorized resources
 * and build the router structure.
 *
 * @returns A promise that resolves to a list of `RouteObject` instances
 * compatible with `createBrowserRouter`.
 *
 * @remarks
 * This function internally calls the authorization service to retrieve the
 * allowed resources for the current agent. Each allowed resource is then
 * transformed into a `RouteObject` using `mountBrowserRouterItem`.
 *
 * If the user has no allowed resources, a fallback route displaying a
 * "no permissions" message is created instead.
 *
 * @example
 * ```ts
 * const router = createBrowserRouter(
 *   await mountBrowserRouterObject({
 *     mappedResources,
 *     authContextGetter: () => authContext
 *   })
 * );
 * ```
 *
 * @since 1.0.0
 */
export async function mountBrowserRouterObject(params: MountBrowserRouterObjectParams): Promise<RouteObject[]>{    
    let result : RouteObject[] = [];    
    try {
        const configs = getConfigs();
        let agentAllowedResources = await getAgentAllowedResources({
            authContextGetter: params.authContextGetter,
            ssoUrl: params.url,
            ssoEndpoint: params.endpoint,
            ssoSystemId: params.systemId
        });
        result = [{
            path: "/",
            element: <Root menuData={agentAllowedResources?.data || []} parser={params.parser} translater={params.translater}/>
        },{
            path: "/online",
            element:"ok"
        }];

        let others : RouteObject[] = [];
        
        if (agentAllowedResources?.success) {
            if (hasValue(agentAllowedResources.data)) {
                for(let key in agentAllowedResources.data) {
                    mountBrowserRouterItem({
                        ...params,
                        menuItem: agentAllowedResources.data[key], 
                        currentBrowserObject: others
                    });
                }
            } else {
                others.push({
                    path: '/',
                    element: <Box sx={{
                        height: 1,
                        width: 1,
                        textAlign: 'center',
                        alignContent: 'center'
                    }}>
                        <Typography variant="h4" color="error">
                            {typeof params.translater === "function" ? params.translater(params.msgNotHasPermissions||'') : params.msgNotHasPermissions}
                        </Typography>
                    </Box>
                })
            }
        }   
        
        others.push({
            path:"*",
            element: <ErrorPage showAsPopup={configs.showResourceAsPopup}/>
        })

        if (!configs.showResourceAsPopup) {
            result[0].children = others;
        } else {
            others.unshift(result[0]);
            result = others;
        }
    } catch (e) {
        console.error(e);
    }
    return result;
}


export function openAll(elements?: any) {
    try {
      for(let k in elements) {
        if (elements[k].tagName === 'BUTTON' && (
            !elements[k].nextSibling || (
              elements[k].nextSibling && elements[k].nextSibling.tagName === 'DIV' && elements[k].nextSibling.classList.contains('MuiCollapse-hidden')
            )
        )) {
          elements[k].click();
        }
      }
      for(let k in elements) { 
        if (elements[k].tagName === 'BUTTON' && (
            elements[k].nextSibling && elements[k].nextSibling.tagName === 'DIV'            
        )) {
          openAll(elements[k].nextSibling.children[0].children[0].children[0].children);
        }
      }
    } catch (e) {
      console.error(e);
    }
}

export function filterMenu(event?: any) {
    try {
      let ul = event.target.parentNode.parentNode.parentNode.nextSibling.nextSibling;
      let children = ul.children;
      openAll(children);
      let val = event.target.value.trim().toLowerCase();
      let as = $(ul).find('a.MuiListItemButton-root');        
      let toShow = [];
      let toHidden = [];
      for(let i = 0; i < as.length; i++) {
        if (val.length === 0 || as.eq(i).find("span.MuiListItemText-primary:first").text().toLowerCase().indexOf(val) > -1) {
          toShow.push(as.eq(i));
        } else {
          toHidden.push(as.eq(i));
        }
      }    
      let parentUl = null;
      let parentButton = null;
      for(let i = 0; i < toHidden.length; i++) {
        toHidden[i].hide();            
        parentUl = toHidden[i].closest("ul");            
        if (parentUl.children("div.MuiCollapse-root").length === 0) {
          parentButton = toHidden[i].closest("div.MuiCollapse-root").prev("button.MuiListItemButton-root");
          while(parentButton.length && parentUl.length && parentUl.children("a.MuiListItemButton-root:visible").length === 0) {
            parentButton.hide();
            parentUl = parentButton.closest("ul");
            parentButton = parentUl.closest("div.MuiCollapse-root").prev("button.MuiListItemButton-root");
          }
        }
      }

      for(let i = 0; i < toShow.length; i++) {          
        toShow[i].show();          
        parentButton = toShow[i].closest("div.MuiCollapse-root").prev("button.MuiListItemButton-root");
        while(parentButton.length) {
          parentButton.show();
          parentButton = parentButton.closest("div.MuiCollapse-root").prev("button.MuiListItemButton-root");
        }
      }
    } catch(e) {
      console.error(e);
    }
}  
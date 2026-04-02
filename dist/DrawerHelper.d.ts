import { ListItemWithSubProps } from "./components/react/ListItemWithSub.js";
import { ReactNode } from "react";
import { Translater } from "./components/react/ViewsHelper.js";
import { AuthorizationParams, ResourcePermissionData } from "@sysnormal/sso-js-integration";
import { RouteObject } from "react-router";
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
    menuItem: ResourcePermissionData;
    /**
     * Current route path used to construct nested routes.
     */
    currentViewRoute?: string;
    /**
     * Optional configuration forwarded to {@link ListItemWithSub}.
     */
    listItemProps?: ListItemWithSubProps;
};
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
export declare function mountDrawerMenuItem(params: MountDrawerMenuItemParams): ReactNode | null | undefined;
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
            getElement: () => ReactNode;
        };
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
};
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
export declare function mountBrowserRouterItem(params: MountBrowserRouterItemParams): void;
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
     * @see {@link import("@sysnormal/sso-js-integration").AuthorizationParams}
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
    themeContextGetter: () => any;
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
export declare function mountBrowserRouterObject(params: MountBrowserRouterObjectParams): Promise<RouteObject[]>;
export declare function openAll(elements?: any): void;
export declare function filterMenu(event?: any): void;

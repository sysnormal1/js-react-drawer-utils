import { useEffect, useReducer } from "react";
import { useLocation, useMatches } from "react-router";
import { toBool, typeOf } from "@aalencarv/common-utils";
import { defaultInitialResourceState, defaultReducer } from "./ViewsHelper.js";
import React from "react";
import { getResourcePermission } from "@sysnormal/sso-js-integration";
import { AccessDenied } from "./AccessDenied.js";
import { Loading } from "./Loading.js";
import { useRootLayout } from "./RootProvider.js";
/**
 * Generates the initial reducer state for {@link DefaultScreen}.
 *
 * @param props Optional initial props.
 * @returns Initial state object used by the reducer.
 */
function initialStates(props) {
    return {
        ...defaultInitialResourceState(props)
    };
}
/**
 * Permission-aware screen wrapper component.
 *
 * This component automatically checks whether the current user
 * has permission to access the resource associated with the
 * current route path.
 *
 * @remarks
 * The component performs the following workflow:
 *
 * 1. Detects the current route using `useLocation`
 * 2. Requests the resource permission from the SSO service
 * 3. Displays a loading state while the permission is being resolved
 * 4. Renders the children if access is allowed
 * 5. Displays an access denied view otherwise
 *
 * The resolved permission is stored in the component state and
 * optionally propagated to an external reducer if provided.
 *
 * @param props {@link DefaultScreenProps}
 *
 * @example
 * ```tsx
 * <DefaultScreen authContextGetter={() => authContext}>
 *   <Dashboard />
 * </DefaultScreen>
 * ```
 *
 * @see {@link ResourcePermissionData}
 * @see {@link getResourcePermission}
 */
export default function DefaultScreen(props) {
    const location = useLocation();
    //const params = useParams();
    const matches = useMatches();
    const [state, dispatch] = useReducer(defaultReducer, initialStates(props));
    const { setTopBarTitle, setTopBarChildren } = useRootLayout();
    useEffect(() => {
        localStorage?.setItem('lastLocation', location.pathname);
        if (!state?.loadedPermission && !state?.loadingPermission) {
            loadResourcePermission();
        }
    }, [
        location?.pathname,
        props?.authContextGetter,
        state?.loadedPermission,
        state?.loadingPermission,
        state?.permission
    ]);
    useEffect(() => {
        setTopBarTitle(props.topBarTitle);
        setTopBarChildren(null);
    }, [setTopBarTitle, setTopBarChildren, props.topBarTitle]);
    /**
     * Loads the permission associated with the current route.
     *
     * This function queries the SSO authorization service
     * to determine whether the current agent has access
     * to the resource represented by the route path.
     *
     * The result is stored in the reducer state and optionally
     * propagated to the parent reducer.
     */
    async function loadResourcePermission() {
        console.debug("INIT loadResourcePermission");
        const payload = {
            loadingPermission: false,
            permission: null
        };
        try {
            if (!state.loadedPermission && !state.loadingPermission) {
                dispatch({
                    type: 'SET_DATA',
                    payload: {
                        loadingPermission: true
                    }
                });
                if (typeof props?.dispatch === "function") {
                    props.dispatch({
                        type: 'SET_DATA',
                        payload: {
                            loadingPermission: true
                        }
                    });
                }
                let currentRoute = matches[matches.length - 1];
                let resourcePath = (currentRoute.handle || {}).originalPath || location.pathname;
                let resourcePermission = await getResourcePermission({
                    resourcePath: resourcePath,
                    authContextGetter: props?.authContextGetter
                });
                payload.loadedPermission = true;
                if (resourcePermission?.success) {
                    payload.permission =
                        typeOf(resourcePermission.data) === "array"
                            ? (resourcePermission.data || [])[0]
                            : resourcePermission.data || null;
                }
                else {
                    console.error(resourcePermission);
                }
            }
        }
        catch (e) {
            console.error(e);
        }
        finally {
            dispatch({
                type: 'SET_DATA',
                payload: payload
            });
            if (typeof props?.dispatch === "function") {
                props.dispatch({
                    type: 'SET_DATA',
                    payload: payload
                });
            }
        }
        console.debug("END loadResourcePermission", payload);
    }
    console.debug("rendering default screen", "loadingPermission", state?.loadingPermission, "loadedPermission", state?.loadedPermission, "permission", state?.permission);
    return toBool(state?.loadingPermission) && !toBool(state?.loadedPermission)
        ? React.createElement(Loading, { translater: props?.translater })
        : toBool(state.permission?.resourcePermissionAllowedAccess) &&
            toBool(state.permission?.resourcePermissionAllowedView)
            ? props.children
            : React.createElement(AccessDenied, { translater: props?.translater });
}

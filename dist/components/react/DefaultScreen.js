import { useEffect, useReducer } from "react";
import { useLocation } from "react-router";
import { toBool, typeOf } from "@aalencarv/common-utils";
import { defaultInitialResourceState, defaultReducer } from "./ViewsHelper.js";
import React from "react";
import { getResourcePermission } from "@sysnormal/sso-js-integrations";
import { AccessDenied } from "./AccessDenied.js";
import { Loading } from "./Loading.js";
function initialStates(props) {
    return {
        ...defaultInitialResourceState(props)
    };
}
export default function DefaultScreen(props) {
    const location = useLocation();
    const [state, dispatch] = useReducer(defaultReducer, initialStates(props));
    useEffect(() => {
        localStorage?.setItem('lastLocation', location.pathname);
        //appContext.setTopBarTitle(props.topBarTitle); @todo reimplement
        //appContext.setTopBarChildren(null); @todo reimplement
        if (!state?.loadedPermission && !state?.loadingPermission) {
            loadResourcePermission();
        }
    }, [location?.pathname, props?.authContextGetter, state?.loadedPermission, state?.loadingPermission, state?.permission]);
    async function loadResourcePermission() {
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
                let resourcePermission = await getResourcePermission({
                    resourcePath: location.pathname,
                    authContextGetter: props?.authContextGetter
                });
                payload.loadedPermission = true;
                if (resourcePermission?.success) {
                    payload.permission = typeOf(resourcePermission.data) === "array" ? (resourcePermission.data || [])[0] : resourcePermission.data || null;
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
    }
    return toBool(state?.loadingPermission) && !toBool(state?.loadedPermission)
        ? React.createElement(Loading, { translater: props?.translater })
        : toBool(state.permission?.resourcePermissionAllowedAccess) && toBool(state.permission?.resourcePermissionAllowedView)
            ? props.children
            : React.createElement(AccessDenied, { translater: props?.translater });
}

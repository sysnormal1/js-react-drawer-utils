import { createContext, useContext, useEffect, useReducer } from "react";
import { useLocation, useMatch, useMatches, useParams } from "react-router";
import { DefaultDataSwap, hasValue, toBool, typeOf } from "@aalencarv/common-utils";
import _ from "lodash";
import { defaultInitialResourceState, defaultReducer, DefaultResourceProps, Translater } from "./ViewsHelper.js";
import React from "react";
import { AuthorizationParams, getResourcePermission, ResourcePermissionData } from "@sysnormal/sso-js-integration";
import { AccessDenied } from "./AccessDenied.js";
import { Loading } from "./Loading.js";
import { useRootLayout } from "./RootProvider.js";

/**
 * Props accepted by {@link DefaultScreen}.
 *
 * This component acts as a permission-aware wrapper that controls whether
 * its children should be rendered based on the current user's access rights.
 *
 * @remarks
 * The component automatically resolves resource permissions using the
 * current route path and the provided authorization context.
 *
 * @see {@link DefaultResourceProps}
 * @see {@link ResourcePermissionData}
 * @see {@link AuthorizationParams}
 */
export type DefaultScreenProps =
  React.ComponentProps<"div"> &
  DefaultResourceProps & {

    /**
     * Optional title used by the top bar of the screen.
     */
    topBarTitle?: string;

    /**
     * Translation function used to localize text messages.
     *
     * Typically mapped to an i18n function such as `i18n.t`.
     *
     * @see {@link Translater}
     */
    translater?: Translater;

    /**
     * Function used to retrieve the current authorization context.
     *
     * Implemented as a getter to avoid stale closure issues.
     *
     * @returns The current authorization parameters.
     *
     * @see {@link AuthorizationParams}
     */
    authContextGetter?: () => AuthorizationParams;
  }

/**
 * Generates the initial reducer state for {@link DefaultScreen}.
 *
 * @param props Optional initial props.
 * @returns Initial state object used by the reducer.
 */
function initialStates(props?: any): any {
  return {
    ...defaultInitialResourceState(props)
  }
}

export type DefaultScreenContextType = {
  permission?: ResourcePermissionData | null;
  loading?: boolean;
  loaded?: boolean;
};

const DefaultScreenContext = createContext<DefaultScreenContextType | null>(null);

export function useDefaultScreenPermission() {
  const context = useContext(DefaultScreenContext);

  if (!context) {
    throw new Error("useDefaultScreenPermission must be used within DefaultScreen");
  }

  return context;
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
export default function DefaultScreen(props: DefaultScreenProps) {
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

  useEffect(()=>{
    setTopBarTitle(props.topBarTitle);
    setTopBarChildren(null);
  },[setTopBarTitle, setTopBarChildren, props.topBarTitle]);

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
    const payload: any = {
      loadingPermission: false,
      permission: null
    }

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
        let resourcePath : string = (currentRoute.handle || {} as any).originalPath || location.pathname;
        

        let resourcePermission : DefaultDataSwap<ResourcePermissionData[]> | DefaultDataSwap<ResourcePermissionData> = await getResourcePermission({
            resourcePath: resourcePath,
            authContextGetter: props?.authContextGetter
          });

        payload.loadedPermission = true;

        if (resourcePermission?.success) {
          payload.permission =
            typeOf(resourcePermission.data) === "array"
              ? (resourcePermission.data || [])[0]
              : resourcePermission.data || null;
        } else {
          console.error(resourcePermission);
        }
      }

    } catch (e) {
      console.error(e);
    } finally {

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

  console.debug("rendering default screen","loadingPermission",state?.loadingPermission, "loadedPermission",state?.loadedPermission, "permission", state?.permission)

  return <DefaultScreenContext.Provider
    value={{
      permission: state?.permission,
      loading: state?.loadingPermission,
      loaded: state?.loadedPermission
    }}
  >{
    toBool(state?.loadingPermission) && !toBool(state?.loadedPermission)
    ? <Loading translater={props?.translater} />
    : toBool(state.permission?.resourcePermissionAllowedAccess) &&
      toBool(state.permission?.resourcePermissionAllowedView)
      ? props.children
      : <AccessDenied translater={props?.translater} />
  }</DefaultScreenContext.Provider>
}

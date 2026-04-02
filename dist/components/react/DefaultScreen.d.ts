import { DefaultResourceProps, Translater } from "./ViewsHelper.js";
import React from "react";
import { AuthorizationParams } from "@sysnormal/sso-js-integration";
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
export type DefaultScreenProps = React.ComponentProps<"div"> & DefaultResourceProps & {
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
};
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
export default function DefaultScreen(props: DefaultScreenProps): string | number | bigint | boolean | React.JSX.Element | Iterable<React.ReactNode> | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined;

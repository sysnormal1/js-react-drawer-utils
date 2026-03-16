import { ResourcePermissionData } from "@sysnormal/sso-js-integrations";
import type { ActionDispatch, AnyActionArg } from "react";
/**
 * Translation function used to convert text keys into localized strings.
 *
 * This is typically mapped to an internationalization library function
 * such as `i18n.t`.
 *
 * @param text Text key to be translated.
 * @returns The translated string.
 *
 * @example
 * ```ts
 * const translater: Translater = (text) => i18n.t(text)
 * ```
 */
export type Translater = (text: string) => string;
/**
 * Default properties used by resource-aware components.
 *
 * This structure contains the permission data associated with a resource
 * and the loading state used when resolving permissions asynchronously.
 *
 * @remarks
 * These props are typically injected into components that need to react
 * to authorization changes or permission loading states.
 *
 * @see {@link ResourcePermissionData}
 */
export type DefaultResourceProps = {
    /**
     * Permission information associated with the current resource.
     *
     * @see {@link ResourcePermissionData}
     */
    permission?: ResourcePermissionData | null | undefined;
    /**
     * Indicates whether the permission information is currently being loaded.
     */
    loadingPermission?: boolean;
    /**
     * Indicates whether the permission information has already been loaded.
     */
    loadedPermission?: boolean;
    /**
     * Optional reducer dispatch function used to update the component state.
     */
    dispatch?: ActionDispatch<AnyActionArg>;
};
/**
 * Creates the default initial state used by resource-aware components.
 *
 * This helper function standardizes the initialization of
 * {@link DefaultResourceProps} objects.
 *
 * @param props Optional initial properties.
 * @returns A new initialized {@link DefaultResourceProps} instance.
 *
 * @see {@link DefaultResourceProps}
 */
export declare function defaultInitialResourceState(props?: DefaultResourceProps): DefaultResourceProps;
/**
 * Default reducer used to update resource state.
 *
 * This reducer performs a shallow merge of the current state with
 * the provided payload when the `SET_DATA` action is dispatched.
 *
 * @param state Current reducer state.
 * @param action Reducer action object.
 *
 * @returns The updated reducer state.
 *
 * @remarks
 * This reducer is intentionally generic and can be reused across
 * components that rely on {@link DefaultResourceProps}.
 */
export declare function defaultReducer(state?: any, action?: any): any;
/**
 * Dispatches a state update using the default reducer pattern.
 *
 * This utility simplifies sending `SET_DATA` actions to a reducer
 * using a standardized payload structure.
 *
 * @param dispatch Reducer dispatch function.
 * @param payload Partial state update payload.
 *
 * @see {@link defaultReducer}
 */
export declare function setReducerState(dispatch: ActionDispatch<AnyActionArg>, payload: any): void;

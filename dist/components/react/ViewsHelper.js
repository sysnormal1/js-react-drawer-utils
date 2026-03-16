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
export function defaultInitialResourceState(props) {
    const result = {
        permission: null,
        loadingPermission: false,
        loadedPermission: false,
        dispatch: props?.dispatch
    };
    return result;
}
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
export function defaultReducer(state, action) {
    switch (action.type) {
        case 'SET_DATA':
            return { ...state, ...action.payload };
        default:
            return state;
    }
}
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
export function setReducerState(dispatch, payload) {
    dispatch({
        type: 'SET_DATA',
        payload: payload
    });
}

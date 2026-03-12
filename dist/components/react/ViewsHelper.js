export function defaultInitialResourceState(props) {
    const result = {
        permission: null,
        loadingPermission: false, //firstValid([props?.loadingPermission,false]),
        loadedPermission: false, //firstValid([props?.loadedPermission,false]),
        dispatch: props?.dispatch
    };
    return result;
}
export function defaultReducer(state, action) {
    switch (action.type) {
        case 'SET_DATA':
            return { ...state, ...action.payload };
        default:
            return state;
    }
}
export function setReducerState(dispatch, payload) {
    dispatch({
        type: 'SET_DATA',
        payload: payload
    });
}

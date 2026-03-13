import { AppBar as MuiAppBar, Toolbar, styled, useMediaQuery, useTheme } from "@mui/material";
import { useState } from "react";
import { firstValid, toBool } from '@aalencarv/common-utils';
import React from "react";
const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open' && prop !== 'leftDrawerWidth',
})((params) => ({
    zIndex: params.theme.zIndex.drawer + 1,
    transition: params.theme.transitions.create(['width', 'margin'], {
        easing: params.theme.transitions.easing.sharp,
        duration: params.theme.transitions.duration.leavingScreen,
    }),
    ...(params.open && {
        marginLeft: params.leftDrawerWidth,
        width: `calc(100% - ${params.leftDrawerWidth}px)`,
        transition: params.theme.transitions.create(['width', 'margin'], {
            easing: params.theme.transitions.easing.sharp,
            duration: params.theme.transitions.duration.enteringScreen,
        }),
    }),
}));
function TopAppBar(props) {
    //const location = useLocation();
    /*
    @todo 2026-03-13 reimplement
    const appContext = useContext(AppContext);
    const authContext = useContext(AuthContext);
    const themeContext = useContext(ThemeContext);*/
    const [anchorEl, setAnchorEl] = useState(null);
    const [idiom, setIdiom] = useState(null);
    const [openedLocalConfigs, setOpenedLocalConfigs] = useState(false);
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm')); // Ajuste o breakpoint conforme necessário.
    /*
    @todo 2026-03-13 reimplement
    useEffect(()=>{
        (async()=>{
            const { BR, US } = await import("country-flag-icons/react/3x2"); //CommonJS
            setIdiom(i18n.language === 'pt-BR' ? <BR />: <US />);
        })();
    },[appContext.topBarTitle])*/
    /*
    @todo 2026-03-13 reimplement
    useLayoutEffect(() => {
        if (hasValue(appContext?.appBarRef?.current)) {
            appContext.setAppBarHeight(appContext.appBarRef?.current?.getBoundingClientRect().height);
        }
    }, [appContext]);*/
    return (React.createElement(AppBar
    //ref={appContext.appBarRef} @todo 2026-03-13 reimplement
    , { 
        //ref={appContext.appBarRef} @todo 2026-03-13 reimplement
        position: "fixed", open: !props.leftDrawerCollapsed, leftDrawerWidth: toBool(firstValid([props.hasLeftDrawer, true])) && !isSmallScreen ? props.leftDrawerWidth : 0 },
        React.createElement(Toolbar, null)));
}
export default TopAppBar;

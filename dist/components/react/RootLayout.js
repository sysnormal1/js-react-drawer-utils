import { Box, CssBaseline, useTheme } from "@mui/material";
import { Outlet } from "react-router";
import { firstValid, toBool } from '@aalencarv/common-utils';
import React from "react";
import TopAppBar from "./TopAppBar.js";
import LeftDrawer from "./LeftDrawer.js";
export default function RootLayout(props) {
    //const appContext = useContext(AppContext);     
    const theme = useTheme();
    function handleCollapse(collapsed) {
        localStorage?.setItem('leftDrawerCollapsed', collapsed ? "true" : "false");
        //appContext.setLeftDrawerCollapsed(collapsed); @todo 2026-03-13 - reimplement
    }
    return (React.createElement(Box, { sx: { display: 'flex' } },
        React.createElement(CssBaseline, null),
        (toBool(firstValid([props?.topBar?.active, true])) !== false) && React.createElement(TopAppBar, { hasLeftDrawer: toBool(firstValid([props?.leftDrawer?.active, true])) !== false, 
            //leftDrawerCollapsed={appContext.leftDrawerCollapsed} @todo 2026-03-13 - reimplement
            setLeftDrawerCollapsed: toBool(firstValid([props?.leftDrawer?.active, true])) !== false ? handleCollapse : false, leftDrawerWidth: props.leftDrawerWidth }),
        (toBool(firstValid([props?.leftDrawer?.active, true])) !== false) && React.createElement(LeftDrawer
        //collapsed={appContext.leftDrawerCollapsed} @todo 2026-03-13 - reimplement
        , { 
            //collapsed={appContext.leftDrawerCollapsed} @todo 2026-03-13 - reimplement
            setCollapsed: handleCollapse, width: props.leftDrawerWidth, items: props.menuItems || [] }),
        React.createElement(Box, { component: "main", sx: {
                flexGrow: 1,
                padding: 1,
                marginTop: 7,
                /*
                @todo 2026-03-13 - reimplement
                height:`calc(100% - ${appContext.appBarHeight}px + ${theme.spacing(0)})`,
                minHeight:`calc(100% - ${appContext.appBarHeight}px + ${theme.spacing(0)})`,
                maxHeight:`calc(100% - ${appContext.appBarHeight}px + ${theme.spacing(0)})`,*/
                width: `calc(100% - ${props.leftDrawerWidth}px)`,
            } }, props.children
            ? props.children
            : (toBool(firstValid([props?.outlet?.active, true])) !== false
                ? React.createElement(Outlet /*context={[setTopBarTitle]}*/, null)
                : null))));
}

import { DarkMode, Menu as MenuIcon, WhatsApp } from "@mui/icons-material";
import { AppBar as MuiAppBar, Box, IconButton, Menu, MenuItem, SvgIcon, Toolbar, Tooltip, Typography, styled, useMediaQuery, useTheme, Avatar, Link, Icon } from "@mui/material";
import { useEffect, useRef } from "react";
import { useState } from "react";
import { firstValid, toBool } from '@aalencarv/common-utils';
import React from "react";
import _ from "lodash";
import { useRootLayout } from "./RootProvider.js";
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
export default function TopAppBar(props) {
    //const location = useLocation();
    /*
    @todo 2026-03-13 reimplement
    const themeContext = useContext(ThemeContext);*/
    const authContext = typeof props.authContextGetter === "function" ? props.authContextGetter() : null;
    const themeContext = typeof props.themeContextGetter === "function" ? props.themeContextGetter() : null;
    const { topBarTitle, topBarChildren } = useRootLayout();
    const appBarRef = useRef(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [idiom, setIdiom] = useState(null);
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm')); // Ajuste o breakpoint conforme necessário.
    useEffect(() => {
        (async () => {
            const { BR, US } = await import("country-flag-icons/react/3x2"); //CommonJS
            setIdiom((props.language || navigator.language) === 'pt-BR' ? React.createElement(BR, null) : React.createElement(US, null));
        })();
    }, []);
    /*
    @todo 2026-04-01 - check if necessary or exclude
    useLayoutEffect(() => {
        if (hasValue(appBarRef?.current)) {
            appContext.setAppBarHeight(appBarRef?.current?.getBoundingClientRect().height);
        }
    }, [appBarRef]);*/
    return (React.createElement(AppBar, { ref: appBarRef, position: "fixed", open: !props.leftDrawerCollapsed, leftDrawerWidth: toBool(firstValid([props.hasLeftDrawer, true])) && !isSmallScreen ? props.leftDrawerWidth : 0 },
        React.createElement(Toolbar, null,
            authContext.logged && (props.setLeftDrawerCollapsed || isSmallScreen) &&
                React.createElement(Tooltip, { title: `${_.capitalize(props.translater('expand'))}/${props.translater('collapse')} ${props.translater('menu')}` },
                    React.createElement(IconButton, { color: "inherit", edge: "start", onClick: () => {
                            props.setLeftDrawerCollapsed(!props.leftDrawerCollapsed);
                        }, sx: {
                            marginRight: 5,
                            ...((!props.leftDrawerCollapsed && !isSmallScreen) && { display: 'none' })
                        } },
                        React.createElement(MenuIcon, null))),
            React.createElement(Typography, { variant: "h6", component: "div", sx: { flexGrow: 1 } }, topBarTitle),
            topBarChildren,
            React.createElement(Tooltip, { title: _.capitalize(props.translater('support')) },
                React.createElement(Link, { href: "https://api.whatsapp.com/send?phone=5545991334659&text=Ola%20Jumbo%20suporte,%20pode%20me%20ajudar?", target: "_blank" },
                    React.createElement(Icon, { sx: { color: themeContext?.theme === 'dark' ? '#1aff0098' : '#36fb20c0' } },
                        React.createElement(WhatsApp, null)))),
            React.createElement(Box, { sx: { float: "right" } },
                React.createElement(Tooltip, { title: _.capitalize(props.translater('idiom')) },
                    React.createElement(IconButton, null,
                        React.createElement(SvgIcon, null, idiom))),
                React.createElement(Tooltip, { title: _.capitalize(props.translater('theme')) },
                    React.createElement(IconButton, { onClick: () => themeContext?.changeTheme((themeContext?.theme === 'light' ? 'dark' : 'light')) },
                        React.createElement(DarkMode, null)))),
            authContext.logged && (React.createElement("div", null,
                React.createElement(Tooltip, { title: authContext?.agent?.email || _.capitalize(props.translater('user')) },
                    React.createElement(Avatar, { sx: {
                            width: 20,
                            height: 20,
                            cursor: "pointer"
                        }, "aria-label": "account of current user", "aria-controls": "menu-appbar", "aria-haspopup": "true", onClick: (event) => setAnchorEl(event.currentTarget), color: "inherit", title: authContext?.agent?.email || 'user' }, (authContext?.agent?.email?.charAt(0) || 'U').toUpperCase())),
                React.createElement(Menu, { id: "menu-appbar", anchorEl: anchorEl, anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'right',
                    }, keepMounted: true, transformOrigin: {
                        vertical: 'top',
                        horizontal: 'right',
                    }, open: Boolean(anchorEl), onClose: () => setAnchorEl(null) },
                    React.createElement(MenuItem, { onClick: () => {
                            setAnchorEl(null);
                            localStorage?.removeItem('token');
                            authContext.setRefreshToken(null);
                            authContext.setToken(null);
                            authContext.setLogged(false);
                            window.location.href = "/";
                        } }, _.capitalize(props.translater('logout')))))))));
}

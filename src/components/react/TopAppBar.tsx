import { DarkMode, Menu as MenuIcon, WhatsApp } from "@mui/icons-material";
import { AppBar as MuiAppBar, Box, IconButton, Menu, MenuItem, SvgIcon, Toolbar, Tooltip, Typography, styled, useMediaQuery, useTheme, Avatar, Link, Icon } from "@mui/material";
import { ReactNode, useContext, useEffect, useLayoutEffect, useRef } from "react";
import { useState } from "react";
import { firstValid, toBool, hasValue } from '@aalencarv/common-utils';
import React from "react";
import _ from "lodash";
import { useRootLayout } from "./RootProvider.js";


const AppBar : any = styled(MuiAppBar,{
    shouldForwardProp: (prop) => prop !== 'open' && prop !== 'leftDrawerWidth',
  })((params: any)=>({
    zIndex: params.theme.zIndex.drawer + 1,
    transition: params.theme.transitions.create(['width', 'margin'], {
      easing: params.theme.transitions.easing.sharp,
      duration: params.theme.transitions.duration.leavingScreen,
    }),
    ...(params.open && {
      marginLeft: params.leftDrawerWidth,
      width: `calc(100% - ${params.leftDrawerWidth}px)`,
      transition: params.theme.transitions.create(['width','margin'], {
        easing: params.theme.transitions.easing.sharp,
        duration: params.theme.transitions.duration.enteringScreen,
      }),
    }),
}));

export default function TopAppBar(props?: any) {
    //const location = useLocation();
    /*
    @todo 2026-03-13 reimplement
    const themeContext = useContext(ThemeContext);*/
    const authContext = typeof props.authContextGetter === "function" ? props.authContextGetter() : null;
    const themeContext = typeof props.themeContextGetter === "function" ? props.themeContextGetter() : null;
    const { topBarTitle, topBarChildren }= useRootLayout();
    const appBarRef = useRef<HTMLElement>(null);
    
    

    const [anchorEl, setAnchorEl] = useState<any>(null);
    const [idiom, setIdiom] = useState<any>(null);    

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm')); // Ajuste o breakpoint conforme necessário.


    
    useEffect(()=>{
        (async()=>{
            const { BR, US } = await import("country-flag-icons/react/3x2"); //CommonJS
            setIdiom((props.language || navigator.language) === 'pt-BR' ? <BR />: <US />);
        })();
    },[])

    /*
    @todo 2026-04-01 - check if necessary or exclude
    useLayoutEffect(() => {
        if (hasValue(appBarRef?.current)) {
            appContext.setAppBarHeight(appBarRef?.current?.getBoundingClientRect().height);            
        }
    }, [appBarRef]);*/
    

    return (
        <AppBar 
            ref={appBarRef}
            position="fixed" 
            open={!props.leftDrawerCollapsed} 
            leftDrawerWidth={toBool(firstValid([props.hasLeftDrawer,true])) && !isSmallScreen? props.leftDrawerWidth : 0}
        >
            <Toolbar>
                {authContext.logged && (props.setLeftDrawerCollapsed || isSmallScreen)&& 
                    <Tooltip title={`${_.capitalize(props.translater('expand'))}/${props.translater('collapse')} ${props.translater('menu')}`}>   
                        <IconButton
                            color="inherit"
                            edge="start"
                            onClick={()=> {
                                props.setLeftDrawerCollapsed(!props.leftDrawerCollapsed);
                            }} 
                            sx={{
                                marginRight: 5,
                                ...((!props.leftDrawerCollapsed && !isSmallScreen) && {display:'none'})
                            }}
                        > 
                            <MenuIcon />            
                        </IconButton>        
                    </Tooltip> 
                }                
                <Typography variant="h6" component="div" sx={{ flexGrow:1}} >
                    {topBarTitle}
                </Typography> 
                {topBarChildren}
                <Tooltip 
                    title={_.capitalize(props.translater('support'))}                    
                >   
                    <Link href="https://api.whatsapp.com/send?phone=5545991334659&text=Ola%20Jumbo%20suporte,%20pode%20me%20ajudar?" target="_blank">
                        <Icon sx={{color: themeContext?.theme === 'dark' ? '#1aff0098' : '#36fb20c0'}}> 
                            <WhatsApp />
                        </Icon>        
                    </Link>
                </Tooltip>
                <Box sx={{float:"right"}} >
                    <Tooltip title={_.capitalize(props.translater('idiom'))}>   
                        <IconButton > 
                            <SvgIcon>
                                {idiom}
                            </SvgIcon>
                        </IconButton>        
                    </Tooltip>                   
                    <Tooltip title={_.capitalize(props.translater('theme'))}>   
                        <IconButton onClick={()=>themeContext?.changeTheme((themeContext?.theme === 'light' ? 'dark' : 'light'))}> 
                            <DarkMode />            
                        </IconButton>        
                    </Tooltip>
                </Box>
                {authContext.logged && (<div>
                    <Tooltip title={authContext?.agent?.email || _.capitalize(props.translater('user'))}>   
                        <Avatar 
                            sx={{
                                width:20,
                                height:20,
                                cursor:"pointer"
                            }}
                            
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={(event)=>setAnchorEl(event.currentTarget)}
                            color="inherit"
                            title={authContext?.agent?.email||'user'}
                        >
                            {(authContext?.agent?.email?.charAt(0)||'U').toUpperCase()}
                        </Avatar>
                    </Tooltip>
                    <Menu
                        id="menu-appbar"
                        anchorEl={anchorEl}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={Boolean(anchorEl)}
                        onClose={()=>setAnchorEl(null)}
                    >
                        <MenuItem 
                            onClick={()=>{
                                setAnchorEl(null);
                                localStorage?.removeItem('token');
                                authContext.setRefreshToken(null);
                                authContext.setToken(null);
                                authContext.setLogged(false);
                                window.location.href = "/"
                            }}
                        >
                            {_.capitalize(props.translater('logout'))}
                        </MenuItem>
                    </Menu>
                </div>)}
            </Toolbar>
        </AppBar>
    );
}


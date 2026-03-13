import { DarkMode, Menu as MenuIcon, WhatsApp } from "@mui/icons-material";
import { AppBar as MuiAppBar, Box, IconButton, Menu, MenuItem, SvgIcon, Toolbar, Tooltip, Typography, styled, useMediaQuery, useTheme, Avatar, Link, Icon } from "@mui/material";
import { useContext, useEffect, useLayoutEffect } from "react";
import { useState } from "react";
import { firstValid, toBool, hasValue } from '@aalencarv/common-utils';
import React from "react";
import _ from "lodash";


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

function TopAppBar(props?: any) {
    //const location = useLocation();
    /*
    @todo 2026-03-13 reimplement
    const appContext = useContext(AppContext);
    const authContext = useContext(AuthContext);
    const themeContext = useContext(ThemeContext);*/
    const [anchorEl, setAnchorEl] = useState<any>(null);
    const [idiom, setIdiom] = useState<any>(null);    
    const [openedLocalConfigs,setOpenedLocalConfigs] = useState(false);

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

    return (
        <AppBar 
            //ref={appContext.appBarRef} @todo 2026-03-13 reimplement
            position="fixed" 
            open={!props.leftDrawerCollapsed} 
            leftDrawerWidth={toBool(firstValid([props.hasLeftDrawer,true])) && !isSmallScreen? props.leftDrawerWidth : 0}
        >
            <Toolbar>
                {/*
                @todo 2026-03-13 reimplement
                authContext.logged && (props.setLeftDrawerCollapsed || isSmallScreen)&& 
                    <Tooltip title={`${_.capitalize(t('expand'))}/${t('collapse')} ${t('menu')}`}>   
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
                */}              
                {/*
                @todo 2026-03-13 reimplement
                <Typography variant="h6" component="div" sx={{ flexGrow:1}} >
                    {_.capitalize(t(appContext.topBarTitle))}
                </Typography> 
                {
                //appContext?.topBarChildren @todo 2026-03-13 reimplement
                }
                <Tooltip 
                    title={_.capitalize(t('support'))}                    
                >   
                    <Link href="https://api.whatsapp.com/send?phone=5545991334659&text=Ola%20Jumbo%20suporte,%20pode%20me%20ajudar?" target="_blank">
                        <Icon sx={{color:themeContext.theme === 'dark' ? '#1aff0098' : '#36fb20c0'}}> 
                            <WhatsApp />
                        </Icon>        
                    </Link>
                </Tooltip>
                <Box sx={{float:"right"}} >
                    <Tooltip title={_.capitalize(t('idiom'))}>   
                        <IconButton > 
                            <SvgIcon>
                                {idiom}
                            </SvgIcon>
                        </IconButton>        
                    </Tooltip>                   
                    <Tooltip title={_.capitalize(t('theme'))}>   
                        <IconButton onClick={()=>themeContext.changeTheme()}> 
                            <DarkMode />            
                        </IconButton>        
                    </Tooltip>               
                </Box>
                {authContext.logged && (<div>
                    <Tooltip title={authContext?.agent?.email || _.capitalize(t('user'))}>   
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
                                setOpenedLocalConfigs(true);
                            }}
                        >
                            {_.capitalize(t('local configurations'))}
                        </MenuItem>
                        <MenuItem 
                            onClick={()=>{
                                setAnchorEl(null);
                                localStorage?.removeItem('token');
                                authContext.setToken(null);
                                authContext.setLogged(false);
                                window.location.href = "/"
                            }}
                        >
                            {_.capitalize(t('logout'))}
                        </MenuItem>
                    </Menu>
                </div>)}*/}
            </Toolbar>
            {/*
            @todo 2026-03-13 reimplement
            <DialogLocalConfigurations
                ope-={openedLocalConfigs} 
                title="local configurations"               
                entity="configurations"
                entities="configurations"
                onClose={(event: any,reason: any)=>{
                    setOpenedLocalConfigs(false);
                }} 
                setOpenState={(newOpenState:boolean)=>setOpenedLocalConfigs(newOpenState)}
                fullWidth={true} 
                maxWidth={'lg'}
            />*/}
        </AppBar>
    );
}

export default TopAppBar;
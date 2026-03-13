import { Box, CssBaseline, useMediaQuery, useTheme } from "@mui/material";
import { useContext, useEffect, useReducer, useRef, useState } from "react";
import { Outlet } from "react-router";
import { firstValid, hasValue, toBool } from '@aalencarv/common-utils';
import React from "react";
import TopAppBar from "./TopAppBar.js";
import LeftDrawer from "./LeftDrawer.js";


function initialStates(props?: any) {
    return {
        loading: false,
        loaded: false,
        menuData: props?.menuData || [],
        menuItems: null
    };
};

function reducer(state?: any, action?: any) {
    switch (action.type) {
        case 'SET_DATA':
            return { ...state, ...action.payload};
        default:
            return state;
    }
}

export default function RootLayout(props?: any) {
    //const appContext = useContext(AppContext);     
    const theme = useTheme();

    const leftDrawerRef = useRef(null);
    const [leftDrawerWidth,setLeftDrawerWidth] = useState(240);
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm')); // Ajuste o breakpoint conforme necessário.
    const [state, dispatch] = useReducer(reducer, initialStates(props));


    function adjustWidth() { 
        let timeAnimation = (theme?.transitions?.duration?.enteringScreen || 300)+50; 
        
        @todo 2026-03-13 - reimplement
        setTimeout(()=>{
        if (hasValue(appContext.leftDrawerRef?.current)) {  
            const drawerElement = appContext.leftDrawerRef.current;
            let subs = drawerElement.querySelectorAll(":not(.MuiCollapse-hidden) .MuiCollapse-entered>.MuiCollapse-wrapper>.MuiCollapse-wrapperInner>.MuiList-root>.MuiListItemButton-root");
            subs = Array.from(subs).filter((el: any) => {
            const style = window.getComputedStyle(el);
            return style.display !== "none" && style.visibility !== "hidden" && style.opacity !== "0";
            });
            let maiorSoma = 0;
            subs.forEach((el: any)=>{
            const rect = el.getBoundingClientRect();
            
            const computedStyle = window.getComputedStyle(el);

            // Inclui margens no cálculo
            const marginLeft = parseFloat(computedStyle.marginLeft) || 0;
            const marginRight = parseFloat(computedStyle.marginRight) || 0;

            //const paddingLeft = parseFloat(computedStyle./) || 0;
            //const paddingRight = parseFloat(computedStyle.paddingRight) || 0;

            // Cálculo completo: deslocamento + largura + margens
            let somaAtual = rect.left + rect.width + marginLeft + marginRight;
            if (somaAtual > 0) {
                //somaAtual += paddingLeft + paddingRight;
            }

            // Atualiza o maior valor
            if (somaAtual > maiorSoma) {
                maiorSoma = somaAtual;
            }
            });
            if (maiorSoma < 240) maiorSoma = 240 
            else maiorSoma += 16;
            setLeftDrawerWidth(maiorSoma);

        }
        },timeAnimation)
    };

    function handleMenuItemClick(event?: any) {
        if (isSmallScreen) {
        let link = $(event.target).closest("a[href]");
        if (link.length) {
            //appContext.setLeftDrawerCollapsed(true); todo 2026-03-13 - reimplement
        }
        }
    }

    
    function mountMenuItems(menuData?: any[]) : void {
        try {
        let agentMenu : any = [];
        if (hasValue(menuData)) {
            for(let key in menuData || []) {                
            agentMenu.push(mountDrawerMenuItem({
                menuItem: menuData[key],
                currentViewRoute: "",
                listItemProps: {
                onEntered:adjustWidth,
                onExited:adjustWidth,
                onClick:handleMenuItemClick,
                //theme: themeContext.theme, todo 2026-03-13 - reimplement
                parser: props.parser,
                translater: props.translater
                }
            }));
            }
        }
        dispatch({
            type: 'SET_DATA',
            payload: {
            menuItems: agentMenu
            }
        })
        } catch (e) {
        console.error(e);
        }
    }

    useEffect(()=>{
        mountMenuItems(state.menuData);
    }, [state.menuData])




    function handleCollapse(collapsed: boolean) : void {
        localStorage?.setItem('leftDrawerCollapsed', collapsed ? "true" : "false");
        //appContext.setLeftDrawerCollapsed(collapsed); @todo 2026-03-13 - reimplement
    }

    return (            
        <Box sx={{display: 'flex'}}>
            <CssBaseline />        
            {(toBool(firstValid([props?.topBar?.active,true])) !== false) && <TopAppBar 
                hasLeftDrawer={toBool(firstValid([props?.leftDrawer?.active,true])) !== false}
                leftDrawerCollapsed={appContext.leftDrawerCollapsed} @todo 2026-03-13 - reimplement
                setLeftDrawerCollapsed={toBool(firstValid([props?.leftDrawer?.active,true])) !== false ? handleCollapse : false} 
                leftDrawerWidth={props.leftDrawerWidth}                
            />}
            {(toBool(firstValid([props?.leftDrawer?.active,true])) !== false) && <LeftDrawer 
                ref={leftDrawerRef}
                collapsed={appContext.leftDrawerCollapsed} @todo 2026-03-13 - reimplement
                setCollapsed={handleCollapse} 
                width={props.leftDrawerWidth}
                items={props.menuItems || []}                
            />}
            <Box component="main" sx={{ 
                flexGrow: 1, 
                padding: 1, 
                marginTop:7, 
                @todo 2026-03-13 - reimplement
                height:`calc(100% - ${appContext.appBarHeight}px + ${theme.spacing(0)})`,
                minHeight:`calc(100% - ${appContext.appBarHeight}px + ${theme.spacing(0)})`,
                maxHeight:`calc(100% - ${appContext.appBarHeight}px + ${theme.spacing(0)})`,
                width:`calc(100% - ${props.leftDrawerWidth}px)`,
            }} >
                {props.children 
                    ? props.children
                    : (toBool(firstValid([props?.outlet?.active,true])) !== false 
                        ? <Outlet /*context={[setTopBarTitle]}*/ />
                        : null
                    )
                }
            </Box>            
        </Box>
    );    
}


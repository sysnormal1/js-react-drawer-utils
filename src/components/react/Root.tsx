import { useEffect, useReducer, useRef } from "react";
import $ from "jquery";
import { Box, CssBaseline, useMediaQuery, useTheme } from "@mui/material";
import { firstValid, hasValue, toBool } from '@aalencarv/common-utils';
import { mountDrawerMenuItem } from "../../DrawerHelper.js";
import React from "react";
import { Outlet } from "react-router";
import TopAppBar from "./TopAppBar.js";
import LeftDrawer from "./LeftDrawer.js";


function initialStates(props?: any) {
    return {
        loading: false,
        loaded: false,
        menuData: props?.menuData || [],
        menuItems: null,
        appBar:{
          active: firstValid([props.appBar?.active, true]),
          height: 50,
        },
        leftDrawer:{
          active: firstValid([props.leftDrawer?.active, true]),
          width: 240,
          collapsed: false
        },
        outlet: {
          active: firstValid([props.outlet?.active, true]),
        }
    };
};

/**
 * reducer setter state
 * @param {*} state 
 * @param {*} action 
 * @returns 
 */
function reducer(state?: any, action?: any) {
    switch (action.type) {
        case 'SET_DATA':
            return { ...state, ...action.payload};
        default:
            return state;
    }
}



export default function Root(props?: any){
    const theme = useTheme();
    const leftDrawerRef = useRef(null);
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm')); // Ajuste o breakpoint conforme necessário.
    const [state, dispatch] = useReducer(reducer, initialStates(props));


    console.log('xxxxxxxxxxxx nx',hasValue(leftDrawerRef?.current));


    function adjustWidth(event?: any) { 
      let timeAnimation = (theme?.transitions?.duration?.enteringScreen || 300)+50; 
      console.log('xxxxxxxxxxxx n1', event.target);
      //setTimeout(()=>{
        console.log('xxxxxxxxxxxx n2');
        if (hasValue(leftDrawerRef?.current)) {  
          console.log('xxxxxxxxxxxx n3');
          const drawerElement: any = leftDrawerRef.current;
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
          console.log('xxxxxxxxxxxx n3',maiorSoma);
          dispatch({
            type: 'SET_DATA',
            payload:{
              leftDrawer: {
                ...state.leftDrawer,
                width: maiorSoma
              }
            }
          });

        }
      //},timeAnimation)
    };

    function handleMenuItemClick(event?: any) {
      if (isSmallScreen) {
        let link = $(event.target).closest("a[href]");
        if (link.length) {
          dispatch({
            type: 'SET_DATA',
            payload:{
              leftDrawer: {
                ...state.leftDrawer,
                collapsed: true
              }
            }
          });
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
        dispatch({
            type: 'SET_DATA',
            payload:{
              leftDrawer: {
                ...state.leftDrawer,
                collapsed: collapsed
              }
            }
          });
    }
     

    return <Box sx={{display: 'flex'}}>
      <CssBaseline />        
      {state.appBar.active && <TopAppBar 
        hasLeftDrawer={state.leftDrawer.active}
        leftDrawerCollapsed={state.leftDrawer.collapsed}
        setLeftDrawerCollapsed={state.leftDrawer.active ? handleCollapse : false} 
        leftDrawerWidth={state.leftDrawer.width}                
      />}
      {state.leftDrawer.active && <LeftDrawer 
        ref={leftDrawerRef}
        collapsed={state.leftDrawer.collapsed}
        setCollapsed={handleCollapse} 
        width={state.leftDrawer.width}
        items={state.menuItems || []}                
      />}
      <Box component="main" sx={{ 
        flexGrow: 1, 
        padding: 1, 
        marginTop:7, 
        height:`calc(100% - ${state.appBar.height}px + ${theme.spacing(0)})`,
        minHeight:`calc(100% - ${state.appBar.height}px + ${theme.spacing(0)})`,
        maxHeight:`calc(100% - ${state.appBar.height}px + ${theme.spacing(0)})`,
        width:`calc(100% - ${state.leftDrawer.width}px)`,
      }} >
        {props.children 
          ? props.children
          : state.outlet.active
            ? <Outlet /*context={[setTopBarTitle]}*/ />
            : null          
        }
      </Box>            
    </Box>
    
}
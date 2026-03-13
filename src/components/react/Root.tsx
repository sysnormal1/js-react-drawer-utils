import { useContext, useEffect, useReducer, useState } from "react";
import $ from "jquery";
import { useMediaQuery, useTheme } from "@mui/material";
import { hasValue } from '@aalencarv/common-utils';
import RootLayout from "./RootLayout.js";
import { mountDrawerMenuItem } from "../../DrawerHelper.js";
import React from "react";


function initialStates(props?: any) {
    return {
        loading: false,
        loaded: false,
        menuData: props?.menuData || [],
        menuItems: null
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
    //const appContext = useContext(AppContext);    
    //const themeContext = useContext(ThemeContext);
    const [leftDrawerWidth,setLeftDrawerWidth] = useState(240);
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm')); // Ajuste o breakpoint conforme necessário.
    const [state, dispatch] = useReducer(reducer, initialStates(props));


    function adjustWidth() { 
      let timeAnimation = (theme?.transitions?.duration?.enteringScreen || 300)+50; 
      /*
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
      },timeAnimation)*/
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

     
    return <RootLayout       
      menuItems={state.menuItems}
      leftDrawerWidth={leftDrawerWidth}
      translater={props.translater}
    >
    </RootLayout>;
    
}
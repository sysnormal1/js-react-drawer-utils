import { useEffect, useReducer, useRef } from "react";
import $ from "jquery";
import { Box, CssBaseline, useMediaQuery, useTheme } from "@mui/material";
import { firstValid, hasValue, toBool } from '@aalencarv/common-utils';
import { mountDrawerMenuItem } from "../../DrawerHelper.js";
import React from "react";
import { Outlet } from "react-router";
import TopAppBar from "./TopAppBar.js";
import LeftDrawer from "./LeftDrawer.js";


/**
 * Initializes the internal state of the Root layout component.
 *
 * @remarks
 * This function merges default layout values with the properties
 * provided to the component.
 *
 * It defines configuration for:
 *
 * - application bar
 * - navigation drawer
 * - outlet rendering
 * - menu data
 *
 * @param props Optional component properties.
 *
 * @returns Initial reducer state.
 */
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
 * Internal reducer used to update the layout state.
 *
 * @param state Current state.
 * @param action Reducer action.
 *
 * @returns Updated state.
 */
function reducer(state?: any, action?: any) {
    switch (action.type) {
        case 'SET_DATA':
            return { ...state, ...action.payload};
        default:
            return state;
    }
}


/**
 * Root layout component used to render the main application structure.
 *
 * @remarks
 * This component provides the base UI layout for applications using
 * the SSO integration library.
 *
 * It is responsible for rendering:
 *
 * - the application top bar ({@link TopAppBar})
 * - the navigation drawer ({@link LeftDrawer})
 * - the main application content area
 *
 * The navigation menu is dynamically generated from resource
 * permission data using {@link mountDrawerMenuItem}.
 *
 * The component also handles:
 *
 * - responsive drawer behavior on small screens
 * - automatic drawer width adjustment
 * - persistence of drawer collapsed state
 *
 * When no `children` are provided, the component renders
 * the React Router {@link Outlet}.
 *
 * @param props Root component properties.
 *
 * @example
 * ```tsx
 * <Root
 *   menuData={resources}
 *   parser={parseIcon}
 *   translater={t}
 * />
 * ```
 */
export default function Root(props?: any){

    const theme = useTheme();

    const leftDrawerRef = useRef(null);

    const isSmallScreen =
        useMediaQuery(theme.breakpoints.down('sm'));

    const [state, dispatch] =
        useReducer(reducer, initialStates(props));


    /**
     * Adjusts the drawer width based on visible menu items.
     *
     * @remarks
     * This method calculates the maximum width required
     * to display nested menu items without clipping.
     */
    function adjustWidth(event?: any) {

      if (hasValue(leftDrawerRef?.current)) {

        const drawerElement: any = leftDrawerRef.current;

        let subs =
            drawerElement.querySelectorAll(
                ":not(.MuiCollapse-hidden) .MuiCollapse-entered>.MuiCollapse-wrapper>.MuiCollapse-wrapperInner>.MuiList-root>.MuiListItemButton-root"
            );

        subs = Array.from(subs).filter((el: any) => {

          const style = window.getComputedStyle(el);

          return (
              style.display !== "none" &&
              style.visibility !== "hidden" &&
              style.opacity !== "0"
          );
        });

        let maiorSoma = 0;

        subs.forEach((el: any)=>{

          const rect = el.getBoundingClientRect();

          const computedStyle = window.getComputedStyle(el);

          const marginLeft =
              parseFloat(computedStyle.marginLeft) || 0;

          const marginRight =
              parseFloat(computedStyle.marginRight) || 0;

          let somaAtual =
              rect.left + rect.width + marginLeft + marginRight;

          if (somaAtual > maiorSoma) {
            maiorSoma = somaAtual;
          }
        });

        if (maiorSoma < 240)
            maiorSoma = 240
        else
            maiorSoma += 16;

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
    };


    /**
     * Handles menu item click events.
     *
     * @remarks
     * On small screens the drawer will automatically collapse
     * after a navigation link is clicked.
     */
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


    /**
     * Builds drawer menu items from the provided resource data.
     *
     * @param menuData Resource permission tree.
     */
    function mountMenuItems(menuData?: any[]) : void {

      try {

        let agentMenu : any = [];

        if (hasValue(menuData)) {

          for(let key in menuData || []) {

            agentMenu.push(
                mountDrawerMenuItem({
                    menuItem: menuData[key],
                    currentViewRoute: "",
                    listItemProps: {
                        onEntered:adjustWidth,
                        onExited:adjustWidth,
                        onClick:handleMenuItemClick,
                        parser: props.parser,
                        translater: props.translater
                    }
                })
            );
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


    /**
     * Updates menu items whenever the menu data changes.
     */
    useEffect(()=>{
      mountMenuItems(state.menuData);
    }, [state.menuData])


    /**
     * Handles drawer collapse state changes.
     *
     * @param collapsed New collapsed state.
     */
    function handleCollapse(collapsed: boolean) : void {

        localStorage?.setItem(
            'leftDrawerCollapsed',
            collapsed ? "true" : "false"
        );

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

      {state.appBar.active &&

        <TopAppBar
            hasLeftDrawer={state.leftDrawer.active}
            leftDrawerCollapsed={state.leftDrawer.collapsed}
            setLeftDrawerCollapsed={
                state.leftDrawer.active
                    ? handleCollapse
                    : false
            }
            leftDrawerWidth={state.leftDrawer.width}
        />
      }

      {state.leftDrawer.active &&

        <LeftDrawer
            ref={leftDrawerRef}
            collapsed={state.leftDrawer.collapsed}
            setCollapsed={handleCollapse}
            width={state.leftDrawer.width}
            items={state.menuItems || []}
        />
      }

      <Box
        component="main"
        sx={{
            flexGrow: 1,
            padding: 1,
            marginTop:7,
            height:`calc(100% - ${state.appBar.height}px + ${theme.spacing(0)})`,
            minHeight:`calc(100% - ${state.appBar.height}px + ${theme.spacing(0)})`,
            maxHeight:`calc(100% - ${state.appBar.height}px + ${theme.spacing(0)})`,
            width:`calc(100% - ${state.leftDrawer.width}px)`,
        }}
      >

        {props.children
          ? props.children
          : state.outlet.active
            ? <Outlet />
            : null
        }

      </Box>

    </Box>
}

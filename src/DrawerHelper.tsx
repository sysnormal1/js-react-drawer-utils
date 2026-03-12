import { firstValid, hasValue, toBool } from "@aalencarv/common-utils";
import ListItemWithSub, { ListItemWithSubProps } from "./components/react/ListItemWithSub.js";
import React, { ReactNode } from "react";
import { List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import _ from "lodash";
import { ConfigParams, getConfigs } from "./Config.js";
import { Link } from "react-router";
import DefaultScreen from "./components/react/DefaultScreen.js";
import { Translater } from "./components/react/ViewsHelper.js";
import { AuthorizationParams, ResourcePermissionData } from "@sysnormal/sso-js-integrations";
import { RouteObject } from "react-router";


export function mountDrawerMenuItem(
    menuItem: ResourcePermissionData,
    currentViewRoute?: string,
    params?: ListItemWithSubProps
) : ReactNode | null | undefined {
    let result: ReactNode | null | undefined = null;
    try {
        const configs: ConfigParams = getConfigs();
        const text: string = _.capitalize(typeof params?.translater === "function" ? params.translater(menuItem.resourceName.toLowerCase()) : menuItem.resourceName);
        const icon: any = typeof params?.parser === "function" ? params.parser(menuItem.resourceIcon) : menuItem.resourceIcon;
        if (hasValue(menuItem?.children)) {
            let children: any[] = [];
            
            for(let key in menuItem.children) {
                if (toBool(firstValid([menuItem.children[key].resourceShowInMenu,true])))
                    children.push(menuItem.children[key]);
            } 

            children.sort((a,b)=>(a.resourceNumericOrder || a.resourceId) - (b.resourceNumericOrder || b.resourceId));
            for(let key in children) {
                children[key] = mountDrawerMenuItem(children[key],currentViewRoute + "/"+ children[key].resourceName.trim().toLowerCase(),params)
            }


            let linkProps : any = undefined;
            if (menuItem.resourceTypeId == configs.ssoResourcetypeScreenId) {
                let showChildrenAsPopup = toBool(firstValid([localStorage?.getItem('showChildrenAsPopup'),configs.showResourceAsPopup]));
                linkProps = {
                    to:menuItem.resourcePath || (currentViewRoute + "/" + menuItem.resourceName.trim().toLowerCase().replace(/\s/g,'_')),
                };
                if (showChildrenAsPopup || menuItem?.target) {
                    linkProps.target = menuItem?.target || "_blank";
                    linkProps.rel = "noopener noreferrer";
                }
            }

            result = <ListItemWithSub 
                {...params}
                key={`${menuItem.resourceParentId || menuItem.resourceId}-${menuItem.resourceId}`}
                text={text} 
                icon={icon}
                component={menuItem.resourceTypeId == configs.ssoResourcetypeScreenId?Link:undefined}
                linkProps={linkProps}
            >  
                <List disablePadding={true} sx={{marginLeft:1}}>                    
                    {children}
                </List>
            </ListItemWithSub>
        } else {
            if (toBool(firstValid([menuItem.resourceShowInMenu,true]))) {        
            let linkProps : any = {
                to:menuItem.resourcePath || menuItem.resourcePath || (currentViewRoute + "/" + menuItem.resourceName.trim().toLowerCase().replace(/\s/g,'_')),
            };
            let showChildrenAsPopup = toBool(firstValid([localStorage?.getItem('showChildrenAsPopup'),configs.showResourceAsPopup]));
            if (showChildrenAsPopup || menuItem?.target) {
                linkProps.target = menuItem?.target || "_blank";
                linkProps.rel = "noopener noreferrer";
            }
            result = <ListItemButton
                key={`${menuItem.resourceParentId || menuItem.resourceId}-${menuItem.resourceId}`}
                {...linkProps}
                component={Link} 
                title={text}          
                sx={{
                    minWidth:1,
                    width:'fit-content !important'
                }}
                onClick={params?.onClick}
                >
                <ListItemIcon>
                    {icon} 
                </ListItemIcon>
                <ListItemText primary={text} />
                </ListItemButton>;
            }
        }
    } catch (e) {
      console.error(e);
    }
    return result;
}



export function mountBrowserRouterItem(
    menuItem: ResourcePermissionData,
    mappedResources: {[key:string]:{
        getElement: () => ReactNode
    }},
    currentBrowserObject: RouteObject[], 
    authContextGetter?: () => AuthorizationParams,
    translater?: Translater
) : void {
    try {
      if (hasValue(menuItem.resourcePath)) {
        if (mappedResources[menuItem.resourcePath]) {          
          let routine: RouteObject = {
            path:menuItem.resourcePath,
            //element: 
            element: <DefaultScreen 
              key={menuItem.resourcePath} //to force re-render component to reset states when change resourcePath, that correponts to location.pathname
              topBarTitle={menuItem.resourceName}
              authContextGetter={authContextGetter}
              translater={translater}
            >
              {mappedResources[menuItem.resourcePath].getElement()}
            </DefaultScreen>
          } 
          currentBrowserObject.push(routine);
        }
      }
      if (hasValue(menuItem?.children)) {        
        for(let key in (menuItem?.children || [])) {
          mountBrowserRouterItem(menuItem.children[key], mappedResources, currentBrowserObject, authContextGetter);
        } 
      } 
    } catch (e) {
      console.error(e);
    }
  }


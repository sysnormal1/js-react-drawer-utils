import { firstValid, hasValue, toBool } from "@aalencarv/common-utils";
import ListItemWithSub, { ListItemWithSubProps } from "./components/react/ListItemWithSub.js";
import React, { ReactNode } from "react";
import { Box, List, ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material";
import _ from "lodash";
import { ConfigParams, getConfigs } from "./Config.js";
import { Link } from "react-router";
import DefaultScreen from "./components/react/DefaultScreen.js";
import { Translater } from "./components/react/ViewsHelper.js";
import { AuthorizationParams, getAgentAllowedResources, ResourcePermissionData } from "@sysnormal/sso-js-integrations";
import { RouteObject } from "react-router";
import Root from "./components/react/Root.js";
import ErrorPage from "./components/react/ErrorPage.js";


export function mountDrawerMenuItem(
    params: {
        menuItem: ResourcePermissionData,
        currentViewRoute?: string,
        listItemProps?: ListItemWithSubProps
    }
) : ReactNode | null | undefined {
    let result: ReactNode | null | undefined = null;
    try {
        const configs: ConfigParams = getConfigs();
        const text: string = _.capitalize(typeof params.listItemProps?.translater === "function" ? params.listItemProps.translater(params.menuItem.resourceName.toLowerCase()) : params.menuItem.resourceName);
        const icon: any = typeof params.listItemProps?.parser === "function" ? params.listItemProps.parser(params.menuItem.resourceIcon) : params.menuItem.resourceIcon;
        if (hasValue(params.menuItem?.children)) {
            let children: any[] = [];
            
            for(let key in params.menuItem.children) {
                if (toBool(firstValid([params.menuItem.children[key].resourceShowInMenu,true])))
                    children.push(params.menuItem.children[key]);
            } 

            children.sort((a,b)=>(a.resourceNumericOrder || a.resourceId) - (b.resourceNumericOrder || b.resourceId));
            for(let key in children) {
                children[key] = mountDrawerMenuItem({
                    ...params,
                    menuItem: children[key],
                    currentViewRoute: params.currentViewRoute + "/"+ children[key].resourceName.trim().toLowerCase()
                })
            }


            let linkProps : any = undefined;
            if (params.menuItem.resourceTypeId == configs.ssoResourcetypeScreenId) {
                let showChildrenAsPopup = toBool(firstValid([localStorage?.getItem('showChildrenAsPopup'),configs.showResourceAsPopup]));
                linkProps = {
                    to:params.menuItem.resourcePath || (params.currentViewRoute + "/" + params.menuItem.resourceName.trim().toLowerCase().replace(/\s/g,'_')),
                };
                if (showChildrenAsPopup || params.menuItem?.target) {
                    linkProps.target = params.menuItem?.target || "_blank";
                    linkProps.rel = "noopener noreferrer";
                }
            }

            result = <ListItemWithSub 
                {...params.listItemProps}
                key={`${params.menuItem.resourceParentId || params.menuItem.resourceId}-${params.menuItem.resourceId}`}
                text={text} 
                icon={icon}
                component={params.menuItem.resourceTypeId == configs.ssoResourcetypeScreenId?Link:undefined}
                linkProps={linkProps}
            >  
                <List disablePadding={true} sx={{marginLeft:1}}>                    
                    {children}
                </List>
            </ListItemWithSub>
        } else {
            if (toBool(firstValid([params.menuItem.resourceShowInMenu,true]))) {        
            let linkProps : any = {
                to:params.menuItem.resourcePath || params.menuItem.resourcePath || (params.currentViewRoute + "/" + params.menuItem.resourceName.trim().toLowerCase().replace(/\s/g,'_')),
            };
            let showChildrenAsPopup = toBool(firstValid([localStorage?.getItem('showChildrenAsPopup'),configs.showResourceAsPopup]));
            if (showChildrenAsPopup || params.menuItem?.target) {
                linkProps.target = params.menuItem?.target || "_blank";
                linkProps.rel = "noopener noreferrer";
            }
            result = <ListItemButton
                key={`${params.menuItem.resourceParentId || params.menuItem.resourceId}-${params.menuItem.resourceId}`}
                {...linkProps}
                component={Link} 
                title={text}          
                sx={{
                    minWidth:1,
                    width:'fit-content !important'
                }}
                onClick={params.listItemProps?.onClick}
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
    params: {
        menuItem: ResourcePermissionData;
        mappedResources: {[key:string]:{
            getElement: () => ReactNode
        }};
        currentBrowserObject: RouteObject[];
        authContextGetter?: () => AuthorizationParams;
        translater?: Translater;
    }
) : void {
    try {
      if (hasValue(params.menuItem.resourcePath)) {
        if (params.mappedResources[params.menuItem.resourcePath]) {          
          let routine: RouteObject = {
            path:params.menuItem.resourcePath,
            //element: 
            element: <DefaultScreen 
              key={params.menuItem.resourcePath} //to force re-render component to reset states when change resourcePath, that correponts to location.pathname
              topBarTitle={params.menuItem.resourceName}
              authContextGetter={params.authContextGetter}
              translater={params.translater}
            >
              {params.mappedResources[params.menuItem.resourcePath].getElement()}
            </DefaultScreen>
          } 
          params.currentBrowserObject.push(routine);
        }
      }
      if (hasValue(params.menuItem.children)) {        
        for(let key in (params.menuItem.children || [])) {
            mountBrowserRouterItem({
                ...params,
                menuItem: params.menuItem.children[key]
            });
        } 
      } 
    } catch (e) {
      console.error(e);
    }
}

export async function mountBrowserRouterObject(
    params: {
        mappedResources: {[key:string]:{
            getElement: () => ReactNode
        }};
        authContextGetter?: ()=>AuthorizationParams;
        translater?: Translater;
        parser?: (...others: any)=>any;
        msgNotHasPermissions?: string;
    }
): Promise<RouteObject[]>{    
    let result : RouteObject[] = [];    
    try {
        const configs = getConfigs();
        let agentAllowedResources = await getAgentAllowedResources({authContextGetter: params.authContextGetter});
        result = [{
            path: "/",
            element: <Root menuData={agentAllowedResources?.data || []} parser={params.parser} translater={params.translater}/>
        },{
            path: "/online",
            element:"ok"
        }];

        let others : RouteObject[] = [];
        
        if (agentAllowedResources?.success) {
            if (hasValue(agentAllowedResources.data)) {
                for(let key in agentAllowedResources.data) {
                    mountBrowserRouterItem({
                        ...params,
                        menuItem: agentAllowedResources.data[key], 
                        currentBrowserObject: others
                    });
                }
            } else {
                others.push({
                    path: '/',
                    element: <Box sx={{
                        height: 1,
                        width: 1,
                        textAlign: 'center',
                        alignContent: 'center'
                    }}>
                        <Typography variant="h4" color="error">
                            {typeof params.translater === "function" ? params.translater(params.msgNotHasPermissions||'') : params.msgNotHasPermissions}
                        </Typography>
                    </Box>
                })
            }
        }   
        
        others.push({
            path:"*",
            element: <ErrorPage showAsPopup={configs.showResourceAsPopup}/>
        })

        if (!configs.showResourceAsPopup) {
            result[0].children = others;
        } else {
            others.unshift(result[0]);
            result = others;
        }
    } catch (e) {
        console.error(e);
    }
    return result;
}


export function openAll(elements?: any) {
    try {
      for(let k in elements) {
        if (elements[k].tagName === 'BUTTON' && (
            !elements[k].nextSibling || (
              elements[k].nextSibling && elements[k].nextSibling.tagName === 'DIV' && elements[k].nextSibling.classList.contains('MuiCollapse-hidden')
            )
        )) {
          elements[k].click();
        }
      }
      for(let k in elements) { 
        if (elements[k].tagName === 'BUTTON' && (
            elements[k].nextSibling && elements[k].nextSibling.tagName === 'DIV'            
        )) {
          openAll(elements[k].nextSibling.children[0].children[0].children[0].children);
        }
      }
    } catch (e) {
      console.error(e);
    }
}

export function filterMenu(event?: any) {
    try {
      let ul = event.target.parentNode.parentNode.parentNode.nextSibling.nextSibling;
      let children = ul.children;
      openAll(children);
      let val = event.target.value.trim().toLowerCase();
      let as = $(ul).find('a.MuiListItemButton-root');        
      let toShow = [];
      let toHidden = [];
      for(let i = 0; i < as.length; i++) {
        if (val.length === 0 || as.eq(i).find("span.MuiListItemText-primary:first").text().toLowerCase().indexOf(val) > -1) {
          toShow.push(as.eq(i));
        } else {
          toHidden.push(as.eq(i));
        }
      }    
      let parentUl = null;
      let parentButton = null;
      for(let i = 0; i < toHidden.length; i++) {
        toHidden[i].hide();            
        parentUl = toHidden[i].closest("ul");            
        if (parentUl.children("div.MuiCollapse-root").length === 0) {
          parentButton = toHidden[i].closest("div.MuiCollapse-root").prev("button.MuiListItemButton-root");
          while(parentButton.length && parentUl.length && parentUl.children("a.MuiListItemButton-root:visible").length === 0) {
            parentButton.hide();
            parentUl = parentButton.closest("ul");
            parentButton = parentUl.closest("div.MuiCollapse-root").prev("button.MuiListItemButton-root");
          }
        }
      }

      for(let i = 0; i < toShow.length; i++) {          
        toShow[i].show();          
        parentButton = toShow[i].closest("div.MuiCollapse-root").prev("button.MuiListItemButton-root");
        while(parentButton.length) {
          parentButton.show();
          parentButton = parentButton.closest("div.MuiCollapse-root").prev("button.MuiListItemButton-root");
        }
      }
    } catch(e) {
      console.error(e);
    }
}  
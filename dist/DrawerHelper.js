import { firstValid, hasValue, toBool } from "@aalencarv/common-utils";
import ListItemWithSub from "./components/react/ListItemWithSub.js";
import React from "react";
import { List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import _ from "lodash";
import { getConfigs } from "./Config.js";
import { Link } from "react-router";
import DefaultScreen from "./components/react/DefaultScreen.js";
export function mountDrawerMenuItem(menuItem, currentViewRoute, params) {
    let result = null;
    try {
        const configs = getConfigs();
        const text = _.capitalize(typeof params?.translater === "function" ? params.translater(menuItem.resourceName.toLowerCase()) : menuItem.resourceName);
        const icon = typeof params?.parser === "function" ? params.parser(menuItem.resourceIcon) : menuItem.resourceIcon;
        if (hasValue(menuItem?.children)) {
            let children = [];
            for (let key in menuItem.children) {
                if (toBool(firstValid([menuItem.children[key].resourceShowInMenu, true])))
                    children.push(menuItem.children[key]);
            }
            children.sort((a, b) => (a.resourceNumericOrder || a.resourceId) - (b.resourceNumericOrder || b.resourceId));
            for (let key in children) {
                children[key] = mountDrawerMenuItem(children[key], currentViewRoute + "/" + children[key].resourceName.trim().toLowerCase(), params);
            }
            let linkProps = undefined;
            if (menuItem.resourceTypeId == configs.ssoResourcetypeScreenId) {
                let showChildrenAsPopup = toBool(firstValid([localStorage?.getItem('showChildrenAsPopup'), configs.showResourceAsPopup]));
                linkProps = {
                    to: menuItem.resourcePath || (currentViewRoute + "/" + menuItem.resourceName.trim().toLowerCase().replace(/\s/g, '_')),
                };
                if (showChildrenAsPopup || menuItem?.target) {
                    linkProps.target = menuItem?.target || "_blank";
                    linkProps.rel = "noopener noreferrer";
                }
            }
            result = React.createElement(ListItemWithSub, { ...params, key: `${menuItem.resourceParentId || menuItem.resourceId}-${menuItem.resourceId}`, text: text, icon: icon, component: menuItem.resourceTypeId == configs.ssoResourcetypeScreenId ? Link : undefined, linkProps: linkProps },
                React.createElement(List, { disablePadding: true, sx: { marginLeft: 1 } }, children));
        }
        else {
            if (toBool(firstValid([menuItem.resourceShowInMenu, true]))) {
                let linkProps = {
                    to: menuItem.resourcePath || menuItem.resourcePath || (currentViewRoute + "/" + menuItem.resourceName.trim().toLowerCase().replace(/\s/g, '_')),
                };
                let showChildrenAsPopup = toBool(firstValid([localStorage?.getItem('showChildrenAsPopup'), configs.showResourceAsPopup]));
                if (showChildrenAsPopup || menuItem?.target) {
                    linkProps.target = menuItem?.target || "_blank";
                    linkProps.rel = "noopener noreferrer";
                }
                result = React.createElement(ListItemButton, { key: `${menuItem.resourceParentId || menuItem.resourceId}-${menuItem.resourceId}`, ...linkProps, component: Link, title: text, sx: {
                        minWidth: 1,
                        width: 'fit-content !important'
                    }, onClick: params?.onClick },
                    React.createElement(ListItemIcon, null, icon),
                    React.createElement(ListItemText, { primary: text }));
            }
        }
    }
    catch (e) {
        console.error(e);
    }
    return result;
}
export function mountBrowserRouterItem(menuItem, mappedResources, currentBrowserObject, authContextGetter, translater) {
    try {
        if (hasValue(menuItem.resourcePath)) {
            if (mappedResources[menuItem.resourcePath]) {
                let routine = {
                    path: menuItem.resourcePath,
                    //element: 
                    element: React.createElement(DefaultScreen, { key: menuItem.resourcePath, topBarTitle: menuItem.resourceName, authContextGetter: authContextGetter, translater: translater }, mappedResources[menuItem.resourcePath].getElement())
                };
                currentBrowserObject.push(routine);
            }
        }
        if (hasValue(menuItem?.children)) {
            for (let key in (menuItem?.children || [])) {
                mountBrowserRouterItem(menuItem.children[key], mappedResources, currentBrowserObject, authContextGetter);
            }
        }
    }
    catch (e) {
        console.error(e);
    }
}

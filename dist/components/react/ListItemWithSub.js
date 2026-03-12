import { Collapse, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { useState } from "react";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import React from "react";
export default function ListItemWithSub(props) {
    const [opened, setOpened] = useState(props.initialOpened || false);
    function handleOpen(event) {
        /*if (!opened) {
            setTimeout(()=>{
                $(".MuiDrawer-root").attr("theme", props.theme || '');
                $(".MuiDrawer-root").parent().attr("theme", props.theme || '');
                $(".MuiDrawer-root").find("path").attr("fill", props?.theme === 'dark' ? "white" : "black");
              },50);
        }*/
        setOpened(!opened);
        if (typeof props.onClick == 'function') {
            props.onClick(event);
        }
    }
    return React.createElement("div", null,
        React.createElement(ListItemButton, { onClick: handleOpen, component: props.component, title: props.text, ...props.linkProps, sx: {
                width: 'fit-content !important'
            } },
            React.createElement(ListItemIcon, null, props.icon),
            React.createElement(ListItemText, null, props.text),
            opened ? React.createElement(ExpandLess, null) : React.createElement(ExpandMore, null)),
        React.createElement(Collapse, { in: opened, sx: { marginLeft: '2em' }, onEntered: props.onEntered, onExited: props.onExited }, props.children));
}

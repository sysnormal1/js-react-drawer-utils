import { Collapse, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { useState } from "react";
import $ from 'jquery';
import { DrawRounded, ExpandLess, ExpandMore } from "@mui/icons-material";
import React from "react";
import { Translater } from "./ViewsHelper.js";

export type ListItemWithSubProps = {
    text?: string;
    icon?: any
    initialOpened?: boolean;
    theme?: string | null | undefined;
    onClick?: any;
    component?: any;    
    linkProps?: any;
    onEntered?: any;
    onExited?: any;
    children?: any;
    translater?: Translater;
    parser?: any;
}
export default function ListItemWithSub(props: ListItemWithSubProps) {
    const [opened,setOpened] = useState(props.initialOpened || false);

    function handleOpen(event?: any){
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

    return <div>
        <ListItemButton
            onClick={handleOpen}
            component={props.component}
            title={props.text}
            {...props.linkProps}
            sx={{
                width:'fit-content !important'
            }}
        >
            <ListItemIcon>
                {props.icon}
            </ListItemIcon>
            <ListItemText> 
                {props.text}
            </ListItemText>
            {opened ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse 
            in={opened} 
            sx={{marginLeft:'2em'}} 
            onEntered={props.onEntered}
            onExited={props.onExited}                
        >
            {props.children}
        </Collapse>
    </div>    
}
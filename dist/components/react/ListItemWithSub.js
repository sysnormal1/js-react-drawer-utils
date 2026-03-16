import { Collapse, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { useState } from "react";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import React from "react";
/**
 * Expandable list item component used to render hierarchical menus.
 *
 * @remarks
 * This component is designed to simplify the creation of nested
 * navigation structures, such as sidebar menus.
 *
 * It displays a clickable list item that toggles a collapsible
 * container containing its children.
 *
 * Internally it manages its open/closed state using React state,
 * initialized through the `initialOpened` property.
 *
 * The component is compatible with routing libraries by allowing
 * a custom `component` and `linkProps` to be provided.
 *
 * @param props Component configuration properties.
 *
 * @example
 * ```tsx
 * <ListItemWithSub
 *   text="Users"
 *   icon={<PeopleIcon />}
 *   initialOpened={true}
 * >
 *   <ListItemButton component={Link} to="/users/list">
 *      Users List
 *   </ListItemButton>
 * </ListItemWithSub>
 * ```
 */
export default function ListItemWithSub(props) {
    const [opened, setOpened] = useState(props.initialOpened || false);
    function handleOpen(event) {
        setOpened(!opened);
        if (typeof props.onClick == 'function') {
            props.onClick(event);
        }
    }
    return (React.createElement("div", null,
        React.createElement(ListItemButton, { onClick: handleOpen, component: props.component, title: props.text, ...props.linkProps, sx: {
                width: 'fit-content !important'
            } },
            React.createElement(ListItemIcon, null, props.icon),
            React.createElement(ListItemText, null, props.text),
            opened ? React.createElement(ExpandLess, null) : React.createElement(ExpandMore, null)),
        React.createElement(Collapse, { in: opened, sx: { marginLeft: '2em' }, onEntered: props.onEntered, onExited: props.onExited }, props.children)));
}

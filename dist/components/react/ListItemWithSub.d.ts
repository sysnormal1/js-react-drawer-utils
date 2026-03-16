import React from "react";
import { Translater } from "./ViewsHelper.js";
/**
 * Properties used by {@link ListItemWithSub}.
 *
 * @remarks
 * This component represents a list item that can expand to reveal
 * nested content. It is commonly used to build hierarchical
 * navigation menus such as sidebars or drawers.
 *
 * The component internally manages its open/closed state but allows
 * external hooks through callbacks.
 */
export type ListItemWithSubProps = {
    /**
     * Text displayed in the list item.
     */
    text?: string;
    /**
     * Icon displayed at the start of the list item.
     */
    icon?: any;
    /**
     * Determines whether the item should be initially expanded.
     */
    initialOpened?: boolean;
    /**
     * Optional theme identifier used to customize rendering.
     */
    theme?: string | null | undefined;
    /**
     * Callback executed when the list item is clicked.
     *
     * This is triggered after the internal expand/collapse state changes.
     */
    onClick?: any;
    /**
     * Optional component used to render the list item container.
     *
     * This is typically used to integrate with routing libraries
     * such as React Router.
     */
    component?: any;
    /**
     * Additional properties forwarded to the link or routing component.
     */
    linkProps?: any;
    /**
     * Callback triggered when the expand animation completes.
     */
    onEntered?: any;
    /**
     * Callback triggered when the collapse animation completes.
     */
    onExited?: any;
    /**
     * Nested content rendered when the item is expanded.
     *
     * Usually contains additional list items representing
     * child navigation entries.
     */
    children?: any;
    /**
     * Optional translation helper used to resolve localized text.
     */
    translater?: Translater;
    /**
     * Optional parser used to transform the provided data
     * before rendering.
     */
    parser?: any;
};
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
export default function ListItemWithSub(props: ListItemWithSubProps): React.JSX.Element;

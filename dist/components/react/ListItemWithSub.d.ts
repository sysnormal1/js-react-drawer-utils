import React from "react";
import { Translater } from "./ViewsHelper.js";
export type ListItemWithSubProps = {
    text?: string;
    icon?: any;
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
};
export default function ListItemWithSub(props: ListItemWithSubProps): React.JSX.Element;

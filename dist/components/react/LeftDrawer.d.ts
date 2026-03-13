import { DrawerProps as MuiDrawerProps } from "@mui/material";
import React, { ReactNode } from "react";
export interface LeftDrawerProps extends Omit<MuiDrawerProps, "open"> {
    collapsed?: boolean;
    width?: number | string;
    items?: ReactNode;
    translater?: (key: string) => string;
    searchText?: string;
    setCollapsed?: (value: boolean) => void;
}
declare const LeftDrawer: React.ForwardRefExoticComponent<Omit<LeftDrawerProps, "ref"> & React.RefAttributes<HTMLDivElement>>;
export default LeftDrawer;

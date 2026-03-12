import { DefaultResourceProps, Translater } from "./ViewsHelper.js";
import React from "react";
import { AuthorizationParams } from "@sysnormal/sso-js-integrations";
export type DefaultScreenProps = React.ComponentProps<"div"> & DefaultResourceProps & {
    topBarTitle?: string;
    translater?: Translater;
    authContextGetter?: () => AuthorizationParams;
};
export default function DefaultScreen(props: DefaultScreenProps): string | number | bigint | boolean | React.JSX.Element | Iterable<React.ReactNode> | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined;

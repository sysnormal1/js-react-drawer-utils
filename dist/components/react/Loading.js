import { hasValue } from "@aalencarv/common-utils";
import { Box, CircularProgress, Typography } from "@mui/material";
import _ from "lodash";
import React from "react";
export function Loading(props) {
    let text = "loading permissions";
    if (hasValue(props?.translater)) {
        text = props.translater(text);
    }
    text = _.capitalize(text);
    return React.createElement(Box, { sx: {
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 2
        } },
        React.createElement(CircularProgress, { size: 48 }),
        React.createElement(Typography, { variant: "body2", color: "text.secondary" }, text));
}

import { hasValue } from "@aalencarv/common-utils";
import { Box, Typography } from "@mui/material";
import _ from "lodash";
import React from "react";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
export function AccessDenied(props) {
    let text = "access denied";
    let message = "you do not have permission to view this resource";
    if (hasValue(props?.translater)) {
        text = props.translater(text);
        message = props.translater(message);
    }
    text = _.capitalize(text);
    message = _.capitalize(message);
    return React.createElement(Box, { sx: {
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
            textAlign: "center"
        } },
        React.createElement(LockOutlinedIcon, { sx: { fontSize: 48, color: "text.disabled" } }),
        React.createElement(Typography, { variant: "h6" }, text),
        React.createElement(Typography, { variant: "body2", color: "text.secondary" }, message));
}

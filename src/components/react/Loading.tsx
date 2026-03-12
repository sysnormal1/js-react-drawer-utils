import { hasValue } from "@aalencarv/common-utils";
import { Box, CircularProgress, Typography } from "@mui/material";
import _ from "lodash";
import React from "react";

export function Loading(props?: any) {
    let text = "loading permissions";
    if (hasValue(props?.translater)) {
        text = props.translater(text);
    } 
    text = _.capitalize(text);

    return <Box
      sx={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2
      }}
    >
      <CircularProgress size={48} />
      <Typography variant="body2" color="text.secondary">
        {text}
      </Typography>
    </Box>
}
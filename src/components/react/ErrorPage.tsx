import _ from "lodash";
import { useRouteError } from "react-router";
import { toBool } from '@aalencarv/common-utils';
import { Box, Typography } from "@mui/material";
import React from "react";
import Root from "./Root.js";
import { ErrorOutlineOutlined } from "@mui/icons-material";


export default function ErrorPage(props?: any) {
  let error : any = useRouteError();
  console.error(error);

  if (!error) {
    error = {
      statusText:"not found"
    }
  }

  let content = (
  <Box
    id="error-page"
    sx={{
      height: "100%",
      minHeight: "60vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      gap: 2,
      px: 2
    }}
  >
    <ErrorOutlineOutlined sx={{ fontSize: 56, color: "error.main" }} />

    <Typography variant="h4">
      {_.capitalize(props?.translater ? props?.translater("oops") : 'oops')}!
    </Typography>

    <Typography variant="body1" color="text.secondary">
      {_.capitalize(props?.translater ? ("sorry, an unexpected error has occurred"): "sorry, an unexpected error has occurred")}.
    </Typography>

    <Typography
      variant="body2"
      sx={{ fontStyle: "italic" }}
      color="text.secondary"
    >
      {props?.translater ? (error.statusText || error.message) : (error.statusText || error.message)}
    </Typography>
  </Box>
);


  return toBool(props.showAsPopup || false) !== false
      ? <Root 
          title={props.title || 'registers'}
          leftDrawer={{active:false}}
      >
          {content}
      </Root>
      : content
  ;
}
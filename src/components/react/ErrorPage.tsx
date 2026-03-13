import _ from "lodash";
import { useRouteError } from "react-router";
import { toBool } from '@aalencarv/common-utils';
import { Box, Typography } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import React from "react";
import RootLayout from "./RootLayout.js";


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
    <ErrorOutlineIcon sx={{ fontSize: 56, color: "error.main" }} />

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
      ? <RootLayout 
          title={props.title || 'registers'}
          leftDrawer={{active:false}}
      >
          {content}
      </RootLayout>
      : content
  ;
}
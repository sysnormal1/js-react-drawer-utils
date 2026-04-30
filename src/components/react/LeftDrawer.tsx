import { ChevronLeft, SearchOutlined } from "@mui/icons-material";
import {
  Divider,
  Drawer as MuiDrawer,
  DrawerProps as MuiDrawerProps,
  IconButton,
  InputBase,
  List,
  ListItem,
  ListItemIcon,
  alpha,
  styled,
  useTheme,
  useMediaQuery
} from "@mui/material";
import _ from "lodash";
import React, { ReactNode, forwardRef } from "react";
import { filterMenu } from "../../DrawerHelper.js";

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar
}));

const openedMixin = (theme: any, width?: number | string) => ({
  width,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen
  }),
  overflowX: "hidden"
});

const closedMixin = (theme: any) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`
  }
});

const StyledDrawer : any = styled(MuiDrawer, { 
  shouldForwardProp: (prop: any) => prop !== 'open' && prop !== 'width'
})(
  (params: any) => ({
    width: params.width,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    variants: [
      {
        props: ({ open }) => open,
        style: {
          ...openedMixin(params.theme),
          '& .MuiDrawer-paper': openedMixin(params.theme, params.width),
        },
      },
      {
        props: ({ open }) => !open,
        style: {
          ...closedMixin(params.theme),
          '& .MuiDrawer-paper': closedMixin(params.theme),
        },
      },
    ],
  }),
);

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25)
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto"
  }
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
}));

const SearchInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch"
      }
    }
  }
}));

export interface LeftDrawerProps extends Omit<MuiDrawerProps, "open"> {
  collapsed?: boolean;
  width?: number | string;
  items?: ReactNode;
  translater?: (key: string) => string;
  searchText?: string;
  setCollapsed?: (value: boolean) => void;
}

const LeftDrawer = forwardRef<HTMLDivElement, LeftDrawerProps>(
  (
    {
      collapsed = false,
      width = 240,
      items,
      translater,
      searchText = "search",
      setCollapsed,
      ...drawerProps
    },
    ref
  ) => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

    const text = _.capitalize(
      translater ? translater(searchText) : searchText
    );

    const contentHeader = (
      <DrawerHeader>
        <Search>
          <SearchIconWrapper>
            <SearchOutlined />
          </SearchIconWrapper>

          <SearchInputBase
            placeholder={text}
            inputProps={{
              "aria-label": text,
              onKeyUp: filterMenu
            }}
          />
        </Search>

        <IconButton onClick={() => setCollapsed?.(true)}>
          <ChevronLeft />
        </IconButton>
      </DrawerHeader>
    );

    const contentList = (
      <List>
        {items ? (
          items
        ) : (
          <ListItem>
            <ListItemIcon>
              <IconButton loading />
            </ListItemIcon>
          </ListItem>
        )}
      </List>
    );

    return isSmallScreen ? (
      <MuiDrawer
        ref={ref}
        variant="temporary"
        open={!collapsed}
        {...drawerProps}
      >
        {contentHeader}
        <Divider />
        {contentList}
      </MuiDrawer>
    ) : (
      <StyledDrawer
        ref={ref}
        variant="permanent"
        open={!collapsed}
        width={width}
        {...drawerProps}
      >
        {contentHeader}
        <Divider />
        {contentList}
      </StyledDrawer>
    );
  }
);

LeftDrawer.displayName = "LeftDrawer";

export default LeftDrawer;

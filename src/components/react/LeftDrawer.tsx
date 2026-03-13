import { ChevronLeft, SearchOutlined } from "@mui/icons-material";
import { Divider, Drawer as MuiDrawer, IconButton, InputBase, List, ListItem, ListItemIcon, alpha, styled, useTheme, useMediaQuery } from "@mui/material";
import _ from "lodash";
import { LoadingButton } from "@mui/lab";
import React from "react";
import { filterMenu } from "../../DrawerHelper.js";

const DrawerHeader = styled('div')(({theme})=>({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const openedMixin = (theme?: any,width?: any) => ({
  width: width,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme?: any) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
})

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

const Search = styled('div')(({theme})=>({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white,0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')] : {
        marginLeft: theme.spacing(1),
        width: 'auto'
    }
}));

const SearchIconWrapper = styled('div')(({theme})=>({
    padding: theme.spacing(0,2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
}));

const SearchInputBase = styled(InputBase)(({theme})=>({
    color: 'inherit',
    '& .MuiInputBase-input':{
        padding: theme.spacing(1,1,1,0),
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width:'100%',
        [theme.breakpoints.up('sm')] : {
            width: '12ch',
            '&:focus': {
                width: '20ch'
            }
        }
    }
}));

function LeftDrawer(props? : any) {
  //const appContext = useContext(AppContext); @todo 2026-03-13 - reimplement
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm')); // Ajuste o breakpoint conforme necessário.
  //const [smOpen,setSmOpen] = useState(false);

  let contentHeader = <DrawerHeader>
  <Search>
      <SearchIconWrapper>
          <SearchOutlined />
      </SearchIconWrapper>
      <SearchInputBase 
          placeholder={_.capitalize(props?.translater ? props.translater(props.searchText || 'search') : props.searchText || 'search')}
          inputProps={{'aria-label':_.capitalize(props?.translater ? props.translater(props.searchText || 'search') : props.searchText || 'search'),onKeyUp: filterMenu }}
      />
    </Search>
    <IconButton onClick={()=>props.setCollapsed(true)}>
      <ChevronLeft/>
    </IconButton>
  </DrawerHeader>;
  
  
  let contentList = <List>
      {props.items 
          ? props.items 
          : <ListItem>
              <ListItemIcon>
                  <LoadingButton loading={true} /> 
              </ListItemIcon>
          </ListItem>
      }
  </List>;


  return (isSmallScreen
    ? <MuiDrawer
        //ref={appContext.leftDrawerRef} @todo 2026-03-13 - reimplement
        variant="temporary"
        open={!props.collapsed} 
      >
        {contentHeader}
        <Divider />
        {contentList}  
      </MuiDrawer>
    : <StyledDrawer
      //ref={appContext.leftDrawerRef} @todo 2026-03-13 - reimplement
      variant="permanent"
      open={!props.collapsed} 
      width={props.width}
    >
      {contentHeader}
      <Divider />
      {contentList}
    </StyledDrawer>
  );
}

export default LeftDrawer;
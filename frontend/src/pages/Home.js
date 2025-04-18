import * as React from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';
import PostAddIcon from '@mui/icons-material/PostAdd';
import InventoryIcon from '@mui/icons-material/Inventory';
import ForumIcon from '@mui/icons-material/Forum';
import PaymentIcon from '@mui/icons-material/Payment';
import LogoutIcon from '@mui/icons-material/Logout';
import Toolbar from '@mui/material/Toolbar';
import AppBar from '@mui/material/AppBar';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import { IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { deepPurple } from '@mui/material/colors';

const drawerWidth = 240;

const theme = createTheme({
  palette: {
    primary: {
      main: '#4B0082',
    },
    background: {
      default: '#f9f9fb',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
  },
});

const openedMixin = {
  width: drawerWidth,
  transition: `width 0.3s ease`,
  overflowX: 'hidden',
};

const closedMixin = {
  width: `60px`,
  transition: `width 0.3s ease`,
  overflowX: 'hidden',
};

const Drawer = styled(MuiDrawer)(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open ? openedMixin : closedMixin),
  '& .MuiDrawer-paper': {
    backgroundColor: '#ffffff',
    color: '#333',
    borderRight: '1px solid #e0e0e0',
    ...(open ? openedMixin : closedMixin),
  },
}));

const navItems = [
  { id: 'home', icon: <HomeIcon />, label: 'Home', path: '/home' },
  { id: 'post', icon: <PostAddIcon />, label: 'Post Waste', path: '/home/post' },
  { id: 'materials', icon: <InventoryIcon />, label: 'My Materials', path: '/home/materials' },
  { id: 'chats', icon: <ForumIcon />, label: 'Chat Hub', path: '/home/chats' },
  { id: 'transactions', icon: <PaymentIcon />, label: 'Transactions', path: '/home/transactions' },
];

export default function Home({ darkMode, setDarkMode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = React.useState(true);
  const user = JSON.parse(localStorage.getItem('user'));
  const [appBarHeight, setAppBarHeight] = React.useState(0);
  const appBarRef = React.useRef(null);

  // Redirect to login if no user is found
  React.useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  React.useEffect(() => {
    const updateAppBarHeight = () => {
      if (appBarRef.current) {
        setAppBarHeight(appBarRef.current.offsetHeight);
      }
    };

    updateAppBarHeight();
    window.addEventListener('resize', updateAppBarHeight);

    return () => {
      window.removeEventListener('resize', updateAppBarHeight);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  if (!user) {
    return null; // Don't render anything while redirecting
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex' }}>
        {/* App Bar */}
        <AppBar
          position="fixed"
          sx={{
            zIndex: theme.zIndex.drawer + 1,
            backgroundColor: '#ffffff',
            color: '#4B0082',
            boxShadow: '0px 4px 20px rgba(0,0,0,0.05)',
          }}
          ref={appBarRef} // Attach the ref to the AppBar
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={() => setOpen(!open)}
              sx={{ mr: 2 }}
            >
              {open ? <ChevronLeftIcon /> : <MenuIcon />}
            </IconButton>
            <Typography variant="h6" noWrap sx={{ flexGrow: 1, fontWeight: 600 }}>
              Smart Waste Management
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="subtitle1">{user?.name || 'User'}</Typography>
              <Avatar sx={{ bgcolor: deepPurple[500] }}>
                {user?.name?.charAt(0) || 'U'}
              </Avatar>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Sidebar */}
        <Drawer variant="permanent" open={open}>
          <Toolbar />
          <List>
            {navItems.map((item) => (
              <ListItem key={item.id} disablePadding sx={{ display: 'block' }}>
                <ListItemButton
                  onClick={() => handleNavigation(item.path)}
                  selected={location.pathname === item.path}
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                    '&.Mui-selected': {
                      backgroundColor: '#f0e6ff',
                      color: '#4B0082',
                      fontWeight: 600,
                    },
                    '&.Mui-selected:hover': {
                      backgroundColor: '#f0e6ff',
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: '#4B0082', minWidth: 0, mr: open ? 2 : 'auto', justifyContent: 'center' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.label} sx={{ opacity: open ? 1 : 0 }} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>

          {/* Logout */}
          <Box sx={{ mt: 'auto', p: 2 }}>
            <ListItemButton
              onClick={handleLogout}
              sx={{
                color: '#4B0082',
                borderRadius: 1,
                '&:hover': {
                  backgroundColor: '#f0e6ff',
                },
              }}
            >
              <ListItemIcon sx={{ color: '#4B0082' }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </Box>
        </Drawer>

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            mt: `${appBarHeight}px`,
            backgroundColor: '#f9f9fb',
            minHeight: '100vh',
            transition: 'margin 0.3s ease',
            ml: open ? `${drawerWidth}px` : `60px`, // Adjust marginLeft based on drawer open state
            boxSizing: 'border-box',
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </ThemeProvider>
  );
}
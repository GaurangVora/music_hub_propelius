import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  Avatar,
  Menu,
  MenuItem,
  IconButton
} from '@mui/material';
import { 
  MusicNote, 
  Home, 
  Search, 
  AccountCircle,
  ExitToApp 
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';

function Header() {
  const { currentUser, signOut } = useUser();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = () => {
    signOut();
    handleClose();
    navigate('/signin');
  };

  return (
    <AppBar position="static" elevation={0} sx={{ backgroundColor: 'background.paper' }}>
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <MusicNote sx={{ mr: 1, color: 'primary.main' }} />
          <Typography 
            variant="h6" 
            component={Link} 
            to="/" 
            sx={{ 
              textDecoration: 'none', 
              color: 'text.primary',
              fontWeight: 'bold'
            }}
          >
            MusicHub
          </Typography>
        </Box>

        {currentUser ? (
          <>
            <Button 
              color="inherit" 
              component={Link} 
              to="/" 
              startIcon={<Home />}
              sx={{ color: 'text.primary', mr: 2 }}
            >
              Collections
            </Button>
            
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body2" sx={{ mr: 1, color: 'text.secondary' }}>
                {currentUser.displayName}
              </Typography>
              <IconButton
                onClick={handleMenu}
                sx={{ color: 'text.primary' }}
              >
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                  {currentUser.displayName.charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <MenuItem onClick={handleSignOut}>
                  <ExitToApp sx={{ mr: 1 }} />
                  Sign Out
                </MenuItem>
              </Menu>
            </Box>
          </>
        ) : (
          <>
            <Button 
              color="inherit" 
              component={Link} 
              to="/signin"
              sx={{ color: 'text.primary', mr: 1 }}
            >
              Sign In
            </Button>
            <Button 
              variant="contained" 
              component={Link} 
              to="/signup"
              sx={{ textTransform: 'none' }}
            >
              Sign Up
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Header; 
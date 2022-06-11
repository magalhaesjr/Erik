import { Drawer } from '@mui/material';
import { Link } from 'react-router-dom';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import AppsIcon from '@mui/icons-material/Apps';
import List from '@mui/material/List';
import MainDiv from '../components/MainDiv';

// Output Drawer
const OutDrawer = () => {
  return (
    <Drawer
      variant="permanent"
      sx={{
        position: 'relative',
        width: '180px',
        flexShrink: 0,
        display: 'block',
        anchor: 'left',
      }}
      PaperProps={{
        sx: {
          backgroundColor: 'primary.main',
          color: 'rgba(225,249,27,1)',
          width: '180px',
          display: 'block',
        },
      }}
    >
      <MainDiv>
        <List>
          <ListItem button component={Link} to="/">
            <ListItemIcon>
              <AppsIcon />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItem>
          <ListItem button component={Link} to="/dashboard">
            <ListItemIcon>
              <AppsIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
          <ListItem button component={Link} to="/courtmap">
            <ListItemIcon>
              <AppsIcon />
            </ListItemIcon>
            <ListItemText primary="Court Map" />
          </ListItem>
          <ListItem button component={Link} to="/divisions">
            <ListItemIcon>
              <AppsIcon />
            </ListItemIcon>
            <ListItemText primary="Divisions" />
          </ListItem>
          <ListItem button component={Link} to="/payouts">
            <ListItemIcon>
              <AppsIcon />
            </ListItemIcon>
            <ListItemText primary="Payouts" />
          </ListItem>
          <ListItem button component={Link} to="/pools">
            <ListItemIcon>
              <AppsIcon />
            </ListItemIcon>
            <ListItemText primary="Pools" />
          </ListItem>
          <ListItem button component={Link} to="/registration">
            <ListItemIcon>
              <AppsIcon />
            </ListItemIcon>
            <ListItemText primary="Registration" />
          </ListItem>
        </List>
      </MainDiv>
    </Drawer>
  );
};

export default OutDrawer;

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Avatar,
  Badge,
  Grid,
  Hidden,
} from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MenuIcon from "@mui/icons-material/Menu";
import { logoutUser } from "../../redux/reducers/UserLoginSlice";
import { RootState } from "../../model/RootStateTypes";

const SupplierNavbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.userLogin.user);
  const djsUsers = useSelector((state: RootState) => state.registered.DjsUsers);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [totalSelectedEvents, setTotalSelectedEvents] = useState(0);
  const [totalSelectedGenres, setTotalSelectedGenres] = useState(0);

  useEffect(() => {
    if (user) {
      const currentUser = djsUsers.find(
        (djUser) => djUser.userEmail === user.userEmail
      );
      if (currentUser) {
        const currentUserEvents = currentUser.selectedEvents || {};
        const totalEvents = Object.keys(currentUserEvents).length;
        setTotalSelectedEvents(totalEvents);

        const currentUserGenres = currentUser.selectedGenres || [];
        setTotalSelectedGenres(currentUserGenres.length);
      }
    }
  }, [user, djsUsers]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/");
  };

  return (
    <AppBar
      position="static"
      style={{
        marginTop: -1,
        background: "rgba(0, 0, 0, 0.5)",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
        height: "auto",
      }}
    >
      <Toolbar>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            {user && (
              <Grid container alignItems="center">
                <Avatar
                  src={user.customAvatarUrl}
                  alt="User Avatar"
                  sx={{ width: 50, height: 50 }}
                />
                <Typography variant="subtitle1" sx={{ marginLeft: 1 }}>
                  {user.userFirstName} {user.userLastName}
                </Typography>
              </Grid>
            )}
          </Grid>
          <Grid item>
            <Hidden lgUp>
              <Button color="inherit" onClick={handleMenuOpen}>
                <MenuIcon />
              </Button>
            </Hidden>
            <Hidden mdDown>
              <Button
                onClick={() => navigate("/supplierwelcome")}
                variant="outlined"
                color="primary"
                sx={{
                  mr: 5,
                  height: 40,
                  backgroundColor: "rgba(0, 128, 255, 0.6)",
                  color: "white",
                  borderColor: "black",
                }}
              >
                Mis Géneros
                <Badge
                  badgeContent={totalSelectedGenres}
                  color="secondary"
                  sx={{ position: "absolute", top: 2, right: 2 }}
                />
              </Button>

              <Button
                onClick={() => navigate("/typesevents")}
                variant="outlined"
                color="primary"
                sx={{
                  mr: 5,
                  height: 40,
                  backgroundColor: "rgba(0, 128, 255, 0.6)",
                  color: "white",
                  borderColor: "black",
                }}
              >
                ¿Eventos?
                <Badge
                  badgeContent={totalSelectedEvents}
                  color="secondary"
                  sx={{ position: "absolute", top: 2, right: 2 }}
                />
              </Button>

              <Button
                onClick={() => navigate("/PriceConfigurationEvents")}
                variant="outlined"
                color="primary"
                sx={{
                  mr: 5,
                  height: 40,
                  backgroundColor: "rgba(0, 128, 255, 0.6)",
                  color: "white",
                  borderColor: "black",
                }}
              >
                Mis Tarifas
              </Button>

              <Button
                onClick={() => navigate("/DjsArea")}
                variant="outlined"
                color="primary"
                sx={{
                  mr: 5,
                  height: 40,
                  backgroundColor: "rgba(0, 128, 255, 0.6)",
                  color: "white",
                  borderColor: "black",
                }}
              >
                Areas de Trabajo
              </Button>

              <Button
                variant="contained"
                onClick={handleLogout}
                color="secondary"
                style={{
                  margin: "auto",
                  position: "relative",
                  display: "inline-block",
                }}
              >
                Cerrar Sesión
              </Button>
            </Hidden>
          </Grid>
        </Grid>
        <Hidden lgUp>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem
              onClick={() => {
                navigate("/supplierwelcome");
                handleMenuClose();
              }}
            >
              Mis Géneros
              <Badge
                badgeContent={totalSelectedGenres}
                color="secondary"
                sx={{ position: "absolute", top: 5, right: 15 }}
              />
            </MenuItem>
            <MenuItem
              onClick={() => {
                navigate("/typesevents");
                handleMenuClose();
              }}
            >
              ¿Eventos?
              <Badge
                badgeContent={totalSelectedEvents}
                color="secondary"
                sx={{ position: "absolute", top: 5, right: 15 }}
              />
            </MenuItem>
            <MenuItem
              onClick={() => {
                navigate("/PriceConfigurationEvents");
                handleMenuClose();
              }}
            >
              Mis Tarifas
            </MenuItem>
            <MenuItem
              onClick={() => {
                navigate("/DjsArea");
                handleMenuClose();
              }}
            >
              Areas de Trabajo
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleLogout();
                handleMenuClose();
              }}
            >
              Cerrar Sesión
            </MenuItem>
          </Menu>
        </Hidden>
      </Toolbar>
    </AppBar>
  );
};

export default SupplierNavbar;

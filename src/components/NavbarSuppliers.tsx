import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../model/RootStateTypes";
import { logoutUser } from "../redux/reducers/UserLoginSlice";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Avatar,
  Badge,
  Grid,
} from "@mui/material";

const SupplierNavbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.userLogin.user);
  const djsUsers = useSelector((state: RootState) => state.registered.DjsUsers);
  const [totalSelectedEvents, setTotalSelectedEvents] = useState(0);
  const [totalSelectedGenres, setTotalSelectedGenres] = useState(0);

  useEffect(() => {
    if (user) {
      const currentUser = djsUsers.find(
        (djUser) => djUser.userEmail === user.userEmail
      );
      if (currentUser) {
        // Calculo la cantidad de eventos y géneros seleccionados
        const currentUserEvents = currentUser.selectedEvents || {};

        const totalEvents = Object.keys(currentUserEvents).length;
        setTotalSelectedEvents(totalEvents);

        const currentUserGenres = currentUser.selectedGenres || [];
        setTotalSelectedGenres(currentUserGenres.length);
      }
    }
  }, [user, djsUsers]);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/");
  };

  // Si no hay usuario actual, el componente no muestra nada
  if (!user) {
    return null;
  }

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
        <Grid item container xs={12} sm={6}>
          {user && (
            <Grid style={{ height: 50, textAlign: "center" }}>
              <Avatar
                src={user.customAvatarUrl}
                alt="User Avatar"
                style={{
                  marginTop: -3,
                  width: 60,
                  height: 60,
                  borderRadius: "50%",
                  marginLeft: 10,
                }}
              />
              <Typography
                variant="subtitle1"
                style={{
                  color: "#fff",
                  fontWeight: "bold",
                  marginTop: 3,
                  marginLeft: 11,
                }}
              >
                {user.userFirstName}
              </Typography>
              <Typography
                variant="body2"
                style={{ color: "#fff", marginLeft: 11, marginTop: -4 }}
              >
                {user.userLastName}
              </Typography>
            </Grid>
          )}
        </Grid>

        {user && (
          <Grid container>
            <div style={{ position: "relative", marginLeft: -25 }}>
              <Button
                variant="contained"
                onClick={() => navigate("/supplierwelcome")}
                color="primary"
                style={{ margin: "auto", position: "relative" }}
              >
                Mis Géneros
                <Badge
                  color="primary"
                  badgeContent={totalSelectedGenres}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  sx={{
                    position: "absolute",
                    bottom: "50%",
                    right: -3,
                    transform: "scale(1.8)",
                  }}
                />
              </Button>
            </div>
            <div style={{ position: "relative", marginLeft: 30 }}>
              <Button
                variant="contained"
                onClick={() => navigate("/typesevents")}
                color="primary"
                style={{ margin: "auto", position: "relative" }}
              >
                ¿Eventos?
                <Badge
                  color="primary"
                  badgeContent={totalSelectedEvents}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                  sx={{
                    position: "absolute",
                    bottom: "50%",
                    right: -3,
                    transform: "scale(1.8)",
                  }}
                />
              </Button>
            </div>
            <Button
              variant="contained"
              onClick={() => navigate("/PriceConfigurationEvents")}
              color="primary"
              style={{ margin: "auto", marginLeft: 30 }}
            >
              Mis Tarifas
            </Button>

            <Button
              variant="contained"
              onClick={handleLogout}
              color="secondary"
              style={{ margin: "auto" }}
            >
              Cerrar Sesión
            </Button>
          </Grid>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default SupplierNavbar;

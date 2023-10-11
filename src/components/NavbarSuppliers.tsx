import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Avatar,
  Grid,
  Snackbar,
  SnackbarContent,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../model/RootStateTypes";
import { logoutUser } from "../redux/reducers/UserLoginSlice";
import { useNavigate } from "react-router-dom";
import logomusic from "../../public/images/Logomusic.png";

const SupplierNavbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.userLogin.user);
  const [showWelcomeSnackbar, setShowWelcomeSnackbar] = useState(false);

  useEffect(() => {
    const hasShownWelcomeDialog = localStorage.getItem("hasShownWelcomeDialog");
    if (!hasShownWelcomeDialog) {
      setShowWelcomeSnackbar(true);
      localStorage.setItem("hasShownWelcomeDialog", "true");
    }
  }, []);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/");
  };

  return (
    <AppBar
      position="static"
      style={{
        marginTop: -8,
        background: "rgba(0, 0, 0, 0.5)",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
        height: "70px",
      }}
    >
      <Toolbar>
        <Grid container alignItems="center">
          <Grid item container xs={12} sm={6} alignItems="center">
            {user && (
              <React.Fragment>
                <Grid item>
                  <Avatar
                    src={user.customAvatarUrl}
                    alt="User Avatar"
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: "50%",
                      marginRight: 10,
                    }}
                  />
                </Grid>
                <Grid item>
                  <div>
                    <Typography
                      variant="subtitle1"
                      style={{ color: "#fff", fontWeight: "bold" }}
                    >
                      {user.userFirstName}
                    </Typography>
                    <Typography variant="body2" style={{ color: "#fff" }}>
                      {user.userEmail}
                    </Typography>
                  </div>
                </Grid>
              </React.Fragment>
            )}
          </Grid>
          <Grid item container xs={12} sm={6}>
            {user && (
              <Grid item xs={12} sm={12} md={12}>
                <Button
                  variant="contained"
                  onClick={() => navigate("/supplierwelcome")}
                  color="primary"
                  style={{ marginLeft: 20 }}
                >
                  supplierwelcome
                </Button>

                <Button
                  variant="contained"
                  onClick={() => navigate("/TypesEvents")}
                  color="primary"
                  style={{ marginLeft: 20 }}
                >
                  Tipos de Eventos para DJs
                </Button>
                <Button
                  variant="contained"
                  onClick={handleLogout}
                  color="secondary"
                  style={{ marginLeft: 20 }}
                >
                  Cerrar Sesión
                </Button>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Toolbar>
      {showWelcomeSnackbar && (
        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          container
          style={{
            position: "relative",
            marginTop: "2rem",
            textAlign: "center",
            alignItems: "center",
          }}
        >
          <Snackbar
            open={showWelcomeSnackbar}
            autoHideDuration={3000}
            onClose={() => setShowWelcomeSnackbar(false)}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <SnackbarContent
              style={{
                height: "100%",
                background: "rgba(0, 0, 0, 1)",
                color: "white",
                textAlign: "center",
                padding: "20px",
              }}
              message={
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  container
                  style={{ position: "relative", marginTop: "10px" }}
                >
                  <Grid>
                    <Typography
                      variant="h4"
                      style={{
                        marginBottom: "1rem",
                        marginLeft: "60px",
                      }}
                    >
                      ¡Bienvenido!
                    </Typography>
                    <Typography
                      variant="h4"
                      style={{ marginBottom: "1rem", marginLeft: "80px" }}
                    >
                      {user?.userFirstName}!
                    </Typography>
                  </Grid>

                  <img
                    src={logomusic}
                    alt="Logo"
                    style={{
                      borderRadius: "10px",
                      marginLeft: "65px",
                      maxWidth: "200px",
                      marginBottom: "1rem",
                    }}
                  />
                  <Typography variant="body1" style={{ padding: " 10px" }}>
                    Descubre la plataforma de música exclusiva para proveedores.
                    Aquí podrás encontrar todas las herramientas y recursos que
                    necesitas para potenciar tu negocio musical.
                  </Typography>
                </Grid>
              }
            />
          </Snackbar>
        </Grid>
      )}
    </AppBar>
    
  );
};

export default SupplierNavbar;

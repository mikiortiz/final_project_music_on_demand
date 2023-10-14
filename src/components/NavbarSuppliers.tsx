import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Avatar,
  Grid,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../model/RootStateTypes";
import { logoutUser } from "../redux/reducers/UserLoginSlice";
import { useNavigate } from "react-router-dom";

const SupplierNavbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.userLogin.user);

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
                    {user.userLastName}
                  </Typography>
                </div>
              </Grid>
            </React.Fragment>
          )}
        </Grid>

        {user && (
          <Grid container>
            <Button
              variant="contained"
              onClick={() => navigate("/supplierwelcome")}
              color="primary"
              style={{ margin: "auto" }}
            >
              supplierwelcome
            </Button>

            <Button
              variant="contained"
              onClick={() => navigate("/typesevents")}
              color="primary"
              style={{ margin: "auto" }}
            >
              Tipos de Eventos para DJs
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

import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../model/RootStateTypes";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Avatar,
  Hidden,
  Menu,
  MenuItem,
  IconButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { logoutUser } from "../../redux/reducers/UserLoginSlice";
import { useNavigate } from "react-router-dom";

const UserNavbar: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.userLogin.user);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/");
    handleMenuClose(); // Cerrar el menú al hacer logout
  };

  return (
    <AppBar
      position="static"
      style={{
        marginTop: -7,
        background: "rgba(0, 0, 0, 1)",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
        height: "auto",
      }}
    >
      <Toolbar>
        <Hidden lgUp>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleMenuOpen}
            style={{ marginRight: "10px" }}
          >
            <MenuIcon />
          </IconButton>
        </Hidden>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginLeft: "10px",
          }}
        >
          {user && (
            <div style={{ marginRight: "10px" }}>
              <Avatar
                src={user.customUserAvatarUrl}
                alt="User Avatar"
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "50%",
                }}
              />
            </div>
          )}

          {user && (
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
          )}
        </div>

        <Hidden mdDown>
          <div style={{ marginLeft: "auto", marginRight: "10px" }}>
            {user && (
              <div>
                <Button
                  onClick={() => navigate("/userwelcome")}
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
                  Djs sercanos
                </Button>
                <Button
                  onClick={() => navigate("/listcontracts")}
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
                  Mis Contratos
                </Button>
                <Button
                  onClick={() => navigate("/usermaphome")}
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
                  Mi Ubicación
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
              </div>
            )}
          </div>
        </Hidden>

        <Hidden lgUp>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleLogout}>Cerrar Sesión</MenuItem>
          </Menu>
        </Hidden>
      </Toolbar>
    </AppBar>
  );
};

export default UserNavbar;

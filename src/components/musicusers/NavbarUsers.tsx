import React from "react";
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
import { useNavigate, useLocation } from "react-router-dom";

const UserNavbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("currentUser") || "null");
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    navigate("/");
    handleMenuClose();
    localStorage.removeItem("currentUser");
  };

  const isActive = (path: string) => {
    return location.pathname === path;
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
                  color={isActive("/userwelcome") ? "primary" : "secondary"}
                  sx={{
                    mr: 5,
                    height: 40,
                    backgroundColor: isActive("/userwelcome")
                      ? ""
                      : "rgba(0, 128, 255, 0.6)",
                    color: "white",
                    borderColor: isActive("/userwelcome") ? "" : "black",
                  }}
                >
                  Djs cercanos
                </Button>
                <Button
                  onClick={() => navigate("/listcontracts")}
                  variant="outlined"
                  color={isActive("/listcontracts") ? "primary" : "secondary"}
                  sx={{
                    mr: 5,
                    height: 40,
                    backgroundColor: isActive("/listcontracts")
                      ? ""
                      : "rgba(0, 128, 255, 0.6)",
                    color: "white",
                    borderColor: isActive("/listcontracts") ? "" : "black",
                  }}
                >
                  Mis Contratos
                </Button>
                <Button
                  onClick={() => navigate("/usermaphome")}
                  variant="outlined"
                  color={isActive("/usermaphome") ? "primary" : "secondary"}
                  sx={{
                    mr: 5,
                    height: 40,
                    backgroundColor: isActive("/usermaphome")
                      ? ""
                      : "rgba(0, 128, 255, 0.6)",
                    color: "white",
                    borderColor: isActive("/usermaphome") ? "" : "black",
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
            <MenuItem
              onClick={() => {
                navigate("/userwelcome");
                handleMenuClose();
              }}
            >
              Djs cercanos
            </MenuItem>
            <MenuItem
              onClick={() => {
                navigate("/listcontracts");
                handleMenuClose();
              }}
            >
              Mis Contratos
            </MenuItem>
            <MenuItem
              onClick={() => {
                navigate("/usermaphome");
                handleMenuClose();
              }}
            >
              Mi Ubicación
            </MenuItem>
            <MenuItem onClick={handleLogout}>Cerrar Sesión</MenuItem>
          </Menu>
        </Hidden>
      </Toolbar>
    </AppBar>
  );
};

export default UserNavbar;

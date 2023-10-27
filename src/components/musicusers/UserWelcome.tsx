import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../model/RootStateTypes";
import { AppBar, Typography, Avatar, Toolbar, Button } from "@mui/material";
import { logoutUser } from "../../redux/reducers/UserLoginSlice";
import { useNavigate } from "react-router-dom";

const UserWelcome: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.userLogin.user);

  // Se verifica si user está definido
  if (!user) {
    return <div>No hay datos del usuario</div>;
  }

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/");
  };

  return (
    <div
      style={{
        position: "relative",
        height: "100vh",
        width: "100vw",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <AppBar
        position="static"
        style={{
          background: "rgba(0, 0, 0, 0.5)",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
          height: "70px",
        }}
      >
        <Toolbar>
          {user && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginLeft: "80px",
              }}
            >
              <Avatar
                src={user.customUserAvatarUrl}
                alt="User Avatar"
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "50%",
                  marginRight: "10px",
                }}
              />
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
            </div>
          )}
          {user && (
            <div style={{ marginLeft: "auto", marginRight: "10px" }}>
              {/* Utiliza el componente Button para el botón de cierre de sesión */}
              <Button
                variant="contained"
                onClick={handleLogout}
                color="secondary"
              >
                Cerrar Sesión
              </Button>
            </div>
          )}
        </Toolbar>
      </AppBar>
      <div
        style={{
          background: "rgba(0, 0, 0, 0.9)",
          height: "50px",
          textAlign: "center",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography
          style={{ color: "white", fontSize: "30px", fontWeight: "600" }}
        >
          SECCION DE MUSIC-USER
        </Typography>
      </div>

      {/* Contenido adicional aquí */}
    </div>
  );
};

export default UserWelcome;

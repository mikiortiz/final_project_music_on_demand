import React, { useState, useEffect } from "react";
import GoogleMapReact from "google-map-react";
import RoomIcon from "@mui/icons-material/Room";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../model/RootStateTypes";
import {
  Avatar,
  Typography,
  Snackbar,
  SnackbarContent,
  Grid,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import logomusic from "../../../public/images/Logomusic.png";
import { setShowWelcomeMessage } from "../../redux/reducers/UserLoginSlice";
import { addArea } from "../../redux/reducers/RegisteredFormSlice";

const MuiMarker: React.FC<{
  lat: number;
  lng: number;
  userAvatarUrl: string;
}> = ({ lat, lng, userAvatarUrl }) => {
  if (!lat || !lng) {
    return null;
  }
  return (
    <div
      style={{
        position: "absolute",
        transform: "translate(-50%, -100%)",
        zIndex: 1,
      }}
    >
      <RoomIcon color="primary" style={{ fontSize: 100, marginBottom: -10 }} />
      {userAvatarUrl && (
        <Avatar
          src={userAvatarUrl}
          alt="User Marker"
          style={{
            background: "rgba(0, 0, 0, 0.9)",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.9)",
            position: "absolute",
            transform: "translate(75%, -90%)",
            marginTop: "-40%",
            zIndex: 3,
            width: "40px",
            height: "40px",
          }}
        />
      )}
      <Typography
        style={{
          textAlign: "center",
          color: "white",
          background: "rgba(0, 0, 0, 0.8)",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.9)",
          position: "absolute",
          transform: "translate(0%, -85%)",
          marginTop: "-95%",
          borderRadius: 5,
          zIndex: 1,
          width: "auto",
          height: "auto",
        }}
      >
        ¿Dónde iremos?
      </Typography>
    </div>
  );
};

const MapComponentHome: React.FC = () => {
  const navigate = useNavigate();
  const [center, setCenter] = useState<{ lat: number; lng: number }>({
    lat: -33.58101234209427,
    lng: -69.0172903733438,
  });

  const dispatch = useDispatch();
  const userAvatarUrl = useSelector(
    (state: RootState) => state.userLogin.user?.customUserAvatarUrl
  );
  const hasShownWelcomeMessage = useSelector(
    (state: RootState) => state.userLogin.hasShownWelcomeMessage
  );

  const user = useSelector((state: RootState) => state.userLogin.user);

  useEffect(() => {
    // Muestra el cartel de bienvenida una vez cuando el componente se monta
    dispatch(setShowWelcomeMessage(true));

    const timer = setTimeout(() => {
      dispatch(setShowWelcomeMessage(false));
    }, 5000);


    return () => clearTimeout(timer);
  }, [dispatch]);

  const handleMapClick = (e: any) => {
    console.log("Coordenadas clickeadas en el mapa:", e.lat, e.lng);
    setCenter({ lat: e.lat, lng: e.lng });
  };

  const handleSaveLocation = () => {
    dispatch(
      addArea({
        email: user?.userEmail || "",
        area: {
          name:"",
          lat: center.lat.toString(),
          lng: center.lng.toString(),
          radius: 0, 
        },
      })
    );
    console.log("Ubicación guardada:", { lat: center.lat, lng: center.lng });
    navigate("/userwelcome");
  };

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        position: "fixed",
        top: 0,
        left: 0,
      }}
    >
      <GoogleMapReact
        bootstrapURLKeys={{ key: "AIzaSyBfjO7sxd8P6HDrF1lmvLV151z7ocauPD0" }} // Reemplaza "API_KEY" con tu clave de API de Google Maps
        center={center}
        zoom={8}
        options={{ disableDefaultUI: true }}
        onClick={handleMapClick}
      >
        <MuiMarker
          userAvatarUrl={userAvatarUrl}
          lat={center.lat}
          lng={center.lng}
        />
      </GoogleMapReact>
      <Grid container item>
        <Button
          variant="outlined"
          color="primary"
          onClick={handleSaveLocation}
          style={{
            color: "white",
            background: "rgba(0, 0, 0, 0.8)",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.9)",
            transform: "translate(0%, -175%)",
            marginTop: "0%",
            borderRadius: 5,
            zIndex: 1,
            width: "100%",
            height: "60px",
          }}
        >
          Guardar UBI
        </Button>
      </Grid>

      {hasShownWelcomeMessage && (
        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          container
          style={{
            position: "relative",
            textAlign: "center",
            alignItems: "center",
          }}
        >
          <Snackbar
            open={hasShownWelcomeMessage}
            autoHideDuration={3000}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <SnackbarContent
              style={{
                background: "rgba(0, 0, 0, 0.8)",
                color: "white",
                textAlign: "center",
                width: "100%",
                maxWidth: "500px",
              }}
              message={
                <Grid
                  container
                  direction="column"
                  alignItems="center"
                  spacing={2}
                >
                  <Grid item>
                    <Typography variant="h4">¡Bienvenid@!</Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="h4">{user?.userFirstName}</Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="h4">
                      Ya eres Dj de Music-World
                    </Typography>
                  </Grid>
                  <Grid item>
                    <img
                      src={logomusic}
                      alt="Logo"
                      style={{
                        borderRadius: "10px",
                        maxWidth: "200px",
                        marginTop: "1rem",
                      }}
                    />
                  </Grid>
                  <Grid item>
                    <Typography variant="body1">
                      Descubre la plataforma de música exclusiva para
                      proveedores. Aquí podrás encontrar todas las herramientas
                      y recursos que necesitas para potenciar tu negocio
                      musical.
                    </Typography>
                  </Grid>
                </Grid>
              }
            />
          </Snackbar>
        </Grid>
      )}
    </div>
  );
};

export default MapComponentHome;

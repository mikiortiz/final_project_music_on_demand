import React, { useState, useRef, useEffect } from "react";
import GoogleMapReact from "google-map-react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, Grid, Typography } from "@mui/material";
import { addArea } from "../../redux/reducers/RegisteredFormSlice";
import NavbarUser from "./NavbarUsers";

const MapComponentHome: React.FC = () => {
  const navigate = useNavigate();
  const [newPosition, setNewPosition] = useState<{ lat: number; lng: number }>({
    lat: -33.58101234209427,
    lng: -69.0172903733438,
  });

  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem("currentUser") || "{}");

  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  useEffect(() => {
    const getCurrentLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            const currentLocation = { lat: latitude, lng: longitude };
            setNewPosition(currentLocation);
          },
          (error) => {
            console.error("Error getting current location:", error);
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
      }
    };

    getCurrentLocation();
  }, []);

  const handleMapClick = (e: any) => {
    const clickedPosition = {
      lat: e.lat,
      lng: e.lng,
    };
    setNewPosition(clickedPosition);

    if (markerRef.current && mapRef.current) {
      markerRef.current.setPosition(clickedPosition);
    }
  };

  const handleSaveLocation = () => {
    dispatch(
      addArea({
        email: user?.userEmail || "",
        area: {
          lat: newPosition.lat.toString(),
          lng: newPosition.lng.toString(),
        },
      })
    );
    navigate("/userwelcome");
  };

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        position: "fixed",
        top: 7,
        left: 0,
      }}
    >
      <NavbarUser />
      <Grid
        zIndex={1}
        item
        xs={12}
        style={{ position: "absolute", top: 57, left: 0 }}
      >
        <Typography
          variant="h4"
          sx={{
            height: "auto",
            backgroundColor: "black",
            color: "white",
            fontWeight: "600",
            fontSize: 30,
            textAlign: "center",
            mt: "1px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          ENCUENTRA A LOS MEJORES DJS EN TU ÁREA
        </Typography>

        <Typography
          sx={{
            background: "rgba(0, 0, 0, 0.7)",
            color: "white",
            fontSize: -30,
            fontWeight: "600",
            width: "100%",
            textAlign: "center",
            mt: "1px",
          }}
        >
          Una vez que hayas establecido tu ubicación perfecta, desbloquea un
          mundo de posibilidades musicales. Haz clic en "Ver DJs Cercanos a esta
          Ubicación" y sumérgete en un océano de talento. Descubre perfiles,
          variedad de géneros, y elige a los DJs que harán vibrar tus altavoces
          y llenarán el aire con notas inolvidables.
        </Typography>
      </Grid>
      <GoogleMapReact
        bootstrapURLKeys={{
          key: "AIzaSyCSd0sJy7AR6CZx_-0Yh-GnEE8ERHFUDEM",
        }}
        center={newPosition}
        zoom={15}
        options={{ disableDefaultUI: true }}
        onClick={handleMapClick}
        yesIWantToUseGoogleMapApiInternals={true}
        onGoogleApiLoaded={({ map }) => {
          mapRef.current = map;

          markerRef.current = new window.google.maps.Marker({
            position: newPosition,
            map: mapRef.current,
            draggable: true,
            title: "¡Aquí estoy!",
            icon: {
              path: window.google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
              fillColor: "blue",
              fillOpacity: 1,
              strokeColor: "white",
              strokeWeight: 2,
              scale: 13,
            },
          });

          markerRef.current.addListener(
            "dragend",
            (event: any) => {
              const draggedPosition = {
                lat: event.latLng.lat(),
                lng: event.latLng.lng(),
              };
              setNewPosition(draggedPosition);
            },
            { passive: true }
          );
        }}
      />
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
            marginTop: "-2%",
            borderRadius: 5,
            zIndex: 1,
            width: "100%",
            height: "60px",
          }}
        >
          Ver Djs Cercanos a esta Ubicación
        </Button>
      </Grid>
    </div>
  );
};

export default MapComponentHome;

import { Box, Typography } from "@mui/material";

const NotificationBanner = () => {
  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor: "#FF5733", // Color amarillo-rojo
        padding: "10px",
        textAlign: "center",
        position: "fixed",
        bottom: 0, // Moverlo a la parte inferior
        left: 0,
        zIndex: 1000,
      }}
    >
      <Typography variant="body1" fontWeight="bold">
        Hey, tenemos un problema con Spotify. Actualmente, están realizando
        actualizaciones en su API, lo que impide procesar solicitudes desde
        nuestra app. Debido a esto, los géneros y albumes no se están
        mostrando. Estamos trabajando en una solución. ¡Gracias
        por la paciencia!
      </Typography>
    </Box>
  );
};

export default NotificationBanner;

import { Box, Typography } from "@mui/material";

const NotificationBanner = () => {
  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor: "#FF5733",
        padding: "10px",
        textAlign: "center",
        position: "fixed",
        bottom: 0,
        left: 0,
        zIndex: 1000,
      }}
    >
      <Typography
        variant="h6"
        fontWeight="bold"
        sx={{ marginBottom: "2px", marginTop: "-10px" }}
      >
        Hey, tenemos un problema con Spotify
      </Typography>
      <Typography
        variant="body2"
        sx={{ color: "black", lineHeight: 1.5, textAlign: "center" }}
      >
        Actualmente, están realizando actualizaciones en su API, lo que impide
        procesar solicitudes desde nuestra app. Debido a esto, los géneros y
        álbumes no se están mostrando.!
      </Typography>
      <Typography
        variant="body2"
        sx={{ color: "black", lineHeight: 1.5, textAlign: "center" }}
      >
        Estamos trabajando en una solución. ¡Gracias por la paciencia!
      </Typography>
    </Box>
  );
};

export default NotificationBanner;

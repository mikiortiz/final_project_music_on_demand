import { useState } from "react";
import fondo from "../assets/images/fondo1.png";
import {
  Button,
  InputLabel,
  MenuItem,
  Select,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Typography,
} from "@mui/material";
import CardImage from "../assets/images/CardImage.png";
import { Box } from "@mui/system";
import logomusic from "../assets/images/logomusic1.png";
import { useDispatch } from "react-redux";
import { addSupplier } from "../redux/reducers/SupplierFormSlice";
import Avatar from "@mui/material/Avatar";
import { fetchRandomUserData } from "../services/ApiUsers";

function UserSupplierRegistration() {
  const [showCard, setShowCard] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userFirstName, setUserFirstName] = useState("");
  const [userLastName, setUserLastName] = useState("");
  const [userAge, setUserAge] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [genderPreference, setGenderPreference] = useState("");
  const [customAvatarUrl, setCustomAvatarUrl] = useState("");
  const [userContactNumber, setUserContactNumber] = useState("");
  const [cardText, setCardText] = useState("");

  const [openDialog, setOpenDialog] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogBackgroundColor, setDialogBackgroundColor] = useState("white");
  const [dialogTextColor, setDialogTextColor] = useState("black");

  const dispatch = useDispatch();

  const musicalGenres = [
    "Pop",
    "Rock",
    "Electrónica",
    "Hip-Hop",
    "Jazz",
    "Clásica",
    "R&B",
    "Reggae",
    "Country",
    "Metal",
    "cumbia",
  ];

  const isAdult = () => {
    return parseInt(userAge) >= 18;
  };
  const isValidURL = (url: string) => {
    const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
    return urlPattern.test(url);
  };

  const handleProveedorClick = async () => {
    setShowCard(true);

    const userData = await fetchRandomUserData();
    if (userData) {
      setUserEmail(userData.email);
      setUserFirstName(userData.name.first);
      setUserLastName(userData.name.last);
      setUserAge(userData.dob.age);
      setUserContactNumber(userData.cell);
      setCustomAvatarUrl(userData.picture.large); // Establece la URL del avatar automáticamente
    }
  };

  const handleUsuarioClick = () => {
    setShowCard(false);
  };

  const handleCloseClick = () => {
    setShowCard(false);
  };

  const handleSubmit = () => {
    if (
      userEmail &&
      userAge &&
      userPassword &&
      genderPreference &&
      customAvatarUrl
    ) {
      // validaciones
      if (!isAdult()) {
        setDialogTitle("Error de Registro");
        setCardText("Debes ser Mayor de 18 Años para Registrarte.");
        setOpenDialog(true);
        return;
      }

      if (userFirstName === "") {
        setDialogTitle("Error de Registro");
        setCardText("Nombre por Favor");
        setOpenDialog(true);
        return;
      }

      if (userLastName === "") {
        setDialogTitle("Error de Registro");
        setCardText("Apellido por Favor");
        setOpenDialog(true);
        return;
      }

      if (userContactNumber === "" || userContactNumber.length < 6) {
        setDialogTitle("Error de Registro");
        setCardText("Numero de Contacto Valido por Favor");
        setOpenDialog(true);
        return;
      }

      if (userPassword.length < 4) {
        setDialogTitle("Error de Registro");
        setCardText("La Contraseña Debe Tener al Menos 4 Caracteres");
        setOpenDialog(true);
        return;
      }

      if (!userEmail.includes("@")) {
        setDialogTitle("Error de Registro");
        setCardText("Dirección de Correo Electrónico Invalido.");
        setOpenDialog(true);
        return;
      }

      if (!isValidURL(customAvatarUrl)) {
        setDialogTitle("Error de Registro");
        setCardText(
          "La URL de la imagen de avatar no tiene un formato válido."
        );
        setOpenDialog(true);
        return;
      }

      const newUser = {
        userEmail,
        userFirstName,
        userLastName,
        userAge,
        userPassword,
        genderPreference,
        customAvatarUrl,
        userContactNumber,
      };

      dispatch(addSupplier(newUser));

      setUserEmail("");
      setUserFirstName("");
      setUserLastName("");
      setUserAge("");
      setUserPassword("");
      setGenderPreference("");
      setCustomAvatarUrl("");
      setUserContactNumber("");
      setCardText("Registrado éxitosamente");

      setDialogTitle("Éxito");
      setDialogBackgroundColor("green"); // Cambia el fondo de la ventana de diálogo a verde
      setDialogTextColor("white"); // Cambia el color del texto de la ventana de diálogo a blanco
      setOpenDialog(true);
    } else {
      setDialogTitle("Error");
      setCardText("Por favor, completa todos los campos obligatorios.");
      setOpenDialog(true);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: "100vh",
        backgroundImage: `url(${fondo})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        position: "relative",
      }}
    >
      <img
        src={logomusic}
        alt="Logomusic"
        style={{
          borderRadius: "10px",
          position: "absolute",
          top: "20px",
          width: "200px",
        }}
      />
      <Box
        sx={{
          borderRadius: "10px",
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          width: "90%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "5%",
          maxWidth: "500px",
          margin: "0 auto",
          position: "absolute",
          top: "65%",
          transform: "translateY(-50%)",
        }}
      >
        <Typography variant="h4" color="white">
          Te Regístraras como
        </Typography>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            marginTop: "20px",
          }}
        >
          <Button
            sx={{
              backgroundColor: "rgba(255, 255, 255, 0.5)",
              color: "white",
              borderColor: "black",
              minWidth: "300px",
              width: "auto",
              height: "60px",
              whiteSpace: "nowrap",
            }}
            variant="outlined"
            onClick={handleProveedorClick}
          >
            Music-DJ-World
          </Button>

          <Button
            sx={{
              backgroundColor: "rgba(255, 255, 255, 0.5)",
              color: "white",
              borderColor: "black",
              minWidth: "300px",
              width: "auto",
              height: "60px",
              whiteSpace: "nowrap",
            }}
            variant="outlined"
            onClick={handleUsuarioClick}
          >
            Music-Usuario-World
          </Button>
        </div>
        <Typography variant="caption" color="white" style={{ width: "auto" }}>
          En World Music, nuestro "Music-DJ-World" es tu maestro de ceremonias
          musical, y nuestros "Music-Usuario-World" son los oyentes más exigentes. Escucha
          la diferencia con nosotros.
        </Typography>
      </Box>

      {showCard && (
        <div
          style={{
            borderRadius: "20px",
            color: "white",
            position: "fixed",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "90%",
            height: "90%",
            margin: "auto",
            boxShadow: "0px 0px 100px rgba(0, 0, 0, 1 )",
          }}
        >
          <Box
            sx={{
              backgroundImage: `url(${CardImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              height: "90%",
              width: "90%",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              padding: "1rem",
              borderRadius: "10px",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Button
              onClick={handleCloseClick}
              style={{
                position: "absolute",
                top: "10px",
                right: "35px",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "20px",
                color: "white",
              }}
            >
              &#x2716;
            </Button>
            <div style={{ flex: 1, marginRight: "1rem", marginTop: 10 }}>
              <InputLabel sx={{ color: "white", mt: 2 }}>Nombre</InputLabel>
              <TextField
                placeholder="Nombre"
                fullWidth
                variant="outlined"
                size="small"
                required
                sx={{ bgcolor: "Window" }}
                value={userFirstName}
                onChange={(e) => setUserFirstName(e.target.value)}
                autoComplete="off"
              />

              <InputLabel sx={{ color: "white", mt: 1 }}>Apellido</InputLabel>
              <TextField
                placeholder="Apellido"
                fullWidth
                variant="outlined"
                size="small"
                required
                sx={{ bgcolor: "Window" }}
                value={userLastName}
                onChange={(e) => setUserLastName(e.target.value)}
                autoComplete="off"
              />

              <InputLabel sx={{ color: "white", mt: 1 }}>Edad</InputLabel>
              <TextField
                placeholder="Edad"
                fullWidth
                variant="outlined"
                size="small"
                required
                sx={{ bgcolor: "Window" }}
                value={userAge}
                onChange={(e) => setUserAge(e.target.value)}
                autoComplete="off"
              />
              <InputLabel sx={{ color: "white", mt: 1 }}>
                Numero de Contacto
              </InputLabel>
              <TextField
                placeholder="Número de Contacto"
                fullWidth
                variant="outlined"
                size="small"
                required
                sx={{ bgcolor: "Window" }}
                value={userContactNumber}
                onChange={(e) => setUserContactNumber(e.target.value)}
                autoComplete="off"
              />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  backgroundColor: "rgba(0, 0, 0, 0.7)",
                  borderRadius: "5px",
                  marginTop: "30px",
                  height: "200px",
                }}
              >
                <Typography
                  variant="h5"
                  component="div"
                  align="center"
                  color="white"
                  marginTop={"90px"}
                  marginRight={"40px"}
                >
                  Tu Avatar
                </Typography>
                <Avatar
                  alt="Avatar"
                  src={customAvatarUrl}
                  sx={{
                    width: 150,
                    height: 150,
                    marginTop: "25px",
                  }}
                />
              </Box>
            </div>
            <div style={{ flex: 1, marginTop: 10, overflowX: "auto" }}>
              {/* Contenedor para permitir el desplazamiento horizontal */}
              <div style={{ display: "flex", flexDirection: "column" }}>
                <InputLabel sx={{ color: "white", mt: 2 }}>Email</InputLabel>
                <TextField
                  placeholder="Email"
                  fullWidth
                  variant="outlined"
                  size="small"
                  required
                  sx={{ bgcolor: "Window" }}
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  autoComplete="off"
                  type="email"
                />

                <InputLabel sx={{ color: "white", mt: 1 }}>
                  Ingrese una URL para tu Avatar de Presentación
                </InputLabel>
                <TextField
                  placeholder="URL de la Imagen de Avatar"
                  fullWidth
                  variant="outlined"
                  size="small"
                  required
                  sx={{ bgcolor: "Window" }}
                  value={customAvatarUrl}
                  onChange={(e) => setCustomAvatarUrl(e.target.value)}
                  autoComplete="off"
                />

                <InputLabel sx={{ color: "white", mt: 1 }}>
                  Ingrese una Contraseña
                </InputLabel>
                <TextField
                  placeholder="Contraseña"
                  fullWidth
                  variant="outlined"
                  size="small"
                  required
                  sx={{ bgcolor: "Window" }}
                  value={userPassword}
                  onChange={(e) => setUserPassword(e.target.value)}
                  type="password"
                  autoComplete="off"
                />

                <InputLabel sx={{ color: "white", mt: 1 }}>
                  Género Musical de Referencia
                </InputLabel>
                <Select
                  sx={{ bgcolor: "white" }}
                  value={genderPreference}
                  onChange={(e) => setGenderPreference(e.target.value)}
                  fullWidth
                >
                  <MenuItem value="">Seleccionar Género</MenuItem>
                  {musicalGenres.map((genre, index) => (
                    <MenuItem key={index} value={genre}>
                      {genre}
                    </MenuItem>
                  ))}
                </Select>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{
                    minWidth: "300px",
                    width: "auto",
                    height: "60px",
                    whiteSpace: "nowrap",
                    ml: 12,
                    mb: -7,
                    position: "absolute",
                    bottom: "170px",
                  }}
                  onClick={handleSubmit}
                >
                  Regístrarte
                </Button>
              </div>
            </div>
          </Box>
        </div>
      )}

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        PaperProps={{
          sx: {
            backgroundColor: dialogBackgroundColor, // Cambia el color de fondo de la ventana de diálogo
          },
        }}
      >
        <DialogTitle sx={{ color: dialogTextColor }}>{dialogTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText
            sx={{
              fontSize: "1.5rem", // Tamaño de fuente más grande
              fontWeight: "bold", // Letras en negrita
            }}
          >
            {cardText}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenDialog(false)}
            color="primary"
            sx={{ color: "white" }}
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default UserSupplierRegistration;

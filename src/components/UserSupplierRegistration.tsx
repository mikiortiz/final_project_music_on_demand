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
import { fetchRandomUserData } from "../services/Api";

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

  const handleProveedorClick = async () => {
    setShowCard(true);

    const userData = await fetchRandomUserData();
    if (userData) {
      setUserEmail(userData.email);
      setUserFirstName(userData.name.first);
      setUserLastName(userData.name.last);
      setUserAge(userData.dob.age);
      setUserContactNumber(userData.cell);
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

      if (userContactNumber === "" || userContactNumber.length < 6 ) {
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
      setCardText("Registrado éxitosamente");
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
          position: "absolute",
          top: "20px",
          width: "200px",
        }}
      />
      <Box
        sx={{
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          marginTop: "250px",
          width: "30%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
        }}
      >
        <Typography variant="h4" color="white">
          Regístrate como
        </Typography>
        <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
          <Button
            sx={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
            variant="outlined"
            color="primary"
            onClick={handleProveedorClick}
          >
            Proveedor
          </Button>
          <Button
            sx={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
            variant="outlined"
            color="primary"
            onClick={handleUsuarioClick}
          >
            Usuario
          </Button>
        </div>
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
              <InputLabel sx={{ color: "white" }}>Nombre</InputLabel>
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

              <InputLabel sx={{ color: "white" }}>Apellido</InputLabel>
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

              <InputLabel sx={{ color: "white" }}>Edad</InputLabel>
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

              <InputLabel sx={{ color: "white" }}>
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
            <div style={{ flex: 1, marginTop: 10 }}>
              <InputLabel sx={{ color: "white" }}>Email</InputLabel>
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

              <InputLabel sx={{ color: "white" }}>
                Ingresa una URL para tu Avatar de Presentación
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

              <InputLabel sx={{ color: "white" }}>
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

              <InputLabel sx={{ color: "white" }}>
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
                sx={{ mt: 5, ml: 20 }}
                onClick={handleSubmit}
              >
                Regístrarte
              </Button>
            </div>
          </Box>
        </div>
      )}

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>{dialogTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText>{cardText}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default UserSupplierRegistration;

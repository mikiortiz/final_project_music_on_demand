import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addUser } from "../redux/reducers/RegisteredFormSlice";
import CardImageUsers from "../assets/images/CardImageUsers.png";
import {
  Button,
  TextField,
  Typography,
  Avatar,
  Select,
  MenuItem,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Box,
} from "@mui/material";
import { fetchRandomUserData } from "../services/ApiUsers";

type UserRegistrationFormProps = {
  onClose: () => void;
};

function UserRegistrationForm({ onClose }: UserRegistrationFormProps) {
  const dispatch = useDispatch();

  const [userEmail, setUserEmail] = useState("");
  const [userFirstName, setUserFirstName] = useState("");
  const [userLastName, setUserLastName] = useState("");
  const [userAge, setUserAge] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [genderPreference, setGenderPreference] = useState("");
  const [customAvatarUrl, setCustomAvatarUrl] = useState("");
  const [userContactNumber, setUserContactNumber] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogText, setDialogText] = useState("");
  const [dialogBackgroundColor, setDialogBackgroundColor] = useState("white");
  const [dialogTextColor, setDialogTextColor] = useState("black");

  useEffect(() => {
    const loadRandomUserData = async () => {
      const userData = await fetchRandomUserData();
      if (userData) {
        setUserEmail(userData.email);
        setUserFirstName(userData.name.first);
        setUserLastName(userData.name.last);
        setUserAge(userData.dob.age);
        setUserContactNumber(userData.cell);
        setCustomAvatarUrl(userData.picture.large);
      }
    };

    loadRandomUserData();
  }, []);

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

  const handleSubmit = () => {
    if (
      userEmail &&
      userAge &&
      userPassword &&
      genderPreference &&
      customAvatarUrl
    ) {
      if (!isAdult()) {
        setDialogTitle("Error de Registro");
        setDialogText("Debes ser Mayor de 18 Años para Registrarte.");
        setDialogBackgroundColor("white");
        setDialogTextColor("black");
        setShowDialog(true);
        return;
      }

      if (userFirstName === "") {
        setDialogTitle("Error de Registro");
        setDialogText("Nombre es un campo obligatorio.");
        setDialogBackgroundColor("white");
        setDialogTextColor("black");
        setShowDialog(true);
        return;
      }

      if (userLastName === "") {
        setDialogTitle("Error de Registro");
        setDialogText("Apellido es un campo obligatorio.");
        setDialogBackgroundColor("white");
        setDialogTextColor("black");
        setShowDialog(true);
        return;
      }

      if (userContactNumber === "" || userContactNumber.length < 6) {
        setDialogTitle("Error de Registro");
        setDialogText("Número de Contacto es inválido.");
        setDialogBackgroundColor("white");
        setDialogTextColor("black");
        setShowDialog(true);
        return;
      }

      if (userPassword.length < 4) {
        setDialogTitle("Error de Registro");
        setDialogText("La Contraseña debe tener al menos 4 caracteres.");
        setDialogBackgroundColor("white");
        setDialogTextColor("black");
        setShowDialog(true);
        return;
      }

      if (!userEmail.includes("@")) {
        setDialogTitle("Error de Registro");
        setDialogText("Dirección de Correo Electrónico es inválida.");
        setDialogBackgroundColor("white");
        setDialogTextColor("black");
        setShowDialog(true);
        return;
      }

      if (!isValidURL(customAvatarUrl)) {
        setDialogTitle("Error de Registro");
        setDialogText("La URL de la imagen de avatar no es válida.");
        setDialogBackgroundColor("white");
        setDialogTextColor("black");
        setShowDialog(true);
        return;
      }

      const musicUserData = {
        userEmail,
        userFirstName,
        userLastName,
        userAge,
        userPassword,
        genderPreference,
        customAvatarUrl,
        userContactNumber,
      };

      dispatch(addUser(musicUserData));

      setUserEmail("");
      setUserFirstName("");
      setUserLastName("");
      setUserAge("");
      setUserPassword("");
      setGenderPreference("");
      setCustomAvatarUrl("");
      setUserContactNumber("");
      setDialogText("Registrado exitosamente");
      setDialogTitle("Éxito");
      setDialogBackgroundColor("green");
      setDialogTextColor("white");
      setShowDialog(true);
    } else {
      setDialogTitle("Error");
      setDialogText("Por favor, completa todos los campos obligatorios.");
      setDialogBackgroundColor("white");
      setDialogTextColor("black");
      setShowDialog(true);
    }
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
  };

  const handleCloseForm = () => {
    setShowDialog(false);
    onClose();
  };

  return (
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
      <Dialog
        open={showDialog}
        onClose={() => setShowDialog(false)}
        PaperProps={{
          sx: {
            backgroundColor: dialogBackgroundColor,
          },
        }}
      >
        <DialogTitle sx={{ color: dialogTextColor }}>{dialogTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText
            sx={{
              fontSize: "1.5rem",
              fontWeight: "bold",
            }}
          >
            {dialogText}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => handleCloseDialog()}
            color="primary"
            sx={{ color: "black" }}
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

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
            backgroundImage: `url(${CardImageUsers})`,
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
            onClick={handleCloseForm}
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
              Número de Contacto
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
            <div
              style={{
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
            </div>
          </div>
          <div style={{ flex: 1, marginTop: 10, overflowX: "auto" }}>
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
                Ingrese una URL para su Avatar de Presentación
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
                Género Musical de Referencia
              </InputLabel>
              <Select
                sx={{
                  bgcolor: "white",
                  paddingY: "4px", // Ajusta el padding vertical según tus preferencias
                  height: "40px",
                }}
                value={genderPreference}
                onChange={(e) => setGenderPreference(e.target.value)}
                fullWidth
              >
                <MenuItem
                  value=""
                  sx={{
                    paddingY: "4px", // Ajusta el padding vertical según tus preferencias
                    height: "40px",
                  }}
                >
                  Seleccionar Género
                </MenuItem>
                {musicalGenres.map((genre, index) => (
                  <MenuItem key={index} value={genre}>
                    {genre}
                  </MenuItem>
                ))}
              </Select>
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
                Regístrate
              </Button>
            </div>
          </div>
        </Box>
      </div>
    </div>
  );
}

export default UserRegistrationForm;

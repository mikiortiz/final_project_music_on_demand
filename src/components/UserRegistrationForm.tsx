import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/model/RootStateTypes";
import { addUser } from "../redux/reducers/RegisteredFormSlice";
import CardImageUsers from "../../public/images/CardImageUsers.png";
import {
  Button,
  TextField,
  Typography,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Box,
  FormControl,
} from "@mui/material";

import { fetchRandomUserData } from "../services/ApiUsers";
import { UserData } from "../redux/model/UserData";

const UserRegistrationForm = ({ onClose }: { onClose: () => void }) => {
  // Obtenemos la función de despacho de Redux
  const dispatch = useDispatch();
  // Estados locales para gestionar datos del formulario y la interfaz de usuario
  const [userEmail, setUserEmail] = useState("");
  const [userFirstName, setUserFirstName] = useState("");
  const [userLastName, setUserLastName] = useState("");
  const [userAge, setUserAge] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [customUserAvatarUrl, setCustomUserAvatarUrl] = useState("");
  const [userContactNumber, setUserContactNumber] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogText, setDialogText] = useState("");
  const [dialogBackgroundColor, setDialogBackgroundColor] = useState("white");
  const [dialogTextColor, setDialogTextColor] = useState("black");
  
  const [openCardDialog, setOpenCardDialog] = useState(false);
  // Efecto de carga de datos aleatorios
  useEffect(() => {
    const loadRandomUserData = async () => {
      const userData = await fetchRandomUserData();
      if (userData) {
        console.log(userData), setUserEmail(userData.email);
        setUserFirstName(userData.name.first);
        setUserLastName(userData.name.last);
        setUserAge(userData.dob.age);
        setUserContactNumber(userData.cell);
        setCustomUserAvatarUrl(userData.picture.large);
      }
    };

    loadRandomUserData();
  }, []);
  // Selectores de datos del estado global de Redux
  const registeredSuppliers = useSelector(
    (state: RootState) => state.registered.DjsUsers
  );
  const registeredUsers = useSelector(
    (state: RootState) => state.registered.MusicUsers
  );
  // Verificaciones
  const isUserAdult = () => {
    return parseInt(userAge) >= 18;
  };

  const isValidAvatarURL = (url: string) => {
    const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
    return urlPattern.test(url);
  };
  //Función que maneja el envío del formulario
  const handleSubmitFormUsers = () => {
    const isEmailUsed =
    registeredSuppliers &&
    registeredSuppliers.some((supplier: { userEmail: string }) => supplier.userEmail === userEmail) ||
    (registeredUsers && registeredUsers.some((user: { userEmail: string }) => user.userEmail === userEmail));

    if (isEmailUsed) {
      setDialogTitle("Error de Registro");
      setDialogText("Este correo electrónico ya está registrado, por favor, elija otro correo electrónico.");
      setDialogBackgroundColor("white");
      setDialogTextColor("black");
      setShowDialog(true);
      return;
    }
    if (userEmail && userAge && userPassword && customUserAvatarUrl) {
      // Validaciones adicionales del formulario
      if (!isUserAdult()) {
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
        setDialogText("Emai Existente, Verifique su correo electronico");
        setDialogBackgroundColor("white");
        setDialogTextColor("black");
        setShowDialog(true);
        return;
      }

      if (!isValidAvatarURL(customUserAvatarUrl)) {
        setDialogTitle("Error de Registro");
        setDialogText("La URL de la imagen de avatar no es válida.");
        setDialogBackgroundColor("white");
        setDialogTextColor("black");
        setShowDialog(true);
        return;
      }
      // Creación del objeto con los datos del usuario de tipo UserData
      const musicUserData: UserData = {
        userEmail,
        userFirstName,
        userLastName,
        userAge,
        userPassword,
        customUserAvatarUrl,
        userContactNumber,
        selectedGenres: [],
      };
      // Despachamos acción para agregar un usuario
      dispatch(addUser(musicUserData));
      // Reestablecemoslos datos locales y muestra de mensajes
      setUserEmail("");
      setUserFirstName("");
      setUserLastName("");
      setUserAge("");
      setUserPassword("");
      setCustomUserAvatarUrl("");
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
    if (dialogTitle === "Éxito") {
      onClose();
    }
  };

  const handleCloseCardDialog = () => {
    setOpenCardDialog(false);
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
          <FormControl
            fullWidth
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "flex-start",
              gap: "1rem",
            }}
          >
            <div style={{ flex: "1", marginTop: "-15px" }}>
              <Typography sx={{ color: "white", mt: 2 }}>Nombre</Typography>
              <TextField
                placeholder="Nombre"
                fullWidth
                variant="outlined"
                size="small"
                required
                sx={{ bgcolor: "Window", borderRadius: "10px" }}
                value={userFirstName}
                onChange={(e) => setUserFirstName(e.target.value)}
                autoComplete="off"
              />
              <Typography sx={{ color: "white", mt: 1 }}>Apellido</Typography>
              <TextField
                placeholder="Apellido"
                fullWidth
                variant="outlined"
                size="small"
                required
                sx={{ bgcolor: "Window", borderRadius: "10px" }}
                value={userLastName}
                onChange={(e) => setUserLastName(e.target.value)}
                autoComplete="off"
              />
              <Typography sx={{ color: "white", mt: 1 }}>Edad</Typography>
              <TextField
                placeholder="Edad"
                fullWidth
                variant="outlined"
                size="small"
                required
                sx={{ bgcolor: "Window", borderRadius: "10px" }}
                value={userAge}
                onChange={(e) => setUserAge(e.target.value)}
                autoComplete="off"
              />
              <Typography sx={{ color: "white", mt: 1 }}>
                Número de Contacto
              </Typography>
              <TextField
                placeholder="Número de Contacto"
                fullWidth
                variant="outlined"
                size="small"
                required
                sx={{ bgcolor: "Window", borderRadius: "10px" }}
                value={userContactNumber}
                onChange={(e) => setUserContactNumber(e.target.value)}
                autoComplete="off"
              />
              <div
                style={{
                  width: "100%",
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
                  src={customUserAvatarUrl}
                  sx={{
                    width: 150,
                    height: 150,
                    marginTop: "25px",
                  }}
                />
              </div>
            </div>

            <div style={{ flex: "1" }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                <Typography sx={{ color: "white", mb: -2 }}>Email</Typography>
                <TextField
                  placeholder="Email"
                  fullWidth
                  variant="outlined"
                  size="small"
                  required
                  sx={{ bgcolor: "Window", borderRadius: "10px" }}
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  autoComplete="off"
                  type="email"
                />
                <Typography sx={{ color: "white", mb: -2 }}>
                  Ingrese una URL para su Avatar de Presentación
                </Typography>
                <TextField
                  placeholder="URL de la Imagen de Avatar"
                  fullWidth
                  variant="outlined"
                  size="small"
                  required
                  sx={{ bgcolor: "Window", borderRadius: "10px" }}
                  value={customUserAvatarUrl}
                  onChange={(e) => setCustomUserAvatarUrl(e.target.value)}
                  autoComplete="off"
                />

                <Typography sx={{ color: "white", mb: -2 }}>
                  Ingrese una Contraseña
                </Typography>
                <TextField
                  placeholder="Contraseña"
                  fullWidth
                  variant="outlined"
                  size="small"
                  required
                  sx={{ bgcolor: "Window", borderRadius: "10px" }}
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
                    borderRadius: "10px",
                    mt: 1,
                    width: "auto",
                    height: "60px",
                  }}
                  onClick={handleSubmitFormUsers}
                >
                  Regístrate
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{
                    borderRadius: "10px",
                    minWidth: "300px",
                    width: "100%",
                    height: "60px",
                    whiteSpace: "nowrap",
                    ml: 0,
                    mt: 2,
                    position: "relative",
                    bottom: 0,
                  }}
                  onClick={handleCloseForm}
                >
                  Volver
                </Button>
              </div>
            </div>

            <Dialog
              open={showDialog}
              onClose={() => setShowDialog(false)}
              PaperProps={{
                sx: {
                  backgroundColor: dialogBackgroundColor,
                },
              }}
            >
              <DialogTitle sx={{ color: dialogTextColor }}>
                {dialogTitle}
              </DialogTitle>
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
                  onClick={handleCloseDialog}
                  color="primary"
                  sx={{ color: "black" }}
                >
                  Cerrar
                </Button>
              </DialogActions>
            </Dialog>

            <Dialog
              open={openCardDialog}
              onClose={handleCloseCardDialog}
              PaperProps={{
                sx: {
                  backgroundColor: dialogBackgroundColor,
                },
              }}
            >
              <DialogTitle sx={{ color: dialogTextColor }}>
                {dialogTitle}
              </DialogTitle>
              <DialogContent>
                <DialogContentText
                  sx={{
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                  }}
                >
                  
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={handleCloseCardDialog}
                  color="primary"
                  sx={{ color: "black" }}
                >
                  Cerrar
                </Button>
              </DialogActions>
            </Dialog>
          </FormControl>
        </Box>
      </div>
    </div>
  );
};

export default UserRegistrationForm;

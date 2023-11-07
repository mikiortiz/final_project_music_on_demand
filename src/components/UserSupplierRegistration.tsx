import { useState } from "react";
import fondo from "/images/Fondo.png";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Typography,
  FormControl,
  Grid,
} from "@mui/material";
import CardImage from "/images/CardImageSupplier.png";
import { Box } from "@mui/system";
import logomusic from "/images/Logomusic.png";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../model/RootStateTypes";
import { addSupplier } from "../redux/reducers/RegisteredFormSlice";
import Avatar from "@mui/material/Avatar";
import { fetchRandomUserData } from "../services/ApiUsers";
import UserRegistrationForm from "./UserRegistrationForm";
import LoginForm from "./LoginForm";

const UserSupplierRegistration = () => {
  const [showUserForm, setShowUserForm] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userFirstName, setUserFirstName] = useState("");
  const [userLastName, setUserLastName] = useState("");
  const [userAge, setUserAge] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [customAvatarUrl, setCustomAvatarUrl] = useState("");
  const [userContactNumber, setUserContactNumber] = useState("");
  const [cardText, setCardText] = useState("");

  const [openDialog, setOpenDialog] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogBackgroundColor, setDialogBackgroundColor] = useState("white");
  const [dialogTextColor, setDialogTextColor] = useState("black");

  const [showLoginForm, setShowLoginForm] = useState(false);

  const dispatch = useDispatch();

  const registeredSuppliers = useSelector(
    (state: RootState) => state.registered.DjsUsers
  );

  const isSupplierAdult = () => {
    return parseInt(userAge) >= 18;
  };
  const isValidAvatarURL = (url: string) => {
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
      setCustomAvatarUrl(userData.picture.large);
    }
  };

  const handleUsuarioClick = () => {
    setShowCard(false);
    setShowUserForm(true);
  };

  const handleCloseClick = () => {
    setShowCard(false);
    setShowUserForm(false);
  };

  const handleSubmitFormSuppliers = () => {
    const isEmailUsed =
      registeredSuppliers &&
      registeredSuppliers.some((supplier) => supplier.userEmail === userEmail);

    if (isEmailUsed) {
      setDialogTitle("Error de Registro");
      setCardText(
        "Este correo electrónico ya está registrado. Por favor, ingrese otro correo electrónico."
      );
      setOpenDialog(true);
      return;
    }

    if (userEmail && userAge && userPassword && customAvatarUrl) {
      if (!userEmail.includes("@")) {
        setDialogTitle("Error de Registro");
        setCardText("Dirección de Correo Electrónico Invalido.");
        setOpenDialog(true);
        return;
      }

      if (!isSupplierAdult()) {
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

      if (!isValidAvatarURL(customAvatarUrl)) {
        setDialogTitle("Error de Registro");
        setCardText(
          "La URL de la imagen de avatar no tiene un formato válido."
        );
        setOpenDialog(true);
        return;
      }

      const newSupplier = {
        userEmail,
        userFirstName,
        userLastName,
        userAge,
        userPassword,
        customAvatarUrl,
        userContactNumber,
      };

      dispatch(addSupplier(newSupplier));

      setUserEmail("");
      setUserFirstName("");
      setUserLastName("");
      setUserAge("");
      setUserPassword("");
      setCustomAvatarUrl("");
      setUserContactNumber("");
      setCardText("Registrado éxitosamente");

      setDialogTitle("Éxito");
      setDialogBackgroundColor("green");
      setDialogTextColor("white");
      setOpenDialog(true);
    } else {
      setDialogTitle("Error");
      setCardText("Por favor, completa todos los campos obligatorios.");
      setOpenDialog(true);
    }
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);

    if (dialogTitle === "Éxito") {
      setShowUserForm(false);
      setShowCard(false);
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
          top: "2px",
          width: "200px",
        }}
      />

      <Box
        sx={{
          borderRadius: "10px",
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          width: "90%",
          display: "flex",

          justifyContent: "center",
          padding: "15px",
          maxWidth: "500px",
          margin: "0 auto",
          position: "absolute",
          top: "67%",
          transform: "translateY(-50%)",
        }}
      >
        <Grid container justifyContent="center">
          <Grid item xs={12} sm={12} md={12}>
            <Button
              onClick={() => setShowLoginForm(true)}
              variant="outlined"
              color="primary"
              fullWidth
              sx={{
                height: 50,
                backgroundColor: "rgba(0, 128, 255, 0.5)",
                color: "white",
                borderColor: "black",
              }}
            >
              Login
            </Button>
          </Grid>
          {showLoginForm && (
            <LoginForm onClose={() => setShowLoginForm(false)} />
          )}

          <Typography variant="h4" color="white">
            Te Regístraras como
          </Typography>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              marginTop: "10px",
              marginBottom: "5px",
            }}
          >
            <Button
              sx={{
                backgroundColor: "rgba(0, 0, 0, 0.7)",
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
                backgroundColor: "rgba(0, 0, 0, 0.7)",
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
          <Grid item xs={12} sm={12} md={12}>
            <Typography
              variant="caption"
              color="white"
              sx={{
                width: "auto",
                fontSize: "1.2rem",
                textAlign: "center",
                lineHeight: "1.2",
              }}
            >
              En World Music, nuestro "Music-DJ-World" es tu maestro de
              ceremonias musical, y nuestros "Music-Usuario-World" son los
              oyentes más exigentes. Escucha la diferencia con nosotros.
            </Typography>
          </Grid>
        </Grid>
      </Box>
      {showCard && (
        <Grid
          container
          item
          xs={12}
          sm={12}
          md={12}
          style={{
            borderRadius: "20px",
            color: "white",
            position: "fixed",
            justifyContent: "center",
            alignItems: "center",
            width: "90%",
            height: "95%",
            margin: "auto",
            boxShadow: "0px 0px 100px rgba(0, 0, 0, 1 )",
          }}
        >
          <Grid
            item
            xs={12}
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
            }}
          >
            <Grid item xs={6} sm={6} md={6} sx={{ marginRight: 1 }}>
              <FormControl fullWidth>
                <Typography sx={{ color: "white" }}>Nombre</Typography>
                <TextField
                  placeholder="Nombre"
                  variant="outlined"
                  size="small"
                  required
                  sx={{ bgcolor: "white", borderRadius: "10px" }}
                  value={userFirstName}
                  onChange={(e) => setUserFirstName(e.target.value)}
                  autoComplete="off"
                />

                <Typography sx={{ color: "white", mt: 1 }}>Apellido</Typography>
                <TextField
                  placeholder="Apellido"
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
                  variant="outlined"
                  size="small"
                  required
                  sx={{ bgcolor: "Window", borderRadius: "10px" }}
                  value={userAge}
                  onChange={(e) => setUserAge(e.target.value)}
                  autoComplete="off"
                />

                <Typography sx={{ color: "white", mt: 1 }}>
                  Numero de Contacto
                </Typography>
                <TextField
                  placeholder="Número de Contacto"
                  variant="outlined"
                  size="small"
                  required
                  sx={{ bgcolor: "Window", borderRadius: "10px" }}
                  value={userContactNumber}
                  onChange={(e) => setUserContactNumber(e.target.value)}
                  autoComplete="off"
                />

                <Grid
                  container
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    backgroundColor: "rgba(0, 0, 0, 0.7)",
                    borderRadius: "5px",
                    marginTop: "5px",
                  }}
                >
                  <Typography
                    variant="h5"
                    align="center"
                    color="white"
                    marginTop={9}
                    marginRight={"40px"}
                  >
                    Tu Avatar
                  </Typography>
                  <Grid item xs={12} sm={4} md={4}>
                    <Avatar
                      alt="Avatar"
                      src={customAvatarUrl}
                      sx={{
                        width: 150,
                        height: 150,
                        marginTop: "5px",
                      }}
                    />
                  </Grid>
                </Grid>
              </FormControl>
            </Grid>

            <Grid item xs={6} sm={6} md={6} sx={{ marginLeft: 1 }}>
              <FormControl
                fullWidth
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                <Typography sx={{ color: "white" }}>
                  Ingrese una URL para su Avatar de Presentación
                </Typography>
                <TextField
                  placeholder="URL de la Imagen de Avatar"
                  fullWidth
                  variant="outlined"
                  size="small"
                  required
                  sx={{ bgcolor: "Window", borderRadius: "10px", mt: -2 }}
                  value={customAvatarUrl}
                  onChange={(e) => setCustomAvatarUrl(e.target.value)}
                  autoComplete="off"
                />

                <Typography sx={{ color: "white", mt: -1 }}>Email</Typography>
                <TextField
                  placeholder="Email"
                  fullWidth
                  variant="outlined"
                  size="small"
                  required
                  sx={{ bgcolor: "Window", borderRadius: "10px", mt: -2 }}
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  autoComplete="off"
                  type="email"
                />

                <Typography sx={{ color: "white", mt: -1 }}>
                  Ingrese una Contraseña
                </Typography>
                <TextField
                  placeholder="Contraseña"
                  fullWidth
                  variant="outlined"
                  size="small"
                  required
                  sx={{ bgcolor: "Window", borderRadius: "10px", mt: -2 }}
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
                    mt: 2,
                    width: "auto",
                    height: "60px",
                  }}
                  onClick={handleSubmitFormSuppliers}
                >
                  Regístrate
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{
                    borderRadius: "10px",
                    mt: 2,
                    width: "auto",
                    height: "60px",
                  }}
                  onClick={handleCloseClick}
                >
                  Volver
                </Button>
              </FormControl>
            </Grid>
          </Grid>
        </Grid>
      )}

      {showUserForm && (
        <UserRegistrationForm onClose={() => setShowUserForm(false)} />
      )}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
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
            {cardText}
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
    </div>
  );
};

export default UserSupplierRegistration;

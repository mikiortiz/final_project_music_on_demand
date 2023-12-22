import { useState } from "react";
import fondo from "/images/Fondo.png";
import { useFormik } from "formik";
import * as yup from "yup";
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
  Box,
  Avatar,
} from "@mui/material";
import CardImage from "/images/CardImageSupplier.png";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../model/RootStateTypes";
import { addSupplier } from "../redux/reducers/RegisteredFormSlice";
import logomusic from "/images/Logomusic.png";
import UserRegistrationForm from "./UserRegistrationForm";
import LoginForm from "./LoginForm";

const UserSupplierRegistration = () => {
  const [showUserForm, setShowUserForm] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogBackgroundColor, setDialogBackgroundColor] = useState("white");
  const [dialogTextColor, setDialogTextColor] = useState("");
  const [cardText, setCardText] = useState("");

  const dispatch = useDispatch();

  const registeredSuppliers = useSelector(
    (state: RootState) => state.registered.DjsUsers
  );

  const formik = useFormik({
    initialValues: {
      userEmail: "",
      userFirstName: "",
      userLastName: "",
      userAge: "",
      userPassword: "",
      customAvatarUrl: "",
      userContactNumber: "",
    },
    validationSchema: yup.object({
      userEmail: yup
        .string()
        .email("Ingresa un correo electrónico válido")
        .required("Correo electrónico es obligatorio"),
      userFirstName: yup.string().required("Nombre es obligatorio"),
      userLastName: yup.string().required("Apellido es obligatorio"),
      userAge: yup
        .number()
        .positive("La edad debe ser un número positivo")
        .integer("La edad debe ser un número entero")
        .required("Edad es obligatoria")
        .min(18, "Debes ser mayor de 18 años"),
      userPassword: yup
        .string()
        .min(4, "La contraseña debe tener al menos 4 caracteres")
        .required("Contraseña es obligatoria"),
      customAvatarUrl: yup
        .string()
        .url("Ingresa una URL válida")
        .required("URL de avatar es obligatoria"),
      userContactNumber: yup
        .string()
        .min(6, "El número de contacto debe tener al menos 6 caracteres")
        .required("Número de contacto es obligatorio"),
    }),
    onSubmit: (values) => {
      const isEmailUsed =
        registeredSuppliers &&
        registeredSuppliers.some(
          (supplier) => supplier.userEmail === values.userEmail
        );

      if (isEmailUsed) {
        setDialogTitle("Error de Registro");
        setCardText(
          "Este correo electrónico ya está registrado. Por favor, ingrese otro correo electrónico."
        );
        setOpenDialog(true);
        return;
      }

      if (!formik.isValid) {
        setDialogTitle("Error de Registro");
        setCardText("Por favor, completa todos los campos correctamente.");
        setOpenDialog(true);
        return;
      }

      
      const newSupplier = { ...values };
      
      dispatch(addSupplier(newSupplier));

      formik.resetForm();

      
      setCardText("Registrado éxitosamente");
      setDialogTitle("Éxito");
      setDialogBackgroundColor("green");
      setDialogTextColor("white");
      setOpenDialog(true);
    },
  });

  const handleProveedorClick = () => {
    setShowCard(true);
  };

  const handleUsuarioClick = () => {
    setShowCard(false);
    setShowUserForm(true);
  };

  const handleCloseClick = () => {
    setShowCard(false);
    setShowLoginForm(false);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);

    if (dialogTitle === "Éxito") {
      setShowLoginForm(false);
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
              <form onSubmit={formik.handleSubmit}>
                <FormControl fullWidth>
                  <Typography sx={{ color: "white" }}>Nombre</Typography>
                  <TextField
                    placeholder="Nombre"
                    variant="outlined"
                    size="small"
                    required
                    sx={{ bgcolor: "white", borderRadius: "10px" }}
                    {...formik.getFieldProps("userFirstName")}
                    autoComplete="off"
                    error={
                      formik.touched.userFirstName &&
                      Boolean(formik.errors.userFirstName)
                    }
                    helperText={
                      formik.touched.userFirstName &&
                      formik.errors.userFirstName
                    }
                  />

                  <Typography sx={{ color: "white", mt: 1 }}>
                    Apellido
                  </Typography>
                  <TextField
                    placeholder="Apellido"
                    variant="outlined"
                    size="small"
                    required
                    sx={{ bgcolor: "Window", borderRadius: "10px" }}
                    {...formik.getFieldProps("userLastName")}
                    autoComplete="off"
                    error={
                      formik.touched.userLastName &&
                      Boolean(formik.errors.userLastName)
                    }
                    helperText={
                      formik.touched.userLastName && formik.errors.userLastName
                    }
                  />

                  <Typography sx={{ color: "white", mt: 1 }}>Edad</Typography>
                  <TextField
                    placeholder="Edad"
                    variant="outlined"
                    size="small"
                    required
                    sx={{ bgcolor: "Window", borderRadius: "10px" }}
                    {...formik.getFieldProps("userAge")}
                    autoComplete="off"
                    error={
                      formik.touched.userAge && Boolean(formik.errors.userAge)
                    }
                    helperText={formik.touched.userAge && formik.errors.userAge}
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
                    {...formik.getFieldProps("userContactNumber")}
                    autoComplete="off"
                    error={
                      formik.touched.userContactNumber &&
                      Boolean(formik.errors.userContactNumber)
                    }
                    helperText={
                      formik.touched.userContactNumber &&
                      formik.errors.userContactNumber
                    }
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
                        src={formik.values.customAvatarUrl}
                        sx={{
                          width: 150,
                          height: 150,
                          marginTop: "5px",
                        }}
                      />
                    </Grid>
                  </Grid>
                </FormControl>
              </form>
            </Grid>

            <Grid item xs={6} sm={6} md={6} sx={{ marginLeft: 1 }}>
              <form onSubmit={formik.handleSubmit}>
                <FormControl
                  fullWidth
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                  }}
                >
                  <Typography sx={{ color: "white", mb: -4 }}>Email</Typography>
                  <TextField
                    placeholder="Email"
                    fullWidth
                    variant="outlined"
                    size="small"
                    sx={{ bgcolor: "Window", borderRadius: "10px", mt: 2 }}
                    {...formik.getFieldProps("userEmail")}
                    autoComplete="off"
                    error={
                      formik.touched.userEmail &&
                      Boolean(formik.errors.userEmail)
                    }
                    helperText={
                      formik.touched.userEmail && formik.errors.userEmail
                    }
                  />

                  <Typography sx={{ color: "white", mt: -1 }}>
                    Ingrese una URL para su Avatar de Presentación
                  </Typography>
                  <TextField
                    placeholder="URL de la Imagen de Avatar"
                    fullWidth
                    variant="outlined"
                    size="small"
                    sx={{ bgcolor: "Window", borderRadius: "10px", mt: -2 }}
                    {...formik.getFieldProps("customAvatarUrl")}
                    autoComplete="off"
                    error={
                      formik.touched.customAvatarUrl &&
                      Boolean(formik.errors.customAvatarUrl)
                    }
                    helperText={
                      formik.touched.customAvatarUrl &&
                      formik.errors.customAvatarUrl
                    }
                  />

                  <Typography sx={{ color: "white", mt: -1 }}>
                    Ingrese una Contraseña
                  </Typography>
                  <TextField
                    placeholder="Contraseña"
                    fullWidth
                    variant="outlined"
                    size="small"
                    sx={{ bgcolor: "Window", borderRadius: "10px", mt: -2 }}
                    {...formik.getFieldProps("userPassword")}
                    type="password"
                    autoComplete="off"
                    error={
                      formik.touched.userPassword &&
                      Boolean(formik.errors.userPassword)
                    }
                    helperText={
                      formik.touched.userPassword && formik.errors.userPassword
                    }
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
              </form>
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

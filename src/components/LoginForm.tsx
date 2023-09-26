import { useState } from "react";
import {
  Button,
  TextField,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { FormControl } from "@mui/material";
import { useSelector } from "react-redux";
import RootState from "../redux/model/RootStateTypes"; // Asegúrate de importar el tipo RootState adecuado

const LoginForm = ({ onClose }: { onClose: () => void }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [userType, setUserType] = useState("");

  const users = useSelector((state: RootState) => state.registered.MusicUsers);
  const suppliers = useSelector(
    (state: RootState) => state.registered.Suppliers
  );

  const handleLogin = () => {
    console.log( "Ingreso de usuario", users);
    console.log( "Ingreso de proveedor", suppliers);
    // Lógica de validación de credenciales
    const user =
      users &&
      users.find(
        (u: { userEmail: string; userPassword: string }) =>
          u.userEmail === email && u.userPassword === password
      );
    const supplier =
      suppliers &&
      suppliers.find(
        (s) => s.userEmail === email && s.userPassword === password
      );

    if (user) {
      setLoginSuccess(true);
      setUserType("Usuario");
    } else if (supplier) {
      setLoginSuccess(true);
      setUserType("Proveedor");
    } else {
      setLoginSuccess(false);
    }

    setShowDialog(true);
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
    setLoginSuccess(false);
  };

  const getDialogContent = () => {
    if (loginSuccess) {
      return (
        <DialogContent>
          <DialogContentText>
            ¡Inicio de sesión exitoso como {userType}!
          </DialogContentText>
        </DialogContent>
      );
    } else {
      return (
        <DialogContent>
          <DialogContentText>Usuario no Existente.</DialogContentText>
        </DialogContent>
      );
    }
  };

  return (
    <div
      style={{
        borderRadius: "10px",
        marginBottom: "300px",
        position: "fixed",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "650px",
        height: "700px",
        zIndex: 9999,
        backgroundColor: "rgba(0, 0, 0, 1)",
      }}
    >
      <Box
        sx={{
          marginTop: 1,
          borderRadius: "10px",
          width: "550px",
          height: "500px",
          padding: "1rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
          backgroundColor: "rgba(240, 240, 240, 1)",
        }}
      >
        <IconButton
          onClick={onClose}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          <CloseIcon />
        </IconButton>
        <Typography variant="h4" color="primary" gutterBottom>
          Iniciar Sesión
        </Typography>
        <FormControl style={{ width: "100%" }}>
          <Typography>Email</Typography>
          <TextField
            variant="outlined"
            fullWidth
            size="small"
            margin="normal"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ backgroundColor: "white", marginBottom: "1rem" }}
          />
          <Typography>Contraseña</Typography>
          <TextField
            variant="outlined"
            fullWidth
            size="small"
            margin="normal"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ backgroundColor: "white", marginBottom: "1rem" }}
          />
          <Button
            sx={{ mt: 3, height: "60px" }}
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleLogin}
          >
            Iniciar Sesión
          </Button>
          <Button
            variant="outlined"
            color="primary"
            fullWidth
            onClick={onClose}
            style={{ marginTop: 25, height: "60px" }}
          >
            Registrarse aquí
          </Button>
        </FormControl>
      </Box>

      <Dialog open={showDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {loginSuccess
            ? "Éxito de Inicio de Sesión"
            : "Error de Inicio de Sesión"}
        </DialogTitle>
        {getDialogContent()}
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default LoginForm;

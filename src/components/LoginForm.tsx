import React, { useState } from "react";
import { Button, TextField, Typography, Grid } from "@mui/material";
import { FormControl } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../model/RootStateTypes";
import { SupplierData } from "../model/SupplierData";
import { UserData } from "../model/UserData";
import { useNavigate } from "react-router-dom";

interface Props {
  onClose: () => void;
}

const LoginForm: React.FC<Props> = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const users = useSelector(
    (state: RootState) => state.registered.MusicUsers
  ) as UserData[];
  const suppliers = useSelector(
    (state: RootState) => state.registered.DjsUsers
  ) as SupplierData[];

  // función de inicio de sesión
  const handleLogin = () => {
    if (email.trim() === "" || password.trim() === "") {
      ShowWindowDialog("Login incompleto");
      return;
    }

    const user = users.find(
      (u) => u.userEmail === email && u.userPassword === password
    );
    const supplier = suppliers.find(
      (s) => s.userEmail === email && s.userPassword === password
    );

    if (user) {
      const userToStore = { ...user, userType: "user" };
      localStorage.setItem("currentUser", JSON.stringify(userToStore));

      navigate("/usermaphome");
    } else if (supplier) {
      const supplierToStore = { ...supplier, userType: "supplier" };
      localStorage.setItem("currentUser", JSON.stringify(supplierToStore));

      navigate("/supplierwelcome");
    } else {
      ShowWindowDialog("Los datos ingresados son incorrectos");
    }
  };

  const ShowWindowDialog = (mensaje: string) => {
    window.alert(mensaje);
  };

  return (
    <Grid
      item
      xs={12}
      style={{
        marginTop: "-225px",
        borderRadius: "10px",
        position: "fixed",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "580px",
        width: "900px",
        zIndex: 9999,
        backgroundColor: "rgba(0, 0, 0, 1)",
      }}
    >
      <Grid
        container
        item
        xs={10}
        sm={10}
        md={10}
        sx={{
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
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleLogin}
            style={{ marginTop: 3, height: "60px" }}
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
      </Grid>
    </Grid>
  );
};

export default LoginForm;

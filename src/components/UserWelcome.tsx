import React from "react";
import { UserData } from "../redux/model/UserData"; // Asegúrate de importar correctamente el tipo de datos

interface Props {
  UserData?: UserData; // Puede ser undefined, así que se define como opcional (?)
}

const UserWelcome: React.FC<Props> = ({ UserData }) => {
  // Verificar si supplierData está definido
  if (!UserData) {
    return <div>No hay datos del usuario</div>;
  }

  return (
    <div>
      <h1>Bienvenido, Proveedor</h1>
      <p>Nombre: {UserData.userFirstName} {UserData.userLastName}</p>
      <p>Edad: {UserData.userAge}</p>
      <p>Correo electrónico: {UserData.userEmail}</p>
      <p>Número de contacto: {UserData.userContactNumber}</p>
      <p>Preferencia de género: {UserData.selectedGenres}</p>
      {/* Otros datos del proveedor que desees mostrar */}
    </div>
  );
};

export default UserWelcome;

import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  List,
  ListItem,
  CardMedia,
  Grid,
  TextField,
  Button,
  Hidden,
} from "@mui/material";
import { eventTypes, EventType } from "../../model/EventTypes";
import { useLocation } from "react-router-dom";

interface ContractDetails {
  EventHours: string;
  EventDate: string;
  EventAddress: string;
  ClientFirstName: string;
  ClientLastName: string;
  eventName: string; // Agregado el campo eventName
}

const ContractList = () => {
  const location = useLocation();
  const selectedDj = location.state?.selectedDj;

  const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null);
  const [contractDetails, setContractDetails] = useState<ContractDetails>({
    EventHours: "",
    EventDate: "",
    EventAddress: "",
    ClientFirstName: "",
    ClientLastName: "",
    eventName: "", // Inicializado el campo eventName
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setContractDetails((prevDetails) => ({ ...prevDetails, [name]: value }));
  };

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Aquí puedes manejar la lógica para enviar los detalles del contrato
    // Incluye el nombre del evento y la información del DJ en los detalles del contrato
    if (selectedEvent && selectedDj) {
      const contractData = {
        ...contractDetails,
        eventName: selectedEvent.name,
        djInfo: {
          userFirstName: selectedDj.userFirstName,
          userLastName: selectedDj.userLastName,
          userEmail: selectedDj.userEmail,
          // Agrega otros campos de información del DJ según sea necesario
        },
      };
      console.log("Detalles del contrato:", contractData);
      // Puedes realizar una llamada a la API, enviar datos al servidor, etc.
    }
  };

  const handleEventSelect = (event: EventType) => {
    setSelectedEvent(event);
    setContractDetails({
      EventHours: "",
      EventDate: "",
      EventAddress: "",
      ClientFirstName: "",
      ClientLastName: "",
      eventName: event.name, // Actualizado el campo eventName al seleccionar un evento
    });
  };

  if (!selectedDj) {
    return <div>Selecciona un DJ para ver los detalles del contrato.</div>;
  }

  return (
    <div style={{ height: "100%", background: "rgba(0, 0, 0, 0.7)" }}>
      <AppBar position="static" color="transparent">
        <Toolbar>
          <Grid container alignItems="center">
            <CardMedia
              component="img"
              image={selectedDj.customAvatarUrl}
              alt={`Avatar de ${selectedDj.userFirstName} ${selectedDj.userLastName}`}
              style={{
                borderRadius: "50%",
                marginRight: "10px",
                width: 50,
                height: 50,
              }}
            />
            <Typography variant="h6">{`${selectedDj.userFirstName} ${selectedDj.userLastName}`}</Typography>
            <Typography variant="subtitle1" style={{ marginLeft: "20px" }}>
              {selectedDj.userEmail}
            </Typography>
          </Grid>
        </Toolbar>
      </AppBar>
      <List style={{ padding: "20px" }}>
        {selectedDj.selectedEvents?.map((event: EventType, index: number) => {
          const eventType = eventTypes.find(
            (type) => type.name === event.eventName
          );
          return (
            <ListItem
              key={`${event.eventName}-${index}`}
              style={{ marginBottom: "20px" }}
            >
              {eventType && eventType.image && (
                <CardMedia
                  component="img"
                  height="60"
                  image={eventType.image}
                  alt={event.eventName}
                  style={{
                    width: "60px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    marginRight: "20px",
                  }}
                />
              )}
              <div>
                <Typography variant="h6">{event.eventName}</Typography>
                <Typography>{`Precio: ${event.price}`}</Typography>
                <Typography>{`X Horas: ${event.hours}`}</Typography>

                {selectedEvent === event && (
                  // Formulario de contrato solo si el evento está seleccionado
                  <form onSubmit={handleFormSubmit}>
                    <Hidden>
                      {/* Campo oculto para el nombre del evento */}
                      <input
                        type="text"
                        name="eventName"
                        value={selectedEvent.name}
                        readOnly
                      />
                    </Hidden>
                    <TextField
                      label="Horas de contratación"
                      name="EventHours"
                      value={contractDetails.EventHours}
                      onChange={handleInputChange}
                      fullWidth
                      margin="normal"
                    />
                    <TextField
                      label="Fecha del evento"
                      name="EventDate"
                      value={contractDetails.EventDate}
                      onChange={handleInputChange}
                      fullWidth
                      margin="normal"
                    />
                    <TextField
                      label="Domicilio"
                      name="EventAddress"
                      value={contractDetails.EventAddress}
                      onChange={handleInputChange}
                      fullWidth
                      margin="normal"
                    />
                    <TextField
                      label="Nombre del cliente"
                      name="ClientFirstName"
                      value={contractDetails.ClientFirstName}
                      onChange={handleInputChange}
                      fullWidth
                      margin="normal"
                    />
                    <TextField
                      label="Apellido del cliente"
                      name="ClientLastName"
                      value={contractDetails.ClientLastName}
                      onChange={handleInputChange}
                      fullWidth
                      margin="normal"
                    />
                    <Button
                      type="submit"
                      variant="outlined"
                      color="primary"
                      style={{ marginTop: "10px" }}
                    >
                      Enviar Contrato
                    </Button>
                  </form>
                )}

                <Button
                  onClick={() => handleEventSelect(event)}
                  variant="outlined"
                  color="primary"
                  style={{ marginTop: "10px" }}
                >
                  Seleccionar Evento
                </Button>
              </div>
            </ListItem>
          );
        })}
      </List>
    </div>
  );
};

export default ContractList;

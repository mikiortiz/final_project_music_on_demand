import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  AppBar,
  Toolbar,
  Typography,
  List,
  ListItem,
  Grid,
  TextField,
  Button,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useLocation } from "react-router-dom";
import {
  setSelectedEvent,
  addContract,
} from "../../redux/reducers/ContractSlice";
import { eventTypes } from "../../model/EventTypes";
import { EventTypeContract } from "../../model/EventTypes";
import { RootState } from "../../model/RootStateTypes";

const ContractList: React.FC = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const selectedDj = location.state?.selectedDj;
  const { selectedEvent } = useSelector((state: RootState) => state.contract);

  const [contractDetails, setContractDetails] = useState({
    EventHours: "",
    EventDate: "",
    EventAddress: "",
    ClientFirstName: "",
    ClientLastName: "",
    eventName: "",
  });

  const [openDialog, setOpenDialog] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setContractDetails({ ...contractDetails, [name]: value });
  };

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (selectedEvent && selectedDj) {
      const hours = parseFloat(contractDetails.EventHours);
      const totalCost = selectedEvent.price * hours;

      const contractData = {
        ...contractDetails,
        eventName: selectedEvent.eventName,
        djInfo: {
          userFirstName: selectedDj.userFirstName,
          userLastName: selectedDj.userLastName,
          userEmail: selectedDj.userEmail,
        },
        totalCost: totalCost,
      };

      console.log("Detalles del contrato:", contractData);
      dispatch(addContract(contractData));
      setOpenDialog(false);
    }
  };

  const handleEventSelect = (event: EventTypeContract) => {
    dispatch(setSelectedEvent(event));
    setContractDetails({
      EventHours: "",
      EventDate: "",
      EventAddress: "",
      ClientFirstName: "",
      ClientLastName: "",
      eventName: event.eventName,
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  if (!selectedDj) {
    return <div>Selecciona un DJ para ver los detalles del contrato.</div>;
  }

  return (
    <div style={{ height: "100%", background: "rgba(0, 0, 0, 0.7)" }}>
      <AppBar position="static" color="transparent">
        <Toolbar>
          <Grid container alignItems="center">
            <Avatar
              alt={`Avatar de ${selectedDj.userFirstName} ${selectedDj.userLastName}`}
              src={selectedDj.customAvatarUrl}
            />
            <Typography variant="h6">{`${selectedDj.userFirstName} ${selectedDj.userLastName}`}</Typography>
            <Typography variant="subtitle1" style={{ marginLeft: "20px" }}>
              {selectedDj.userEmail}
            </Typography>
          </Grid>
        </Toolbar>
      </AppBar>
      <List style={{ padding: "20px" }}>
        {selectedDj.selectedEvents?.map(
          (event: EventTypeContract, index: number) => {
            const eventType = eventTypes.find(
              (type) => type.name === event.eventName
            );

            return (
              <ListItem
                key={`${event.eventName}-${index}`}
                style={{ marginBottom: "20px" }}
              >
                {eventType && eventType.image && (
                  <Avatar alt={event.eventName} src={eventType.image} />
                )}
                <div>
                  <Typography variant="h6">{event.eventName}</Typography>
                  <Typography>{`Precio: ${event.price}`}</Typography>
                  <Typography>{`X Horas: ${event.hours}`}</Typography>

                  {selectedEvent && selectedEvent === event && (
                    <Dialog open={openDialog} onClose={handleCloseDialog}>
                      <DialogTitle>Detalles del Contrato</DialogTitle>
                      <DialogContent>
                        <form onSubmit={handleFormSubmit}>
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
                          {/* Nuevo campo para mostrar el costo total */}
                          <TextField
                            label="Costo Total"
                            value={(selectedEvent && selectedEvent.price * parseFloat(contractDetails.EventHours)) || 0}
                            InputProps={{
                              readOnly: true,
                            }}
                            fullWidth
                            margin="normal"
                          />
                        </form>
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={handleCloseDialog} color="primary">
                          Cancelar
                        </Button>
                        <Button
                          type="submit"
                          variant="outlined"
                          color="primary"
                          onClick={handleFormSubmit}
                        >
                          Enviar Contrato
                        </Button>
                      </DialogActions>
                    </Dialog>
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
          }
        )}
      </List>
    </div>
  );
};

export default ContractList;

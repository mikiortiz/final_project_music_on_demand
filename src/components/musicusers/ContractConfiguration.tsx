import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  AppBar,
  Toolbar,
  Typography,
  List,
  Grid,
  Card,
  CardContent,
  Avatar,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import {
  setSelectedEvent,
  addContract,
} from "../../redux/reducers/ContractSlice";
import { eventTypes } from "../../model/EventTypes";
import { EventTypeContract } from "../../model/EventTypes";
import { RootState } from "../../model/RootStateTypes";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";

const startDate = dayjs("2023-01-01");
const endDate = dayjs();

const ContractConfiguration: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const selectedDj = location.state?.selectedDj;
  const { selectedEvent } = useSelector((state: RootState) => state.contract);
  const musicUser = useSelector((state: RootState) => state.userLogin.user);

  const [contractDetails, setContractDetails] = useState({
    EventHours: "",
    EventAddress: "",
    ClientFirstName: "",
    ClientLastName: "",
    eventName: "",
  });

  const [openDialog, setOpenDialog] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setContractDetails({ ...contractDetails, [name]: value });
  };

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (selectedEvent && selectedDj) {
      const hours = parseFloat(contractDetails.EventHours);

      if (hours < selectedEvent.hours) {
        setShowWarning(true);
        setWarningMessage(
          `Este contrato puede ser rechazado por DJ ${selectedDj.userFirstName} ${selectedDj.userLastName}. 
          Las horas ingresadas no están dentro del paquete estipulado (${selectedEvent.hours} HS X ${selectedEvent.price}). 
          ¿Deseas continuar?`
        );
        return;
      }

      const totalCost = (selectedEvent.price / selectedEvent.hours) * hours;

      const contractData = {
        ...contractDetails,
        EventDate: selectedDate ? selectedDate.format("DD/MM/YYYY") : "",
        eventName: selectedEvent.eventName,
        djInfo: {
          userImg: selectedDj.customAvatarUrl,
          userFirstName: selectedDj.userFirstName,
          userLastName: selectedDj.userLastName,
          userEmail: selectedDj.userEmail,
        },
        totalCost: totalCost,
      };

      dispatch(
        addContract({ email: musicUser.userEmail, contract: contractData })
      );

      setOpenDialog(false);
      setContractDetails({
        EventHours: "",
        EventAddress: "",
        ClientFirstName: "",
        ClientLastName: "",
        eventName: selectedEvent.eventName,
      });
    }
  };

  const handleReenviarContrato = () => {
    if (selectedEvent && selectedDj) {
      const hours = parseFloat(contractDetails.EventHours);

      const totalCost = (selectedEvent.price / selectedEvent.hours) * hours;

      const contractData = {
        ...contractDetails,
        EventDate: selectedDate ? selectedDate.format("DD/MM/YYYY") : "",
        eventName: selectedEvent.eventName,
        djInfo: {
          userImg: selectedDj.customAvatarUrl,
          userFirstName: selectedDj.userFirstName,
          userLastName: selectedDj.userLastName,
          userEmail: selectedDj.userEmail,
        },
        totalCost: totalCost,
      };

      dispatch(
        addContract({ email: musicUser.userEmail, contract: contractData })
      );

      setOpenDialog(false);
      setContractDetails({
        EventHours: "",
        EventAddress: "",
        ClientFirstName: "",
        ClientLastName: "",
        eventName: selectedEvent.eventName,
      });
      setShowWarning(false);
    }
  };

  const handleEventSelect = (event: EventTypeContract) => {
    dispatch(setSelectedEvent(event));
    setContractDetails({
      EventHours: "",

      EventAddress: "",
      ClientFirstName: "",
      ClientLastName: "",
      eventName: event.eventName,
    });
    setSelectedDate(null);

    setShowWarning(false);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setShowWarning(false);
    setOpenDialog(false);
  };

  if (!selectedDj) {
    return <div>Selecciona un DJ para ver los detalles del contrato.</div>;
  }

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0, 0, 0, 0.7)",
        color: "white",
        overflow: "auto",
      }}
    >
      <AppBar position="static" color="transparent">
        <Typography
          variant="h4"
          sx={{
            textAlign: "center",
            background: "rgba(0, 0, 0, 0.9)",
            fontWeight: "bold",
          }}
        >
          Dj Seleccionado
        </Typography>
        <Toolbar>
          <Grid
            container
            alignItems="center"
            justifyContent="space-between"
            sx={{ paddingLeft: "20px", paddingRight: "20px" }}
          >
            <Grid container item alignItems="center" xs={6}>
              <Avatar
                alt={`Avatar de ${selectedDj.userFirstName} ${selectedDj.userLastName}`}
                src={selectedDj.customAvatarUrl}
                sx={{
                  borderRadius: "5px",
                  height: 60,
                  width: 100,
                  marginRight: 2,
                }}
              />
              <Typography variant="h5">{`${selectedDj.userFirstName} ${selectedDj.userLastName}`}</Typography>
            </Grid>
            <Grid container item justifyContent="flex-end" xs={6}>
              <Button
                onClick={() => navigate("/userwelcome")}
                variant="contained"
                color="secondary"
                style={{ width: "200px" }}
              >
                Volver
              </Button>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <List>
        <Grid container spacing={2}>
          {selectedDj.selectedEvents?.map(
            (event: EventTypeContract, index: number) => {
              const eventType = eventTypes.find(
                (type) => type.name === event.eventName
              );

              return (
                <Grid
                  item
                  key={`${event.eventName}-${index}`}
                  xs={12}
                  sm={6}
                  md={6}
                >
                  <Card>
                    <CardContent>
                      {eventType && eventType.image && (
                        <Avatar
                          alt={event.eventName}
                          src={eventType.image}
                          style={{
                            width: "100%",
                            height: "200px",
                            borderRadius: 2,
                          }}
                        />
                      )}

                      <Typography variant="h6">{event.eventName}</Typography>
                      <Typography>{`Precio: ${event.price}`}</Typography>
                      <Typography>{`X Horas: ${event.hours}`}</Typography>
                      <Grid
                        container
                        sx={{
                          mt: 1,
                          borderRadius: 5,
                          backgroundColor: "rgba(0, 0, 0, 0.9)",
                          display: "flex",
                          justifyContent: "flex-end",
                        }}
                      >
                        <Button
                          onClick={() => handleEventSelect(event)}
                          variant="outlined"
                          color="primary"
                          sx={{
                            borderRadius: 5,
                            fontSize: "25px",
                            width: "100%",
                            height: "auto",
                            backgroundColor: "rgba(0, 128, 255, 0.6)",
                            color: "white",
                            borderColor: "black",
                          }}
                        >
                          CONTRATAR EVENTO
                        </Button>
                      </Grid>
                    </CardContent>
                  </Card>
                  {selectedEvent && selectedEvent === event && (
                    <Dialog
                      open={openDialog}
                      onClose={handleCloseDialog}
                      sx={{
                        backgroundImage: `url(${eventType?.image})`,
                        backgroundSize: "cover",
                        backgroundRepeat: "no-repeat",
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: "-moz-initial",
                          textAlign: "center",
                          fontSize: 35,
                          background: "rgba(0, 0, 0, 0.7)",
                          color: "white",
                          borderRadius: "0 0 10px 10px",
                        }}
                      >
                        {event.eventName}
                      </Typography>
                      <DialogTitle
                        sx={{
                          mt: "2px",
                          fontFamily: "-moz-initial",
                          textAlign: "center",
                          fontSize: 25,
                          background: "rgba(0, 0, 0, 0.7)",
                          color: "white",
                          borderRadius: 2,
                        }}
                      >
                        Detalles del Contrato
                      </DialogTitle>
                      <DialogContent>
                        <form onSubmit={handleFormSubmit}>
                          <TextField
                            variant="filled"
                            label="Horas de contratación"
                            name="EventHours"
                            value={contractDetails.EventHours}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                            required
                          />

                          <Grid item marginTop={2} xs={12}>
                            <DatePicker
                              label="Fecha del evento"
                              value={selectedDate}
                              onChange={(date) => setSelectedDate(date)}
                              minDate={startDate}
                              maxDate={endDate}
                              views={["year", "month", "day"]}
                              sx={{ width: "100%" }}
                            />
                          </Grid>

                          <TextField
                            variant="filled"
                            label="Domicilio"
                            name="EventAddress"
                            value={contractDetails.EventAddress}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                            required
                          />
                          <TextField
                            variant="filled"
                            label="Nombre del Responsable del Evento"
                            name="ClientFirstName"
                            value={contractDetails.ClientFirstName}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                            required
                          />
                          <TextField
                            variant="filled"
                            label="Apellido del Responsable del Evento"
                            name="ClientLastName"
                            value={contractDetails.ClientLastName}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                            required
                          />
                          <Typography
                            sx={{
                              mt: 2,
                              mb: -1,
                              fontFamily: "-moz-initial",
                              textAlign: "center",
                              fontSize: 20,
                              background: "rgba(0, 0, 0, 0.7)",
                              color: "white",
                              borderRadius: 2,
                            }}
                          >
                            Costo Total del servicio
                          </Typography>
                          <TextField
                            value={
                              (selectedEvent &&
                                (selectedEvent.price / selectedEvent.hours) *
                                  parseFloat(contractDetails.EventHours)) ||
                              0
                            }
                            InputProps={{
                              readOnly: true,
                            }}
                            fullWidth
                            margin="normal"
                            required
                          />
                          {showWarning && (
                            <DialogActions>
                              <Typography color="error">
                                {warningMessage}
                              </Typography>
                              <Button
                                variant="contained"
                                color="secondary"
                                style={{
                                  width: "350px",
                                  margin: "auto",
                                  position: "relative",
                                  display: "inline-block",
                                }}
                                onClick={() => {
                                  setShowWarning(false);
                                  handleReenviarContrato();
                                }}
                              >
                                ENVIAR DE TODAS FORMAS
                              </Button>
                            </DialogActions>
                          )}
                          <DialogActions>
                            <Button onClick={handleCloseDialog} color="primary">
                              CERRAR
                            </Button>
                            <Button
                              type="submit"
                              variant="outlined"
                              color="primary"
                              disabled={
                                !contractDetails.EventHours ||
                                !contractDetails.EventAddress ||
                                !contractDetails.ClientFirstName ||
                                !contractDetails.ClientLastName
                              }
                              onClick={handleFormSubmit}
                            >
                              CONTRATAR
                            </Button>
                          </DialogActions>
                        </form>
                      </DialogContent>
                    </Dialog>
                  )}
                </Grid>
              );
            }
          )}
        </Grid>
      </List>
    </div>
  );
};

export default ContractConfiguration;

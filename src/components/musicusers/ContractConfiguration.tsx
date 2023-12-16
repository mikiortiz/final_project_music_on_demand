import React, { useEffect, useState } from "react";
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
  Chip,
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
import duration from "dayjs/plugin/duration";
dayjs.extend(duration);

interface ContractDetails {
  EventDate: any;
  startEventTime: any;
  endEventTime: any;
}

const ContractConfiguration: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const selectedDj = location.state?.selectedDj;
  const user = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const musicUser = user;
  const { selectedEvent } = useSelector((state: RootState) => state.contract);

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
  const [contractGenres, setContractGenres] = useState<string[]>([]);

  const [startEventTime, setStartEventTime] = useState<string>("");
  const [endEventTime, setEndEventTime] = useState<string>("");

  const [filteredContractsDetails, setFilteredContractsDetails] = useState<
    ContractDetails[]
  >([]);

  const contracts = useSelector((state: RootState) => state.contract.contracts);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setContractDetails({ ...contractDetails, [name]: value });
  };

  const calculateEventHours = (startTime: string, endTime: string) => {
    const start = dayjs(startTime, "HH:mm");
    let end = dayjs(endTime, "HH:mm");

    // Verificar si la hora de finalización es anterior a la hora de inicio (día siguiente)
    if (end.isBefore(start)) {
      end = end.add(1, "day");
    }

    const diffInMinutes = end.diff(start, "minutes");

    const durationHours = Math.floor(diffInMinutes / 60);
    const durationMinutes = diffInMinutes % 60;

    setContractDetails({
      ...contractDetails,
      EventHours: `${durationHours}:${String(durationMinutes).padStart(
        2,
        "0"
      )} Hs`,
    });
  };

  const handleStartTimeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const startTime = event.target.value;
    setStartEventTime(startTime);

    setEndEventTime("");

    if (startTime && endEventTime) {
      calculateEventHours(startTime, endEventTime);
    }
  };

  const checkOverlap = (
    newStartTime: Dayjs,
    newEndTime: Dayjs
  ): { overlap: boolean; occupiedRanges: string } => {
    // Verificar superposición con contratos existentes
    const overlappingContracts = filteredContractsDetails.filter((contract) => {
      const existingStartTime = dayjs(
        `${contract.EventDate} ${contract.startEventTime}`,
        "DD/MM/YYYY HH:mm"
      );
      const existingEndTime = dayjs(
        `${contract.EventDate} ${contract.endEventTime}`,
        "DD/MM/YYYY HH:mm"
      );

      return (
        (newStartTime.isBefore(existingStartTime) &&
          newEndTime.isAfter(existingStartTime)) ||
        (newStartTime.isAfter(existingStartTime) &&
          newEndTime.isBefore(existingEndTime)) ||
        (newStartTime.isBefore(existingEndTime) &&
          newEndTime.isAfter(existingEndTime)) ||
        (newStartTime.isSame(existingStartTime) &&
          newEndTime.isSame(existingEndTime))
      );
    });

    if (overlappingContracts.length > 0) {
      // Construccion de horarios ocupados
      const occupiedRanges = overlappingContracts
        .map(
          (contract) => `${contract.startEventTime} - ${contract.endEventTime}`
        )
        .join(", ");

      return { overlap: true, occupiedRanges };
    }

    return { overlap: false, occupiedRanges: "" };
  };

  const handleEndTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const endTime = event.target.value;

    // Verificar que tanto la hora de inicio y finalización sean válidas
    const validStartTime = dayjs(startEventTime, "HH:mm", true).isValid();
    const validEndTime = dayjs(endTime, "HH:mm", true).isValid();

    setEndEventTime(endTime);

    if (startEventTime && validStartTime && validEndTime) {
      calculateEventHours(startEventTime, endTime);

      // Al ingresar la hora de finalización verificamos superposición con contratos existentes
      const newStartTime = dayjs(
        `${selectedDate?.format("YYYY-MM-DD")} ${startEventTime}`,
        "YYYY-MM-DD HH:mm"
      );
      const newEndTime = dayjs(
        `${selectedDate?.format("YYYY-MM-DD")} ${endTime}`,
        "YYYY-MM-DD HH:mm"
      );

      const { overlap, occupiedRanges } = checkOverlap(
        newStartTime,
        newEndTime
      );

      if (overlap) {
        setShowWarning(true);
        setWarningMessage(
          `Estos horarios ya están reservados en esta fecha. Horarios ocupados: ${occupiedRanges}`
        );
        return;
      } else {
        setShowWarning(false);
        setWarningMessage("");
      }
    }
  };

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (selectedEvent && selectedDj) {
      const hours = parseFloat(contractDetails.EventHours);

      if (hours < selectedEvent.hours) {
        setShowWarning(true);
        setWarningMessage(`Este contrato puede ser rechazado por DJ ${selectedDj.userFirstName} ${selectedDj.userLastName}. 
        Las horas ingresadas no están dentro del paquete estipulado (${selectedEvent.hours} HS X ${selectedEvent.price}). 
        ¿Deseas continuar?`);
        return;
      }

      const totalCost = (selectedEvent.price / selectedEvent.hours) * hours;

      const contractData = {
        startEventTime: startEventTime,
        endEventTime: endEventTime,
        ...contractDetails,
        EventDate: selectedDate ? selectedDate.format("DD/MM/YYYY") : "",
        eventName: selectedEvent.eventName,
        djInfo: {
          DjImg: selectedDj.customAvatarUrl,
          DjFirstName: selectedDj.userFirstName,
          DjLastName: selectedDj.userLastName,
          DjEmail: selectedDj.userEmail,
          DjGenres: contractGenres,
        },
        totalCost: totalCost,
      };

      dispatch(
        addContract({
          DjEmail: selectedDj.userEmail,
          MusicUserEmail: musicUser.userEmail,
          contract: contractData,
        })
      );

      setOpenDialog(false);
      setStartEventTime("");
      setEndEventTime("");
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
        startEventTime: startEventTime,
        endEventTime: endEventTime,
        ...contractDetails,
        EventDate: selectedDate ? selectedDate.format("DD/MM/YYYY") : "",
        eventName: selectedEvent.eventName,
        djInfo: {
          DjImg: selectedDj.customAvatarUrl,
          DjFirstName: selectedDj.userFirstName,
          DjLastName: selectedDj.userLastName,
          DjEmail: selectedDj.userEmail,
          DjGenres: contractGenres,
        },
        totalCost: totalCost,
        warning: warningMessage,
      };

      dispatch(
        addContract({
          MusicUserEmail: musicUser.userEmail,
          contract: contractData,
        })
      );

      setOpenDialog(false);
      setStartEventTime("");
      setEndEventTime("");
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
    setStartEventTime("");
    setEndEventTime("");
  };

  useEffect(() => {
    console.log("Contratos:", contracts);

    const contratosDelDjSeleccionado = contracts.filter((contract) => {
      return contract?.DjEmail === selectedDj?.userEmail;
    });

    const contractsDetails: ContractDetails[] = contratosDelDjSeleccionado.map(
      (contract) => ({
        EventDate: contract.contract?.EventDate,
        startEventTime: contract.contract?.startEventTime,
        endEventTime: contract.contract?.endEventTime,
      })
    );

    setFilteredContractsDetails(contractsDetails);
  }, [contracts, selectedDj]);

  useEffect(() => {
    if (selectedDj && selectedDj.selectedGenres) {
      setContractGenres(selectedDj.selectedGenres);
    }
  }, [selectedDj]);

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
          Configuración de Contrato
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
                onClick={() => navigate("/listcontracts")}
                variant="outlined"
                color="primary"
                sx={{
                  mr: 5,
                  height: 40,
                  backgroundColor: "rgba(0, 128, 255, 0.6)",
                  color: "white",
                  borderColor: "black",
                }}
              >
                Configurar Mis Playlists
              </Button>
              <Button
                onClick={() => navigate("/userwelcome")}
                variant="contained"
                color="secondary"
                style={{ width: "200px" }}
              >
                Salir
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
                  <Card
                    sx={{ background: "rgba(0, 0, 0, 0.7)", color: "white" }}
                  >
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

                      <Typography
                        variant="subtitle1"
                        sx={{ textAlign: "center" }}
                      >
                        Géneros del DJ:
                      </Typography>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          gap: "5px",
                          flexWrap: "wrap",
                        }}
                      >
                        {contractGenres.map((genre, genreIndex) => (
                          <Chip
                            key={genreIndex}
                            label={genre}
                            variant="outlined"
                            sx={{
                              background: "rgba(0, 0, 0, 0.8)",
                              color: "white",
                            }}
                          />
                        ))}
                      </div>
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
                          <Grid item marginTop={2} xs={12}>
                            <DatePicker
                              label="Fecha del evento"
                              value={selectedDate}
                              onChange={(date) => setSelectedDate(dayjs(date))}
                              minDate={dayjs()}
                              maxDate={dayjs().add(1, "year")}
                              views={["year", "month", "day"]}
                              sx={{ width: "100%" }}
                            />
                          </Grid>
                          <TextField
                            variant="filled"
                            label="Hora de inicio"
                            type="time"
                            name="startTime"
                            value={startEventTime}
                            onChange={handleStartTimeChange}
                            fullWidth
                            margin="normal"
                            required
                          />
                          <TextField
                            variant="filled"
                            label="Hora de finalización"
                            type="time"
                            name="endTime"
                            value={endEventTime}
                            onChange={handleEndTimeChange}
                            fullWidth
                            margin="normal"
                            required
                          />

                          <Typography variant="subtitle1">
                            Duración del evento: {contractDetails.EventHours}
                          </Typography>

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
                                showWarning ||
                                !contractDetails.EventHours ||
                                !contractDetails.EventAddress ||
                                !contractDetails.ClientFirstName ||
                                !contractDetails.ClientLastName ||
                                !selectedDate
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

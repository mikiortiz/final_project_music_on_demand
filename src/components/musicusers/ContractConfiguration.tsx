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
  FormControl,
  FormHelperText,
} from "@mui/material";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { useLocation, useNavigate } from "react-router-dom";
import {
  setSelectedEvent,
  addContract,
} from "../../redux/reducers/ContractSlice";
import { useFormik } from "formik";
import * as Yup from "yup";
import { eventTypes, EventTypeContract } from "../../model/EventTypes";
import { FormState, ContractDetails } from "../../model/typeContract";
import { RootState } from "../../model/RootStateTypes";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import duration from "dayjs/plugin/duration";
dayjs.extend(duration);

const ContractConfiguration: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const selectedDj = location.state?.selectedDj;
  const user = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const musicUser = user;

  const contracts = useSelector((state: RootState) => state.contract.contracts);
  const { selectedEvent } = useSelector((state: RootState) => state.contract);

  const [openDialog, setOpenDialog] = useState(false);

  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [contractGenres, setContractGenres] = useState<string[]>([]);
  const [filteredContractsDetails, setFilteredContractsDetails] = useState<
    ContractDetails[]
  >([]);
  const [showWarning, setShowWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");
  const [showRefreshMesaje, setShowRefreshMesaje] = useState(false);
  const [refreshMessage, setRefreshMessage] = useState("");

  const handleFormSubmit = () => {
    if (selectedEvent && selectedDj) {
      const hours = parseFloat(formik.values.EventHours);
      const totalCost = (selectedEvent.price / selectedEvent.hours) * hours;

      if (hours < selectedEvent.hours && !formik.isValid) {
        setShowWarning(true);
        setWarningMessage(`Este contrato puede ser rechazado por DJ ${selectedDj.userFirstName} ${selectedDj.userLastName}. 
        Las horas ingresadas no están dentro del paquete estipulado (${selectedEvent.hours} HS X ${selectedEvent.price}). 
        ¿Deseas continuar?`);
        setShowRefreshMesaje(true);
        setRefreshMessage(`refrescar el formulario para generar uno nuevo`);
        return;
      }

      const startTime = formik.values.startTime
        ? dayjs(
            `${selectedDate?.format("YYYY-MM-DD")} ${formik.values.startTime}`,
            "HH:mm"
          )
        : null;

      const endTime = formik.values.endTime
        ? dayjs(
            `${selectedDate?.format("YYYY-MM-DD")} ${formik.values.endTime}`,
            "HH:mm"
          )
        : null;

      if (startTime && endTime) {
        const { overlap, occupiedRanges } = checkOverlap(startTime, endTime);
        if (overlap) {
          setShowWarning(true);
          setWarningMessage(
            `Estos horarios ya están reservados en esta fecha. Horarios ocupados: ${occupiedRanges}."Este contrato puede ser rechazado"`
          );
          setShowRefreshMesaje(true);
          setRefreshMessage(`refrescar el formulario para generar uno nuevo`);
          return;
        }
      }

      const contractData = {
        ...formik.values,
        startTime: formik.values.startTime?.format("HH:mm"),
        endTime: formik.values.endTime?.format("HH:mm"),
        eventDate: formik.values.eventDate
          ? formik.values.eventDate.format("YYYY-MM-DD")
          : null,
        ClientImg: musicUser.customUserAvatarUrl,
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
          DjEmail: selectedDj.userEmail,
          MusicUserEmail: musicUser.userEmail,
          contract: contractData,
        })
      );

      setOpenDialog(false);
      formik.setValues({
        EventAddress: "",
        ClientFirstName: "",
        ClientLastName: "",
        startTime: null,
        endTime: null,
        eventDate: null,
        EventHours: "",
        eventName: selectedEvent.eventName,
      });
      setShowWarning(false);
      setShowRefreshMesaje(false);
    }
  };

  const validationSchema = Yup.object({
    EventAddress: Yup.string().required("Este campo es obligatorio"),
    ClientFirstName: Yup.string().required("Este campo es obligatorio"),
    ClientLastName: Yup.string().required("Este campo es obligatorio"),
    startTime: Yup.date()
      .required("Este campo es obligatorio")
      .typeError("ingrese una hora válida"),
    endTime: Yup.date()
      .required("Este campo es obligatorio")
      .typeError("ingrese una hora válida"),
    eventDate: Yup.date().required("Este campo es obligatorio"),
  });

  const initialFormState: FormState = {
    EventAddress: "",
    ClientFirstName: "",
    ClientLastName: "",
    startTime: null,
    endTime: null,
    eventDate: null,
    EventHours: "",
    eventName: "",
  };

  const formik = useFormik({
    initialValues: initialFormState,
    validationSchema: validationSchema,
    onSubmit: handleFormSubmit,
  });

  const calculateEventHours = (startTime: Dayjs, endTime: Dayjs) => {
    const start = dayjs(startTime, "HH:mm");
    let end = dayjs(endTime, "HH:mm");

    // Verificar si la hora de finalización es anterior a la hora de inicio (día siguiente)
    if (end.isBefore(start)) {
      end = end.add(1, "day");
    }

    const diffInMinutes = end.diff(start, "minutes");
    const durationHours = Math.floor(diffInMinutes / 60);
    const durationMinutes = diffInMinutes % 60;

    formik.setFieldValue(
      "EventHours",
      `${durationHours}:${String(durationMinutes).padStart(2, "0")} Hs`
    );
  };

  const checkOverlap = (
    newStartTime: Dayjs,
    newEndTime: Dayjs
  ): { overlap: boolean; occupiedRanges: string } => {
    const contractsOnDate = filteredContractsDetails.filter((contract) => {
      const contractStartTime = dayjs(contract.startTime);
      const contractEndTime = dayjs(contract.endTime);

      return (
        formik.values.eventDate &&
        dayjs(contract.eventDate).isSame(formik.values.eventDate, "day") &&
        (newStartTime.isBefore(contractEndTime) ||
          newStartTime.isSame(contractEndTime)) &&
        (newEndTime.isAfter(contractStartTime) ||
          newEndTime.isSame(contractStartTime))
      );
    });

    if (contractsOnDate.length > 0) {
      const occupiedRanges = contractsOnDate
        .map((contract) => {
          const contractStartTime = dayjs(contract.startTime).format("HH:mm");
          const contractEndTime = dayjs(contract.endTime).format("HH:mm");
          return `${contractStartTime}Hs a ${contractEndTime}Hs`;
        })
        .join(", ");

      console.log("Horarios ocupados:", occupiedRanges);

      return { overlap: true, occupiedRanges };
    }

    console.log("No hay contratos en la fecha exacta.");
    return { overlap: false, occupiedRanges: "" };
  };

  const handleStartTimeChange = (hour: Dayjs | null) => {
    const startTime = hour;

    formik.setFieldValue("startTime", hour);

    if (startTime && formik.values.endTime) {
      calculateEventHours(startTime, formik.values.endTime);
    }
  };

  const handleEndTimeChange = (hour: Dayjs | null) => {
    formik.setFieldValue("endTime", hour);

    if (hour) {
      const startTime = formik.values.startTime;
      const endTime = hour;

      if (startTime) {
        calculateEventHours(startTime, endTime);
      }

      const { overlap, occupiedRanges } = checkOverlap(
        startTime as Dayjs,
        endTime
      );

      if (overlap) {
        setShowWarning(true);
        setWarningMessage(
          `Estos horarios ya están reservados en esta fecha. Horarios ocupados: ${occupiedRanges}."Este contrato puede ser rechazado"`
        );
        setShowRefreshMesaje(true);
        setRefreshMessage(`Refrescar el formulario para generar uno nuevo`);
      } else {
        setShowWarning(false);
        setWarningMessage("");
        setShowRefreshMesaje(false);
        setRefreshMessage("");
      }
    } else {
      formik.setFieldValue("endTime", hour);
    }
  };

  const handleEventSelect = (event: EventTypeContract) => {
    dispatch(setSelectedEvent(event));
    formik.setValues({
      EventAddress: "",
      ClientFirstName: "",
      ClientLastName: "",
      startTime: null,
      endTime: null,
      eventDate: null,
      EventHours: "",
      eventName: "",
    });
    formik.resetForm();
    setSelectedDate(null);

    setShowWarning(false);
    setOpenDialog(true);
    setShowRefreshMesaje(false);
  };

  const handleCloseDialog = () => {
    setShowWarning(false);
    setOpenDialog(false);
    formik.setValues({
      ...formik.values,
      startTime: null,
    });
    formik.setValues({
      ...formik.values,
      endTime: null,
    });
  };

  const handleRefreshForm = () => {
    formik.resetForm();
    setShowWarning(false);
    setWarningMessage("");
    setShowRefreshMesaje(false);
    setRefreshMessage("");
  };

  useEffect(() => {
    const contratosDelDjSeleccionado = contracts.filter((contract) => {
      return contract?.DjEmail === selectedDj?.userEmail;
    });

    const contractsDetails: ContractDetails[] = contratosDelDjSeleccionado.map(
      (contract) => ({
        eventDate: contract.contract?.eventDate,
        startTime: contract.contract?.startTime,
        endTime: contract.contract?.endTime,
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
                        <form onSubmit={formik.handleSubmit}>
                          <TextField
                            variant="filled"
                            label="Domicilio"
                            value={formik.values.EventAddress}
                            onChange={formik.handleChange}
                            name="EventAddress"
                            fullWidth
                            error={
                              formik.touched.EventAddress &&
                              Boolean(formik.errors.EventAddress)
                            }
                            helperText={
                              formik.touched.EventAddress &&
                              formik.errors.EventAddress
                            }
                          />
                          <TextField
                            variant="filled"
                            label="Nombre del Responsable del Evento"
                            name="ClientFirstName"
                            value={formik.values.ClientFirstName}
                            onChange={formik.handleChange}
                            fullWidth
                            margin="normal"
                            error={
                              formik.touched.ClientFirstName &&
                              Boolean(formik.errors.ClientFirstName)
                            }
                            helperText={
                              formik.touched.ClientFirstName &&
                              formik.errors.ClientFirstName
                            }
                          />
                          <TextField
                            variant="filled"
                            label="Apellido del Responsable del Evento"
                            name="ClientLastName"
                            value={formik.values.ClientLastName}
                            onChange={formik.handleChange}
                            fullWidth
                            margin="normal"
                            error={
                              formik.touched.ClientLastName &&
                              Boolean(formik.errors.ClientLastName)
                            }
                            helperText={
                              formik.touched.ClientLastName &&
                              formik.errors.ClientLastName
                            }
                          />
                          <Grid item marginTop={2} xs={12}>
                            <FormControl
                              fullWidth
                              error={
                                formik.touched.eventDate &&
                                Boolean(formik.errors.eventDate)
                              }
                            >
                              <DatePicker
                                label="Fecha del evento"
                                value={formik.values.eventDate || null}
                                onChange={(date) =>
                                  formik.setFieldValue("eventDate", date)
                                }
                                minDate={dayjs()}
                                maxDate={dayjs().add(1, "year")}
                                views={["year", "month", "day"]}
                                sx={{ width: "100%" }}
                              />
                              <FormHelperText>
                                {formik.touched.eventDate &&
                                  formik.errors.eventDate}
                              </FormHelperText>
                            </FormControl>
                          </Grid>

                          <Grid item marginTop={2} xs={12}>
                            <FormControl fullWidth>
                              <TimePicker
                                label="Hora de inicio"
                                value={formik.values.startTime}
                                onChange={(newValue) =>
                                  handleStartTimeChange(newValue)
                                }
                                slotProps={{
                                  textField: {
                                    fullWidth: true,
                                    variant: "outlined",
                                    error:
                                      formik.touched.startTime &&
                                      Boolean(formik.errors.startTime),
                                    helperText:
                                      formik.touched.startTime &&
                                      formik.errors.startTime,
                                  },
                                }}
                              />
                            </FormControl>
                          </Grid>

                          <Grid item marginTop={2} xs={12}>
                            <FormControl fullWidth>
                              <TimePicker
                                label="Hora de finalización"
                                value={formik.values.endTime}
                                onChange={(newValue) =>
                                  handleEndTimeChange(newValue)
                                }
                                slotProps={{
                                  textField: {
                                    fullWidth: true,
                                    variant: "outlined",
                                    error:
                                      formik.touched.endTime &&
                                      Boolean(formik.errors.endTime),
                                    helperText:
                                      formik.touched.endTime &&
                                      formik.errors.endTime,
                                  },
                                }}
                              />
                            </FormControl>
                          </Grid>

                          <Typography variant="subtitle1">
                            Duración del evento: {formik.values.EventHours}
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
                                  parseFloat(formik.values.EventHours)) ||
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
                            </DialogActions>
                          )}
                          {showRefreshMesaje && (
                            <DialogActions>
                              <Typography color="error">
                                {refreshMessage}
                              </Typography>
                              <Button
                                onClick={handleRefreshForm}
                                variant="contained"
                                color="secondary"
                                style={{
                                  width: "350px",
                                  margin: "auto",
                                  position: "relative",
                                  display: "inline-block",
                                }}
                              >
                                REFRESCAR FORMULARIO
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

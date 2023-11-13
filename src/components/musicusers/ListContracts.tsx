import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../model/RootStateTypes";
import { Avatar, Card, CardContent, Grid, Typography } from "@mui/material";
import NavbarUser from "./NavbarUsers";

const ListContract: React.FC = () => {
  const contracts = useSelector((state: RootState) => state.contract.contracts);

  return (
    <div
      style={{
        height: "100%",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        alignItems: "center",
      }}
    >
      <Grid
        container
        item
        xs={12}
        sm={12}
        md={12}
        sx={{ background: "rgba(0, 0, 0, 0.5)" }}
      >
        <NavbarUser />
        <Typography
          variant="h5"
          style={{
            marginTop: "1px",
            width: "100%",
            background: "rgba(0, 0, 0, 0.8)",
            color: "white",
            textAlign: "center",
            fontWeight: "bolder",
          }}
        >
          Mis Contratos
        </Typography>
        <Grid container spacing={2} justifyContent="center">
          {contracts.map((contract) => (
            <Grid
              item
              key={contract.djInfo?.userEmail}
              xs={12}
              sm={6}
              md={6}
              lg={6}
            >
              <Card>
                <CardContent>
                  {contract.eventName && (
                    <>
                      <Typography
                        variant="h6"
                        sx={{ mt: -1, mb: 1, textAlign: "center" }}
                      >
                        Contrato De: {contract.eventName}
                      </Typography>
                      <Grid container>
                        <Grid
                          item
                          xs={12}
                          md={6}
                          lg={6}
                          style={{ position: "relative" }}
                        >
                          <Avatar
                            alt={contract.eventName}
                            style={{
                              width: "100%",
                              height: "100%",
                              borderRadius: 2,
                            }}
                            src={contract.eventImageUrl}
                          />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          md={6}
                          lg={6}
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-end",
                          }}
                        >
                          {contract.djInfo && (
                            <div style={{ marginTop: "10px" }}>
                              <Typography
                                sx={{
                                  backgroundColor: "rgba(0, 0, 0, 0.7)",
                                  color: "white",
                                  padding: "5px",
                                  fontSize: "14px",
                                }}
                              >{`DJ: ${contract.djInfo.userFirstName} ${contract.djInfo.userLastName}`}</Typography>
                              <Avatar
                                alt={`${contract.djInfo.userFirstName} ${contract.djInfo.userLastName}`}
                                src={contract.djInfo.customAvatarUrl}
                                style={{
                                  width: "30%",
                                  height: "auto",
                                  borderRadius: 2,
                                }}
                              />
                            </div>
                          )}
                        </Grid>
                      </Grid>
                      <Typography>{`Fecha de mi evento: ${contract.EventDate}`}</Typography>
                      <Typography>{`Dirección de mi evento: ${contract.EventAddress}`}</Typography>
                      <Typography>{`Duración del evento: ${contract.EventHours} horas`}</Typography>
                      <Typography>{`Cliente: ${contract.ClientFirstName} ${contract.ClientLastName}`}</Typography>
                      <Typography>{`Costo Total: ${contract.totalCost}`}</Typography>
                    </>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </div>
  );
};

export default ListContract;

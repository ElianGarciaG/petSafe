import { Box, /*Typography,*/ useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
//import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
//import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
//import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import Header from "../../components/Header";
import React, { useState, useEffect } from "react";

const getAddressFromCoords = async (lat, lon) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`
    );
    const data = await response.json();
    const city =
      data.address.city || data.address.town || data.address.village || "Ciudad desconocida";
    const neighborhood =
      data.address.suburb || data.address.neighbourhood || "Barrio desconocido";
    return { city, neighborhood };
  } catch (error) {
    console.error("Error al obtener dirección:", error);
    return { city: "Ciudad desconocida", neighborhood: "Barrio desconocido" };
  }
};

const Team = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Estado para los datos del DataGrid
  const [rows, setRows] = useState([]);

  // Hook useEffect para hacer el fetch al montar el componente
  useEffect(() => {
    const fetchData = async () => {
      try {
        const url =
          process.env.REACT_APP_URL_DATA_ESP ?? "http://localhost:6421/esp/data";
        const response = await fetch(`${url}?numRecords=100`);
        if (!response.ok) throw new Error("Error al obtener los datos");
        const data = await response.json();

        // Enriquecer cada fila con ciudad y barrio
        const enrichedData = await Promise.all(
          data.map(async (item) => {
            const { city, neighborhood } = await getAddressFromCoords(
              item.latitude,
              item.longitude
            );
            return {
              ...item,
              city,
              neighborhood,
              id: item.id ?? `${item.latitude}-${item.longitude}`, // Asegura ID único
            };
          })
        );

        setRows(enrichedData);
      } catch (error) {
        console.error("Error al hacer el fetch:", error);
      }
    };

    fetchData();
  }, []);

  const columns = [
    { field: "id", headerName: "ID" },
    {
      field: "latitude",
      headerName: "Latitud",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "longitude",
      headerName: "Longitud",
      flex: 1,
    },
    {
      field: "registrationDate",
      headerName: "Fecha registro",
      flex: 1,
    },{
    field: "city",
    headerName: "Ciudad",
    flex: 1,
  },
  {
    field: "neighborhood",
    headerName: "Barrio",
    flex: 1,
  },

  ];

  return (
    <Box m="20px">
      <Header
        title="Registros"
        subtitle="Información registrada por el collar"
      />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
        }}
      >
        <DataGrid checkboxSelection rows={rows} columns={columns} />
      </Box>
    </Box>
  );
};

export default Team;

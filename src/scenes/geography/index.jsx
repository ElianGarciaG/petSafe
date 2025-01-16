import { Box, useTheme } from "@mui/material";
//import GeographyChart from "../../components/GeographyChart";
import Header from "../../components/Header";
import { tokens } from "../../theme";
import MapComponent from "../../components/CurrentGeography";

const Geography = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Box m="20px">
      <Header title="Ubicación" subtitle="Seguimiento de desplazamiento" />

      <Box
        height="75vh"
        border={`1px solid ${colors.grey[100]}`}
        borderRadius="4px"
      >
        <MapComponent />
      </Box>
    </Box>
  );
};

export default Geography;

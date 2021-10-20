import {CircularProgress} from "@mui/material";
import Box from '@mui/material/Box';

export default function Spinner() {
  return (
    <Box sx={{width: '100%', display: 'flex', justifyContent: 'center', marginTop: '40vh'}}>
      <CircularProgress/>
    </Box>
  )
}

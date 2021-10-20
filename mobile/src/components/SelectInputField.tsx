import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import {FormControl, InputLabel, Select} from "@mui/material";
import {CardDeckResponse, GameOptionsResponse} from "../clients/ResponseTypes";
import MenuItem from "@mui/material/MenuItem";


interface SelectInputFieldProps {
  decks: CardDeckResponse[] | null;
  value: any;
  setValue: (value: any) => void;
}
export default function SelectInputField(props: SelectInputFieldProps) {
  const handleDeckChange = (e: any) => {
    e.preventDefault();
    props.setValue(e.target.value);
  }
  return (
    <Box sx={{ width: 250, marginTop: '2vh' }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Card deck</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={props.value}
          label="Card-deck"
          onChange={handleDeckChange}
          sx={{width: '100%'}}
          placeholder={'Loading...'}
        >
          {props.decks ? (
            props.decks.map((d: CardDeckResponse) =>
              <MenuItem sx={{width: '100%'}} value={d.id}>{d.name}</MenuItem>
            )
          ): (<MenuItem sx={{width: '100%'}} value={0}>Loading...</MenuItem>)}
        </Select>
      </FormControl>
    </Box>
  );
}

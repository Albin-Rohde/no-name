import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import MuiInput from '@mui/material/Input';
import VolumeUp from '@mui/icons-material/VolumeUp';
import {GameOptionsResponse} from "../clients/ResponseTypes";

const Input = styled(MuiInput)`
  width: 42px;
`;

interface SliderProps {
  min: number;
  max: number;
  default: number;
  title: string;
  setValue: (value: any) => void;
  value: any;
}

export default function SliderInput(props: SliderProps) {
  const handleSliderChange = (event: Event, newValue: number) => {
    props.setValue(newValue);
  };

  return (
    <Box sx={{ width: 250 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs>
          <Typography variant={'body1'} color={'#8795ab'}>
            {props.title}: {props.value}
          </Typography>
          <Slider
            defaultValue={props.default}
            max={props.max}
            min={props.min}
            value={props.value}
            onChange={handleSliderChange}
            valueLabelDisplay="auto"
            sx={{width: '100%'}}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

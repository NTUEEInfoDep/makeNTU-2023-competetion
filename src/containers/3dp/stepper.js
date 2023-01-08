import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import DPList from "./DPList";
import Grid from "@mui/material/Grid";

const steps = ["等待中", "使用中", "已結束"];

export default function DPStepper(props) {
  const { waitings, usings, finisheds } = props;

  return (
    <Box sx={{ width: "100%" }}>
      <Stepper activeStep={3} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>
              {/*<Grid container spacing={2}>*/}
              {/*  <Grid item xs={12}>*/}
              {label}
              {/*</Grid>*/}
              {/*<Grid item xs={12}>*/}
              {/*    <DPList />*/}
              {/*</Grid>*/}
              {/*</Grid>*/}
            </StepLabel>
            {/*<DPList />*/}
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}

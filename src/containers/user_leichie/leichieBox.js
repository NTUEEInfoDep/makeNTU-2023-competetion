import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";
import AddIcon from "@mui/icons-material/Add";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import LaserCutterCards from "./leichieCard";

var timeLim = 20; // need to share w/ index
var completeTime = (timeLim) => {
  var time = new Date();
  time.setTime(time.getTime() + timeLim * 60 * 1000);
  return time.toLocaleTimeString("zh-Hans-CN", {
    hour12: false,
    hour: "numeric",
    minute: "numeric",
  });
};
// console.log(completeTime(timeLim));

const laserCutterInfo = [
  {
    no: "一",
    status: "99",
    usedBy: "",
    completeTime: "",
    done: true,
    remove: true,
  },

  {
    no: "二",
    status: "0",
    usedBy: "",
    completeTime: "",
    done: true,
    remove: false,
  },
  {
    no: "三",
    status: "1",
    usedBy: "1",
    completeTime: completeTime(timeLim),
    done: false,
    remove: false,
  },
];

const LaserCutterBox = () => (
  <Card>
    <CardContent style={{ padding: 0 }}>
      {/* Grid container for all cards */}
      <Grid
        container
        wrap="nowrap"
        spacing={2}
        direction="row"
        style={{ padding: 10, overflow: "auto" }}
      >
        {/* 有幾台雷切就放幾個components */}
        {laserCutterInfo.map((c, i) => {
          console.log(i);
          if (c.status == 99) return; // 不顯示暫停使用(僅顯示在admin)
          return (
            <LaserCutterCards
              key={i}
              leichieNo={c.no}
              status={c.status}
              groupNo={c.usedBy}
              doneTime={c.completeTime}
              // done={c.done}
              // remove={c.remove}
            />
          );
        })}

        {/* {/* <LaserCutterCards /> */}
      </Grid>
    </CardContent>
  </Card>
);

export default LaserCutterBox;

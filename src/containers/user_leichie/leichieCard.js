import * as React from "react";

import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

import { useState } from "react";

// fake data
const groupNo = 1;
let status = 0; // default 0
let shown = true;
let leichieNo = "一"; //雷切一

// 預計完成時間
const showTime = (status, completeTime) => {
  if (!completeTime || status != 1) return "-- : --"; // 未使用則沒有時間
  const time = completeTime.split(":");
  return time[0] + " : " + time[1]; // if使用中則回傳預估完成時間
};
// 機台使用狀態
const showStatus = (status) => {
  if (status == 0) return "○ 準備中";
  if (status == 1) return "● 運作中";
  return "X 暫停使用"; // debug
};

const cards = ({ leichieNo, status, groupNo, doneTime }) => (
  <Grid item>
    {/* a card for a leichie made up by multi grids */}
    <Card sx={{ minHeight: 180, minWidth: 270 }} variant="outlined">
      <CardContent>
        {/* 機台使用資訊 */}
        <Grid
          container
          spacing={2}
          justifyContent="flex-start"
          alignItems="center"
        >
          <Grid item xs="auto">
            <Typography
              gutterBottom
              sx={{ fontSize: 20 }}
              color="text.secondary"
            >
              {/* 顯示運轉狀態 */}
              {showStatus(status)}
            </Typography>
            <Typography variant="h4" component="div">
              {`雷切${leichieNo}`}
            </Typography>
          </Grid>
        </Grid>

        {/* group and time info */}
        <Grid
          container
          spacing={2}
          marginTop={1}
          justifyContent="space-around"
          alignItems="center"
        >
          <Grid item>
            <Typography
              gutterBottom
              sx={{ fontSize: 16 }}
              color="text.secondary"
            >
              使用組別
            </Typography>
            <Typography sx={{ fontSize: 40 }} component="div">
              {`# ${groupNo}`}
            </Typography>
          </Grid>
          <Grid item>
            <Typography sx={{ fontSize: 16 }} color="text.secondary">
              預計完成
            </Typography>
            <Typography sx={{ fontSize: 40 }} component="div">
              {showTime(status, doneTime)}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  </Grid>
);

export default cards;

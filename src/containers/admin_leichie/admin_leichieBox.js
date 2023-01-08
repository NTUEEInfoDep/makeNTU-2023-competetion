import * as React from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import LaserCutterCards from "./admin_leichieCard";

const LaserCutterBox = ({
  laserCutterInfo,
  laserNumber,
  setLaserNumber,
  laserIdx,
  setLaserIdx,
  deleteLeichei,
  updatedLeichie,
}) => {
  return (
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
          {/* 從資料庫叫回產生雷切的訊息框*/}
          {laserCutterInfo.map((c, i) => {
            if (!laserIdx.includes(parseInt(c.id))) return; // skip unexisting id
            console.log("機台Id= " + c.id);
            return (
              <LaserCutterCards
                key={i}
                leichieId={c.id}
                status={c.status}
                groupNo={c.user}
                doneTime={c.completeTime}
                laserNumber={laserNumber}
                setLaserNumber={setLaserNumber}
                laserIdx={laserIdx}
                setLaserIdx={setLaserIdx}
                deleteLeichei={deleteLeichei}
                updatedLeichie={updatedLeichie}
              />
            );
          })}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default LaserCutterBox;

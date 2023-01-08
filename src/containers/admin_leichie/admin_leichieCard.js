import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";
import AddIcon from "@mui/icons-material/Add";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { Modal } from "@mui/material";

// 預計完成時間
const showTime = (status, completeTime) => {
  if (!completeTime || status != 1) return "-- : --"; // 未使用則沒有時間
  const time = completeTime.split(":");
  return time[0] + " : " + time[1]; // if使用中則回傳預估完成時間
};
// 機台使用狀態
const showStatus = (status) => {
  if (status === 0) return "○ 準備中";
  if (status === 1) return "● 運作中";
  return "X 暫停使用"; // debug
};
// const [open, setOpen] = useState(false);

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  // width: 400,
  bgcolor: "rgba(0,0,0, 0.7)",
  alignItems: "center",
  border: "1px solid #fff",
  boxShadow: 24,
  p: 3,
};

const cards = ({
  leichieId,
  status,
  groupNo,
  doneTime,
  laserNumber,
  laserIdx,
  deleteLeichei,
  updatedLeichie,
}) => {
  // const [open, setOpen] = useState(false); // why 不能用！！！！！？？？？
  return (
    <Grid item>
      {/* a card for a leichie made up by multi grids */}
      <Card sx={{ minHeight: 200, minWidth: 300 }} variant="outlined">
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
              <Typography variant="h5" component="div">
                {`雷切 ${leichieId}`}
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
                {groupNo === null ? "待命" : `#${groupNo}`}
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

          {/* 完成與移除按鈕 */}
          <Grid
            container
            marginTop={1}
            justifyContent="center"
            alignItems="center"
          >
            <Stack
              direction="row"
              spacing={2}
              justifyContent="center"
              alignItems="center"
            >
              <Button
                sx={{ border: 1.5 }}
                variant="outlined"
                startIcon={
                  status === 1 ? (
                    <CheckIcon />
                  ) : status === -1 ? (
                    <AddIcon />
                  ) : (
                    <FiberManualRecordIcon />
                  )
                }
                disabled={status === 0 ? true : false}
                // 判斷邏輯： 運作中點擊使用完成 status: 1 -> 0
                //          暫停使用點擊恢復使用 status: -1 -> 0
                onClick={() => {
                  updatedLeichie({
                    variables: {
                      info: {
                        id: leichieId,
                        status: 0,
                        user: null,
                        completeTime: null,
                      },
                    },
                  });
                }}
              >
                {status === 1
                  ? "使用完成"
                  : status === -1
                  ? "恢復使用"
                  : "待分配"}
              </Button>

              <Button
                sx={{ border: 1.5 }}
                disabled={status === 1 ? true : status === -1 ? true : false} // 需判斷若在使用中則不能按移除，必須先按使用完成才可以
                variant="outlined"
                startIcon={<DeleteIcon />}
                onClick={() => {
                  console.log("laserNumber " + laserNumber);
                  // deleteLeichei({ variables: { id: leichieId } });
                  updatedLeichie({
                    variables: {
                      info: {
                        id: leichieId,
                        status: -1,
                        user: null,
                        completeTime: null,
                      },
                    },
                  });
                }}
              >
                暫停使用
              </Button>

              {/* 原本有做個確認框.....但useState過不了 所以先刪掉 */}
              {/* <Modal //open={open}
              >
                <Box sx={modalStyle} component="form">
                  <Typography id="modal-description">
                    確認刪除雷切{leichieName} ?
                  </Typography>
                  <Stack direction="row" spacing={2}>
                    <Button
                      sx={{ width: "10px" }}
                    // onClick={() => setOpen(!open)}
                    >
                      YES
                    </Button>
                    <Button
                      sx={{ width: "10px" }}
                      onClick={() => {
                        
                        setOpen(!open);
                        console.log("laserNumber " + laserNumber)
                        setLaserNumber(laserNumber - 1);
                        setLaserIdx(laserIdx.filter((item) => item !== leichieId));

                        // setRemove(true) // 必須先修改 laserCutterInfo再重新render畫面
                      }}
                    >
                      NO
                    </Button>
                  </Stack>
                </Box>
              </Modal> */}
            </Stack>
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default cards;

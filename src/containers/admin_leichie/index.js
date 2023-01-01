import LaserCutterBox from "./admin_leichieBox";
import React from "react";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import SendIcon from "@mui/icons-material/Send";
import { useState } from "react";
import { MenuItem, Select } from "@mui/material";

// --- Table info ---
function createData(team, order, material, thickness, arrangement) {
  return { team, order, material, thickness, arrangement };
}

const rows = [
  createData("1", 1, "壓克力", 3, "1"),
  createData("2", 2, "密集板", 5, "2"),
  createData("3", 3, "密集板", 5, "3"),
  createData("4", 4, "壓克力", 3, ""),
  createData("5", 5, "密集板", 5, ""),
];

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
  // height: '200px',
}));

// 預估完成時間
var completeTime = (timeLim) => {
  var time = new Date();
  time.setTime(time.getTime() + timeLim * 60 * 1000);
  return time.toLocaleTimeString("zh-Hans-CN", {
    hour12: false,
    hour: "numeric",
    minute: "numeric",
  });
};
var timeLim = 20;

// fake 先假裝是從資料庫get資料回來QQ
const fakelaserCutterInfo = [
  {
    id: 1,
    // name: "一",
    status: "99",
    usedBy: "",
    completeTime: "",
    done: true, // ?
    remove: true, // ?
  },

  {
    id: 2,
    // name: "二",
    status: "0",
    usedBy: "",
    completeTime: "",
    done: true,
    remove: false,
  },
  {
    id: 3,
    // name: "三",
    status: "1",
    usedBy: "1",
    completeTime: completeTime(timeLim),
    done: false,
    remove: false,
  },
  {
    id: 4,
    // name: "四",
    status: "1",
    usedBy: "2",
    completeTime: completeTime(timeLim),
    done: false,
    remove: false,
  },
];
// --- --- ---
export default function LaserCutter() {
  // --- States ---
  const [laserNumber, setLaserNumber] = useState(3);
  const [laserTime, setLaserTime] = useState(20);
  const [timeChange, setTimeChange] = useState(20);
  const [removeId, setRemoveId] = useState();
  const [laserIdx, setLaserIdx] = useState(
    [...Array(laserNumber).keys()].map((i) => i + 1)
  ); // 雷切機陣列 預設1,2號機台(初始時根據總數自動生成id)
  const [laserNo, setLaserNo] = useState(""); // 雷切機編號
  const [open, setOpen] = useState(false); // 新增雷切機
  const [dataRow, setDataRow] = useState(rows);
  const [laserCutterInfo, setLaserCutterInfo] = useState(fakelaserCutterInfo);
  const handleOpen = () => setOpen(true); // 開啟新增雷切機
  const handleClose = () => setOpen(false); // 關閉新增雷切機
  const handleConfirm = () => {
    setOpen(false);
  };

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "rgba(0,0,0, 0.7)",

    border: "1px solid #fff",
    boxShadow: 24,
    p: 3,
  };
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          height: "auto",
          width: "90%",
          display: "flex",
          fontSize: 30,
          fontWeight: "medium",
          justifyContent: "space-between",
        }}
      >
        <p>雷射切割機 借用管理</p>
        <Button
          size="large"
          sx={{ color: "rgba(255,255,255)", fontSize: 16 }}
          startIcon={<AddCircleIcon />}
          onClick={handleOpen}
        >
          新增雷切機
        </Button>
        {/* 新增雷切機的視窗 */}
        <Modal
          open={open}
          // onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={modalStyle} component="form">
            <Stack direction="column" spacing={2}>
              <Typography id="modal-description">新增雷切機：</Typography>
              <Stack direction="row" spacing={2} alignItems="baseline">
                <TextField
                  required
                  label="機台ID"
                  variant="standard"
                  onChange={(e) => {
                    if (e.target.value.trim()) {
                      let id = parseInt(e.target.value.trim());
                      if (Number.isInteger(id)) {
                        if (laserIdx.includes(id)) {
                          alert("ID: " + e.target.value.trim() + " 已存在");
                          return;
                        }
                        setLaserNo(id);
                      } else {
                        alert("請輸入整數 ID");
                        return;
                      }
                    }

                    setLaserNo(e.target.value.trim());
                  }}
                  value={laserNo}
                  helperText={laserNo ? "" : "必填"}
                />
                <Button
                  disabled={!laserNo}
                  variant="contained"
                  size="small"
                  sx={{
                    backgroundColor: "rgba(255,255,255, 0.7)",
                    color: "black",
                    borderRadius: 10,
                  }}
                  onClick={() => {
                    console.log(
                      "laserNo " + JSON.stringify(laserIdx) + laserNo
                    );
                    setLaserNumber(laserNumber + 1);
                    // setLaserIdx([...laserIdx, laserNumber + 1]); 如果移除再加入會有重複ID出現的可能性 已修改城下列寫法
                    setLaserIdx(() => [...laserIdx, parseInt(laserNo)]); // input is string
                    handleConfirm();
                  }}
                >
                  確認
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  sx={{
                    backgroundColor: "rgba(255,255,255, 0.7)",
                    color: "black",
                    borderRadius: 10,
                  }}
                  onClick={handleClose}
                >
                  取消
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Modal>
      </Box>
      {/* ------- 雷切狀態列 ------- */}
      <Box sx={{ width: "90%", border: 1 }}>
        <LaserCutterBox
          laserCutterInfo={laserCutterInfo}
          laserNumber={laserNumber}
          setLaserNumber={setLaserNumber}
          laserIdx={laserIdx}
          setLaserIdx={setLaserIdx}
        />
      </Box>
      {/* ------- 雷切工具列 ------- */}
      <Stack
        direction="row"
        sx={{
          width: "90%",
          height: 80,
          fontSize: 20,
          fontWeight: "medium",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <p>雷切機數量：{laserNumber} 台</p>
        <p>時間上限：{laserTime} mins</p>
        <Stack direction="row">
          <TextField
            sx={{
              width: "60%",
              color: "rgba(0,0,0,0.75)",
            }}
            id="outlined-basic"
            label="輸入時間上限"
            variant="standard"
            color="secondary"
            onChange={(e) => {
              setTimeChange(e.target.value);
            }}
            value={timeChange}
          />
          <Button
            variant="contained"
            size="small"
            color="secondary"
            endIcon={<SendIcon />}
            sx={{
              // height: 57,
              color: "rgba(0,0,0)",
              backgroundColor: "rgba(255,255,255,0.75)",
              fontSize: 16,
            }}
            disabled={!timeChange}
            onClick={() => {
              // console.log(timeChange);
              setLaserTime(timeChange);
              setTimeChange("");
            }}
          >
            修改
          </Button>
        </Stack>
      </Stack>

      <Box sx={{ width: "80%", margin: "auto", m: 2 }}>
        <TableContainer component={Paper} sx={{ height: 280 }}>
          <Table stickyHeader sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell align="center">組別</TableCell>
                <TableCell align="center">排序</TableCell>
                <TableCell align="center">材料</TableCell>
                <TableCell align="center">厚度</TableCell>
                <TableCell align="center">排程</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dataRow.map((row, i) => (
                <TableRow
                  key={row.team}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row" align="center">
                    {`Team ${row.team}`}
                  </TableCell>
                  {/* <TableCell align="center">{row.order}</TableCell> */}
                  <TableCell align="center">{i + 1}</TableCell>{" "}
                  {/* render的順序即為排序 */}
                  <TableCell align="center">{row.material}</TableCell>
                  <TableCell align="center">{row.thickness}</TableCell>
                  <TableCell align="center">
                    {/* {row.arrangement} */}
                    <Select
                      inputProps={{
                        MenuProps: {
                          MenuListProps: {
                            sx: {
                              backgroundColor: "black",
                            },
                          },
                        },
                      }}
                      variant="standard"
                      size="small"
                      defaultValue={row.arrangement}
                      // value={}
                      onChange={(e) => {
                        rows[i]["arrangement"] = e.target.value; // 更新資料庫
                        // console.log("rows[i]['arrangement']= "+ rows[i]['arrangement'])
                        setDataRow(() => rows);
                      }}
                    >
                      {laserIdx.map((id) => (
                        <MenuItem key={id} value={id}>
                          雷切{id}
                        </MenuItem>
                      ))}
                      <MenuItem key={99} value={99}>
                        移除
                      </MenuItem>
                    </Select>
                    <Button
                      size="small"
                      sx={{ color: "rgba(255,255,255, 0.8)" }}
                      endIcon={<SendIcon />}
                      value={row.team} // 第幾組
                      // disabled={!rows[i]['arrangement']}
                      onClick={(e) => {
                        if (!row.arrangement) return alert("請選擇排程項目");
                        setRemoveId(row.team);
                        console.log("del row = " + i);
                        console.log("del team = " + row.team);

                        setDataRow(() =>
                          dataRow.filter((data) => data.team != row.team)
                        );

                        console.log(JSON.stringify(rows.splice(i, 1))); // for debug, remove the row after GO

                        if (row.arrangement == 99)
                          alert("將隊伍 " + row.team + " 移除等候隊伍");
                        else {
                          setLaserCutterInfo(() => {
                            let tmp = laserCutterInfo.findIndex(
                              (laser) => laser.id == row.arrangement
                            );
                            laserCutterInfo[tmp].usedBy = row.team;
                            laserCutterInfo[tmp].status = 1;
                            console.log(completeTime(timeChange));

                            laserCutterInfo[tmp].completeTime =
                              completeTime(timeChange);
                            return laserCutterInfo;
                          });
                          alert(
                            "將隊伍 " +
                              row.team +
                              " 排入使用雷切" +
                              row.arrangement
                          );
                        }
                      }}
                    >
                      GO
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}
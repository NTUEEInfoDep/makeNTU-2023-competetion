import LaserCutterBox from "./admin_leichieBox";
import React from "react";
import Paper from "@mui/material/Paper";
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
import { useState, useEffect } from "react";
import { MenuItem, Select } from "@mui/material";
import { useQuery, useMutation } from "@apollo/client";
import {
  LASERCUTTER_UPDATE_SUBSCRIPTION,
  CREATE_LEICHIE_MUTATION,
  UPDATE_LEICHIE_MUTATION,
  LEICHIE_QUERY,
  LASERCUTTER_RESERVE_SUBSCRIPTION,
  LEICHIE_RESERVE_QUERY,
  CANCEL_LEICHIE_RESERVE,
  DEL_LEICHIE_MUTATION,
} from "../../graphql";

// try to connect to database

// --- Table info ---
function createData(team, order, material, thickness, arrangement) {
  return { team, order, material, thickness, arrangement };
}

// 預估完成時間
var completeTime = (timeLim) => {
  var time = new Date();
  time.setTime(time.getTime() + parseInt(timeLim) * 60 * 1000);
  return time.toLocaleTimeString("zh-Hans-CN", {
    hour12: false,
    hour: "numeric",
    minute: "numeric",
  });
};

// --- --- ---
export default function LaserCutter() {
  // --- States ---
  const [laserNumber, setLaserNumber] = useState(2);
  const [laserTime, setLaserTime] = useState(20);
  const [timeChange, setTimeChange] = useState();
  const [removeId, setRemoveId] = useState();
  const [laserIdx, setLaserIdx] = useState(
    [...Array(laserNumber).keys()].map((i) => i + 1)
  ); // 雷切機陣列 預設1,2號機台(初始時根據總數自動生成id)
  const [laserNo, setLaserNo] = useState(""); // 雷切機編號
  const [open, setOpen] = useState(false); // 新增雷切機
  const [laserCutterInfo, setLaserCutterInfo] = useState([]);
  const [arrange, setArrange] = useState();

  const handleOpen = () => setOpen(true); // 開啟新增雷切機
  const handleClose = () => setOpen(false); // 關閉新增雷切機
  const handleConfirm = () => {
    setOpen(false);
  };

  const { data, loading, subscribeToMore } = useQuery(LEICHIE_QUERY);
  const {
    data: reserveData,
    loading: reserveLoading,
    subscribeToMore: subscribeToReserve,
  } = useQuery(LEICHIE_RESERVE_QUERY);

  const [newLeichie] = useMutation(CREATE_LEICHIE_MUTATION);
  const [updatedLeichie] = useMutation(UPDATE_LEICHIE_MUTATION);
  const [deleteLeichie] = useMutation(DEL_LEICHIE_MUTATION);
  const [cancelReserve] = useMutation(CANCEL_LEICHIE_RESERVE);

  useEffect(() => {
    try {
      subscribeToMore({
        document: LASERCUTTER_UPDATE_SUBSCRIPTION,
        variables: {},
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData.data) {
            console.log("Subscription failed");
            return prev;
          }
          const newFeedItem = subscriptionData.data.LaserCutterInfo;
          console.log("prev", prev);
          console.log("sub data", subscriptionData.data);
          switch (subscriptionData.data.LaserCutterInfo.status) {
            // TODO: other cases!
            case -1:
              return Object.assign({}, prev, {
                laserCutter: prev.laserCutter,
              });

            // '新增機台'或是'使用完成'
            case 0:
              if (prev.laserCutter.find((obj) => obj.id === newFeedItem.id)) {
                // 已存在，狀態：改為'使用完成'
                return Object.assign({}, prev, {
                  laserCutter: prev.laserCutter,
                });
              } else {
                // 新增機台
                return Object.assign({}, prev, {
                  laserCutter: [...prev.laserCutter, newFeedItem],
                });
              }
            default:
              console.log("Case undefined");
              return Object.assign({}, prev, {
                laserCutter: prev.laserCutter,
              });
          }
        },
      });
    } catch (error) {
      console.log(error);
    }
  }, [subscribeToMore]);

  useEffect(() => {
    try {
      subscribeToReserve({
        document: LASERCUTTER_RESERVE_SUBSCRIPTION,
        variables: {},
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData.data) {
            console.log("Reservation Subscription failed");
            return prev;
          }
          const newFeedItem = subscriptionData.data.LaserCutterReservation;
          console.log("Reservation prev", prev);
          console.log("Reservation sub data", subscriptionData.data);
          switch (subscriptionData.data.LaserCutterReservation.reserveStatus) {
            // TODO: other cases!
            case 0:
              if (
                prev.laserCutterReservation.find(
                  (obj) => obj.teamId === newFeedItem.teamId
                )
              ) {
                // 已存在，狀態：改為'使用完成'
                console.log("Reservation Case Existed and Cancel");
                return Object.assign({}, prev, {
                  laserCutterReservation: prev.laserCutterReservation.filter(
                    (reserve) => reserve.teamId !== newFeedItem.teamId
                  ),
                });
              }
              break;
            case 1:
              console.log("Receive New Reservation");
              return Object.assign({}, prev, {
                laserCutterReservation: [
                  ...prev.laserCutterReservation,
                  newFeedItem,
                ],
              });

            default:
              console.log("Reservation Case undefined");
              return Object.assign({}, prev, {
                laserCutterReservation: prev.laserCutterReservation,
              });
          }
        },
      });
    } catch (error) {
      console.log(error);
    }
  }, [subscribeToReserve]);

  useEffect(() => {
    setLaserNumber(data?.laserCutter.length);
    setLaserIdx([...Array(data?.laserCutter.length).keys()].map((i) => i + 1));
    setLaserCutterInfo(data?.laserCutter);
  }, [data?.laserCutter]);

  useEffect(() => {
    console.log("arrange:", arrange);
  }, [arrange]);

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

  if (loading) {
    return "Loading...";
    // console.log("data:", data?.laserCutter);
    // setLaserCutterInfo(data.laserCutter);
  }
  if (reserveLoading) {
    return "Loading...";
  }
  console.log(
    "data:",
    data?.laserCutter
    // data?.laserCutter.map((ls) => ls.id)
  );
  console.log("laserCutterReservation: ", reserveData.laserCutterReservation);
  // setDataRow(reserveData.laserCutterReservation)

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
                  value={`雷切${laserNumber + 1}`}
                  helperText={laserNo ? "" : "不可更改ID"}
                />
                <Button
                  variant="contained"
                  size="small"
                  sx={{
                    backgroundColor: "rgba(255,255,255, 0.7)",
                    color: "black",
                    borderRadius: 10,
                  }}
                  onClick={() => {
                    newLeichie({
                      variables: {
                        info: {
                          id: laserNumber + 1,
                          status: 0,
                          duration: laserTime,
                          user: null,
                          completeTime: null,
                        },
                      },
                    });
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
          laserCutterInfo={data.laserCutter}
          laserNumber={data.laserCutter.length}
          setLaserNumber={setLaserNumber}
          laserIdx={[...Array(data.laserCutter.length).keys()].map(
            (i) => i + 1
          )}
          setLaserIdx={setLaserIdx}
          deleteLeichei={deleteLeichie}
          updatedLeichie={updatedLeichie}
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
              setLaserTime(e.target.value);
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
              {reserveData.laserCutterReservation.map((row, i) => (
                <TableRow
                  key={row.teamId}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row" align="center">
                    {`Team ${row.teamId}`}
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
                      defaultValue={""}
                      value={arrange}
                      onChange={(e) => {
                        setArrange(e.target.value);
                        console.log(e.target.value);
                        console.log("arrange:", arrange);
                      }}
                    >
                      {laserCutterInfo?.map((item) => {
                        if (item.status === 0)
                          return (
                            <MenuItem
                              key={parseInt(item.id)}
                              value={parseInt(item.id)}
                            >
                              雷切{parseInt(item.id)}
                            </MenuItem>
                          );
                      })}
                      <MenuItem key={99} value={99}>
                        移除
                      </MenuItem>
                    </Select>
                    <Button
                      size="small"
                      sx={{ color: "rgba(255,255,255, 0.8)" }}
                      endIcon={<SendIcon />}
                      value={row.teamId} // 第幾組
                      onClick={(e) => {
                        if (!arrange) return alert("請選擇排程項目");
                        setRemoveId(row.teamId);
                        console.log("del row = " + i);
                        console.log("del team = " + row.teamId);

                        if (arrange === 99) {
                          alert("將隊伍 " + row.teamId + " 移除等候隊伍");
                        } else {
                          // update laser cutter info
                          let laserCutterID = String(arrange);
                          console.log("laserCutterID: ", laserCutterID);
                          updatedLeichie({
                            variables: {
                              info: {
                                id: laserCutterID,
                                status: 1,
                                duration: parseInt(laserTime),
                                user: row.teamId,
                                completeTime: completeTime(laserTime),
                              },
                            },
                          });
                          alert(
                            "已將隊伍 " +
                              row.teamId +
                              " 排入使用：雷切" +
                              arrange +
                              "，請按下 '確定' 以完成分發。"
                          );
                        }
                        cancelReserve({ variables: { teamId: row.teamId } });
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

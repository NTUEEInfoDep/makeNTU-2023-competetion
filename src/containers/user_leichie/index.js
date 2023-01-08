import LaserCutterBox from "./leichieBox";
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
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { bgcolor, width } from "@mui/system";
import EditIcon from "@mui/icons-material/Edit";
import { useMutation, useQuery, useLazyQuery } from "@apollo/client";
import {
  LEICHIE_QUERY,
  LEICHIE_RESERVE_QUERY,
  CREATE_LEICHIE_RESERVE,
  CANCEL_LEICHIE_RESERVE,
  LASERCUTTER_RESERVE_SUBSCRIPTION,
} from "../../graphql";
import { useSelector } from "react-redux";
import { selectSession } from "../../slices/sessionSlice";
// --- --- ---
export default function LaserCutter() {
  // --- States ---
  const { isLogin, authority, teamID } = useSelector(selectSession);
  const [open, setOpen] = useState(false); // 開啟預約管理
  const [reserved, setReserved] = useState(false); // 是否已預約借用
  const [material, setMaterial] = useState(""); // 預約雷切機 材料
  const [thickness, setThickness] = useState(""); // 預約雷切機 厚度
  const [waiting, setWaiting] = useState(0);
  const [teamId, setTeamId] = useState(!authority ? teamID : 0);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  // const [teamReserve, setTeamReserve] = useState([]);
  const [newReserve] = useMutation(CREATE_LEICHIE_RESERVE);
  const [cancelReserve] = useMutation(CANCEL_LEICHIE_RESERVE);
  const [getReserve, { loading, data, subscribeToMore }] = useLazyQuery(
    LEICHIE_RESERVE_QUERY
  );

  useEffect(() => {
    try {
      console.log("data ", data);
      subscribeToMore({
        document: LASERCUTTER_RESERVE_SUBSCRIPTION,
        variables: {},
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData.data) {
            console.log("Subscription failed");
            return prev;
          }
          const newReserveInfo = subscriptionData.data.LaserCutterReservation;
          // setTeamReserve(newReserveInfo);
          console.log(
            "prev.laserCutterReservation",
            prev.laserCutterReservation
          );
          console.log("sub data", subscriptionData.data);
          if (newReserveInfo.teamId == teamId) {
            switch (newReserveInfo.reserveStatus) {
              case 0:
                // cancel
                setReserved(false);
                return Object.assign({}, prev, {
                  laserCutterReservation: prev.laserCutterReservation.filter(
                    (reserve) => reserve.teamId !== newReserveInfo.teamId
                  ),
                });

              case 1:
                // create
                return Object.assign({}, prev, {
                  laserCutterReservation: [
                    ...prev.laserCutterReservation,
                    newReserve,
                  ],
                });
              default:
                console.log(
                  "Reservation Case undefined, return original data."
                );
                return Object.assign({}, prev, {
                  laserCutterReservation: prev.laserCutterReservation,
                });
            }
          } else {
            switch (newReserveInfo.reserveStatus) {
              case 0:
                // cancel
                // waitingNum();
                return Object.assign({}, prev, {
                  laserCutterReservation: prev.laserCutterReservation.filter(
                    (reserve) => reserve.teamId !== newReserveInfo.teamId
                  ),
                });

              case 1:
                // create
                // waitingNum();
                return Object.assign({}, prev, {
                  laserCutterReservation: [
                    ...prev.laserCutterReservation,
                    newReserve,
                  ],
                });
              default:
                console.log(
                  "Reservation Case undefined, return original data."
                );
                return Object.assign({}, prev, {
                  laserCutterReservation: prev.laserCutterReservation,
                });
            }
          }
        },
      });
    } catch (error) {
      console.log(error);
    }
  }, [subscribeToMore]);

  useEffect(() => {
    waitingNum();
    getMaterialThickness();
  }, [data]);

  // failed
  const getMaterialThickness = () => {
    getReserve().then((res) => {
      const { laserCutterReservation } = res.data;
      console.log(
        "res.thickness",
        laserCutterReservation?.find((team) => team.teamId == teamId)
          ?.thickness ?? ""
      );
      setMaterial(
        laserCutterReservation?.find((team) => team.teamId == teamId)
          ?.material ?? ""
      );
      setThickness(
        laserCutterReservation?.find((team) => team.teamId == teamId)
          ?.thickness ?? ""
      );
    });
  };

  const waitingNum = () => {
    getReserve().then((res) => {
      const { laserCutterReservation } = res.data;
      var c = 0;

      if (laserCutterReservation) {
        setWaiting(laserCutterReservation.length);
        laserCutterReservation.map((reserve, i) => {
          console.log(i, "reserve", reserve);
          if (reserve.teamId == teamId) {
            setReserved(true);
            setWaiting(i);
            console.log(c, "count", waiting);
          }
          // setWaiting(laserCutterReservation.length);
        });
      }
    });
  };

  const materialString = (material) => {
    if (material == 1) return "壓克力";
    if (material == 2) return "密集板";
  };

  const thicknessString = (thickness) => {
    if (thickness == 1) return "5";
    if (thickness == 2) return "3";
  };
  const modalStyle = {
    display: "flex",
    flexWrap: "wrap",
    p: 3,
  };

  // 借用登記
  const borrowForm = (
    <>
      <Box component="form" sx={modalStyle}>
        <FormControl style={{ minWidth: 100 }}>
          {/* 選取材料 */}
          <InputLabel id="demo-simple-select-label">材料</InputLabel>
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
            value={material}
            label="材料"
            defaultValue="壓克力"
            onChange={(e) => {
              setMaterial(e.target.value);
            }}
          >
            <MenuItem value={"壓克力"}>壓克力</MenuItem>
            <MenuItem value={"密集板"}>密集板</MenuItem>
          </Select>
        </FormControl>

        <FormControl style={{ minWidth: 100 }}>
          {/* 選取厚度 */}
          <InputLabel id="demo-simple-select-label">厚度</InputLabel>
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
            value={thickness}
            label="厚度"
            // defaultValue="5"
            onChange={(e) => {
              setThickness(e.target.value);
            }}
          >
            <MenuItem value={"5"}>5 mm</MenuItem>
            <MenuItem value={"3"}>3 mm</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <DialogActions sx={{ bgcolor: "rgba(0,0,0)" }}>
        <Button onClick={handleClose}>離開</Button>
        <Button
          disabled={!material || !thickness}
          onClick={() => {
            setReserved(true); // 使用完成後要設定為false
            setOpen(!open);
            console.log(teamId, "material: ", materialString(material));
            console.log("thickness: ", thicknessString(thickness));
            // send to DB
            newReserve({
              variables: {
                info: {
                  teamId,
                  material: material,
                  thickness: thickness,
                },
              },
            });
          }}
        >
          送出
        </Button>
      </DialogActions>
    </>
  );
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {loading ? "loading" : ""}
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
        <p>雷射切割機 預約管理</p>
      </Box>

      <Box sx={{ width: "90%", border: 0, fontSize: 28, padding: 1 }}>
        <p>
          {reserved
            ? `Team #${teamId} 已登記借用：
            ${material}（${thickness} mm）`
            : `Team #${teamId} 未預約`}
        </p>

        <Stack direction="row" spacing={2} sx={{ width: "50%" }}>
          <Button
            size="large"
            sx={{ color: "rgba(255,255,255)", border: 1 }}
            startIcon={<EditIcon />}
            onClick={handleOpen}
            disabled={reserved}
          >
            我要預約
          </Button>
          <Button
            size="large"
            sx={{ color: "rgba(255,255,255)", border: 1 }}
            startIcon={<EditIcon />}
            onClick={() => {
              setReserved(false);
              cancelReserve({ variables: { teamId } });
            }}
            disabled={!reserved}
          >
            取消預約
          </Button>
        </Stack>

        {/* 新增雷切機的視窗 */}
        <Dialog disableEscapeKeyDown open={open} onClose={handleClose}>
          {/* <DialogTitle sx={{ bgcolor: "rgba(0,0,0)" }}>借用資訊</DialogTitle> */}
          <DialogContent sx={{ bgcolor: "rgba(0,0,0)" }}>
            {reserved ? "" : borrowForm}
          </DialogContent>
        </Dialog>

        <p style={{ fontSize: "20px", marginTop: "50px" }}>
          {/* 雷切機數量：{laserNumber} 台 */}
        </p>
        {/* <p style={{ fontSize: "20px" }}>使用時間上限：{laserTime} mins</p> */}
        {/* <Button
          size="small"
          sx={{ color: "rgba(255,255,255)", border: 1, borderRadius: 20 }}
          onClick={() => {
            waitingNum();
          }}
        >
          刷新
        </Button> */}
        <p style={{ fontSize: "20px" }}>需等候組數：{waiting}</p>
        {/* <p style={{ fontSize: "20px" }}>請重新整理畫面更新訊息</p> */}
      </Box>

      <Stack
        direction="column"
        sx={{
          // width: "90%",
          // height: 80,
          fontSize: 20,
          fontWeight: "medium",
          display: "flex",
          // justifyContent: "space-between",
          // alignItems: "center",
        }}
      ></Stack>
    </Box>
  );
}

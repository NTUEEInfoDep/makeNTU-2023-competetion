import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Element } from "react-scroll";
import { makeStyles } from "@mui/styles";
import { Grid, Paper, Typography } from "@mui/material/";
import { useHistory } from "react-router-dom";
import { selectSession } from "../../slices/sessionSlice";
import DPCard from "./card";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import { FormControl } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import SendIcon from "@mui/icons-material/Send";
import { useQuery, useMutation } from "@apollo/client";
import AddTaskIcon from "@mui/icons-material/AddTask";
import {
  CREATE_MACHINE_MUTATION,
  USER_RESERVE_MACHINE_MUTATION,
  USER_CANCEL_MACHINE_MUTATION,
  CLEAR_MACHINE_MUTATION,
  DELETE_MACHINE_MUTATION,
  ADMIN_UPDATE_USER_MUTATION,
  UPDATE_ALL_MUTATION,
  ADMIN_UPDATE_MACHINE,
  MACHINE_UPDATE_SUBSCRIPTION,
  USER_UPDATE_SUBSCRIPTION,
  CLEAR_USER_MUTATION,
  MACHINE_QUERY,
  USER_QUERY,
} from "../../graphql";
import TextField from "@mui/material/TextField";
/**
 * This is Main Page
 */

export default function Top(props) {
  const { isLogin, authority, teamID } = useSelector(selectSession);
  const [userList, setUserList] = useState([]);
  const [machineList, setMachineList] = useState([]);

  const [createMachine] = useMutation(CREATE_MACHINE_MUTATION);
  const [clearMachine] = useMutation(CLEAR_MACHINE_MUTATION);
  const [deleteMachine] = useMutation(DELETE_MACHINE_MUTATION);
  const [userReserveMachine] = useMutation(USER_RESERVE_MACHINE_MUTATION);
  const [userCancelMachine] = useMutation(USER_CANCEL_MACHINE_MUTATION);
  const [adminUpdateUser] = useMutation(ADMIN_UPDATE_USER_MUTATION);
  const [adminUpdateMachine] = useMutation(ADMIN_UPDATE_MACHINE);
  const [updateAll] = useMutation(UPDATE_ALL_MUTATION);
  const [clearUser] = useMutation(CLEAR_USER_MUTATION);

  // Arrange Machine
  const [arrangeMachineOpen, setArrangeMachineOpen] = React.useState(false);
  const [arrangeMachineName, setArrangeMachineName] = React.useState("");

  const [currentArrangeUser, setCurrentArrangeUser] = React.useState(-1);
  // Arrange Machine End

  // User Request
  const [userRequestOpen, setUserRequestOpen] = React.useState(false);
  const [userRequestFinish, setUserRequestFinish] = React.useState(false);

  // User Request End
  const [finishUserOpen, setFinishUserOpen] = React.useState(false);
  const [finishUser, setFinishUser] = React.useState(-1);

  const [buttonState, setButtonState] = React.useState(0);
  const [howToUseOpen, setHowToUseOpen] = React.useState(false);
  const [deleteMachineOpen, setDeleteMachineOpen] = React.useState(false);
  const [newMachineOpen, setNewMachineOpen] = React.useState(false);
  const [newMachineName, setNewMachineName] = React.useState("");
  const [newMachineTime, setNewMachineTime] = React.useState(0);
  const [clearMachineOpen, setClearMachineOpen] = React.useState(false);
  const [clearUserOpen, setClearUserOpen] = React.useState(false);
  const [description, setDescription] = React.useState(false);

  const { data, loading, error, subscribeToMore } = useQuery(MACHINE_QUERY);
  const {
    data: userData,
    loading: userLoading,
    subscribeToMore: userSubscribeToMore,
  } = useQuery(USER_QUERY);

  useEffect(() => {
    try {
      subscribeToMore({
        document: MACHINE_UPDATE_SUBSCRIPTION,
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData.data) return prev;
          const machines = subscriptionData.data.machineUpdated;
          return Object.assign({}, prev, {
            machine: machines,
          });
        },
      });
    } catch (error) {
      console.log(error);
    }
  }, [subscribeToMore]);

  useEffect(() => {
    try {
      userSubscribeToMore({
        document: USER_UPDATE_SUBSCRIPTION,
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData.data) return prev;
          const users = subscriptionData.data.userUpdated;
          return Object.assign({}, prev, {
            user: users,
          });
        },
      });
    } catch (error) {
      console.log(error);
    }
  }, [userSubscribeToMore]);

  useEffect(() => {
    if (data) {
      setMachineList(data.machine);
    }
    if (userData) {
      setUserList(userData.user);
    }
  }, [data, userData]);

  const history = useHistory();
  const useStyles = makeStyles(() => ({
    root: {
      flexGrow: 1,
      width: "100%",
      height: "85vh",
      overflow: "auto",
    },
    paper: {
      background: "rgb(0,0,0,.0)",
      boxShadow: "none",
    },
    text: {
      margin: "auto",
      textAlign: "start",
      width: "80%",
    },
    time: {
      margin: "auto",
      color: "#F5DE83",
      textAlign: "end",
      width: "70%",
      fontWeight: "400",
    },
    block: {
      borderRadius: 3,
      border: "10px solid #1E1E1E",
      backgroundColor: "#1E1E1E",
    },
    subBlock: {
      border: "5px solid #121212",
    },
    waitingQueueHeader: {
      border: "5px solid #1E1E1E",
    },
  }));

  const handleNewMachine = () => {
    createMachine({
      variables: {
        input: {
          name: newMachineName,
          type: "3D Printer",
          duration: newMachineTime,
        },
      },
    });
    setNewMachineOpen(false);
  };

  // Arrange Machine
  const handleArrangeMachine = () => {
    const idleMachineList = machineList.filter(
      (machine) => machine.status === -1
    );
    if (idleMachineList.length === 0) {
      alert("目前沒有空閒的機器！");
      return;
    }
    const currentUser = userList.filter(
      (user) => user.id === currentArrangeUser
    )[0];

    adminUpdateUser({
      variables: {
        input: {
          teamId: currentUser.teamId,
          status: 1,
          machineName: arrangeMachineName,
        },
      },
    });

    setCurrentArrangeUser(-1);
    setArrangeMachineOpen(false);
  };
  // Arrange Machine End

  // User Request
  const handleUserRequest = () => {
    console.log(parseInt(teamID));
    userReserveMachine({
      variables: {
        input: {
          teamId: parseInt(teamID),
        },
      },
    });
    setUserRequestFinish(true);
    setUserRequestOpen(false);
  };

  // User Request End

  const showMachineList = () => {
    let idleMachineList = machineList.filter(
      (machine) => machine.status === -1
    );
    return idleMachineList.map((machine) => {
      return <MenuItem value={machine.name}>{machine.name}</MenuItem>;
    });
  };

  const deleteCard = (id) => {
    console.log("deleteCard", id);
    setMachineList((machineList) =>
      machineList.filter((machine) => machine.id !== id)
    );
  };

  const handleNewMachineClickOpen = () => {
    setNewMachineOpen(true);
  };

  const resetCard = (name) => {
    adminUpdateMachine({
      variables: {
        input: {
          name: name,
          status: -1,
        },
      },
    });
  };

  useEffect(() => {
    if (userRequestFinish) {
      setTimeout(() => {
        setUserRequestFinish(false);
      }, 3000);
    }
  });

  const handleDeleteMachines = () => {
    clearMachine();
    setClearMachineOpen(false);
  };

  const handleFinishUser = () => {
    const currentUser = userList.filter((user) => user.id === finishUser)[0];
    adminUpdateUser({
      variables: {
        input: {
          teamId: currentUser.teamId,
          status: 2,
        },
      },
    });
    setFinishUserOpen(false);
  };

  const handleNewMachineClose = () => {
    setNewMachineOpen(false);
  };

  const handleClearUser = () => {
    clearUser();
    setClearUserOpen(false);
  };

  const showWaitingQueue = () => {
    let waitingQueue = userList.filter((user) => user.status === 0);
    return waitingQueue.map((data, index) => (
      <Grid item xs={12}>
        <Typography
          variant="body1"
          style={{
            color: "black",
            backgroundColor: "white",
            fontSize: "1rem",
            borderRadius: "5px",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          align={"center"}
          onClick={() => {
            setArrangeMachineOpen(true);
            setCurrentArrangeUser(data.id);
          }}
        >
          <p style={{ width: "100%" }}>順序：{index}</p>
          <p style={{ width: "100%" }}>隊伍：{data.teamId}</p>
        </Typography>
      </Grid>
    ));
  };
  const showReadyQueue = () => {
    let readyQueue = userList.filter((user) => user.status === 1);
    return readyQueue.map((data, index) => (
      <Grid item xs={12}>
        <Typography
          variant="body1"
          style={{
            color: "black",
            backgroundColor: "white",
            fontSize: "1rem",
            borderRadius: "5px",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          align={"center"}
          onClick={() => {
            setFinishUserOpen(true);
            setFinishUser(data.id);
          }}
        >
          <p style={{ width: "100%" }}>順序：{index}</p>
          <p style={{ width: "100%" }}>隊伍：{data.teamId}</p>
        </Typography>
      </Grid>
    ));
  };

  const returnButton = () => {
    const currentUser = userList.filter(
      (user) => user.teamId === parseInt(teamID)
    )[0];
    if (currentUser !== undefined) {
      if (currentUser.status === 0) {
        return (
          <Button
            variant="contained"
            color={"info"}
            style={{
              width: "250px",
              height: "250px",
              borderRadius: "125px",
              fontSize: "30px",
            }}
            endIcon={<AddTaskIcon />}
            onClick={() => {
              setUserRequestOpen(true);
            }}
            disabled
          >
            預約完成
          </Button>
        );
      } else if (currentUser.status === 1) {
        const myMachine = machineList.filter((machine) => {
          return machine.name === currentUser.machine;
        })[0];
        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div style={{ width: "100%" }}>
              <Button
                variant="contained"
                color={"info"}
                style={{
                  width: "250px",
                  height: "250px",
                  borderRadius: "125px",
                  fontSize: "30px",
                }}
                endIcon={<AddTaskIcon />}
                onClick={() => {
                  setUserRequestOpen(true);
                }}
                disabled
              >
                使用中
              </Button>
            </div>
            <div>
              <Typography>
                <p>可使用機台：{myMachine.name}</p>
                <p>預計使用時間：{myMachine.duration}分鐘</p>
              </Typography>
            </div>
          </div>
        );
      }
    } else {
      return (
        <Button
          variant="contained"
          color={"success"}
          style={{
            width: "250px",
            height: "250px",
            borderRadius: "125px",
            fontSize: "30px",
          }}
          endIcon={<SendIcon />}
          onClick={() => {
            setUserRequestOpen(true);
          }}
        >
          我要預約
        </Button>
      );
    }
  };

  const classes = useStyles();

  if (loading || userLoading) return "Loading...";

  return (
    <>
      {authority === 0 && buttonState === 0 && (
        <>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography
              style={{
                alignItems: "center",
                justifyContent: "center",
                margin: "15px",
              }}
            >
              <h1>目前有 {machineList.length} 台3D列印機可以使用</h1>
              <h1>前方目前有 {userList.length} 位使用者</h1>
            </Typography>
            <Button
              variant={"outlined"}
              style={{ width: "100px", height: "100px" }}
              onClick={() => setDescription(true)}
            >
              使用說明
            </Button>
          </div>
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {returnButton()}
          </div>
        </>
      )}
      {authority === 0 && userRequestFinish && (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "30px",
          }}
        >
          <h1 style={{ color: "green" }}>預約成功</h1>
        </div>
      )}
      {authority === 1 && (
        <Element name="title">
          {/*<div className={classes.root}>*/}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div>
              <Typography>
                <h1>MakeNTU 3D列印機管理介面</h1>
              </Typography>
            </div>
            <div>
              <Button onClick={() => setHowToUseOpen(true)}>操作說明</Button>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={handleNewMachineClickOpen}
                  style={{ width: "100%", height: "100px" }}
                >
                  新增機台
                </Button>
              </Grid>
              <Grid item xs={4}>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => setClearMachineOpen(true)}
                  style={{ width: "100%", height: "100px" }}
                >
                  清除機台
                </Button>
              </Grid>
              <Grid item xs={4}>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => setClearUserOpen(true)}
                  style={{ width: "100%", height: "100px" }}
                >
                  清除使用者
                </Button>
              </Grid>
            </Grid>
          </div>
          <div style={{ height: "10px" }}></div>
          <Grid container spacing={2}>
            {/**/}
            <Grid item xs={10}>
              <Grid container spacing={2}>
                {machineList.map((data, index) => (
                  <Grid item xs={2}>
                    <DPCard
                      data={data}
                      deleteCard={deleteCard}
                      _new={false}
                      authority={authority}
                      setUserList={setUserList}
                      resetCard={resetCard}
                    />
                  </Grid>
                ))}
                <Grid item xs={3}>
                  <DPCard
                    _new={true}
                    authority={authority}
                    setMachineList={setMachineList}
                  />
                </Grid>
              </Grid>
            </Grid>
            {/*waiting queue*/}
            <Grid item xs={1}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Paper className={classes.waitingQueueHeader}>
                    <Typography
                      // variant="h6"
                      style={{ color: "#F5DE83", fontSize: "1.5rem" }}
                      align={"center"}
                    >
                      等待中
                    </Typography>
                  </Paper>
                </Grid>
                {showWaitingQueue()}
              </Grid>
            </Grid>
            {/*ready queue*/}
            <Grid item xs={1}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Paper className={classes.waitingQueueHeader}>
                    <Typography
                      // variant="h6"
                      style={{ color: "#F5DE83", fontSize: "1.5rem" }}
                      align={"center"}
                    >
                      使用中
                    </Typography>
                  </Paper>
                </Grid>
                {showReadyQueue()}
              </Grid>
            </Grid>
          </Grid>
          {/*</div>*/}
        </Element>
      )}
      <Dialog open={arrangeMachineOpen}>
        <DialogTitle>安排機台</DialogTitle>
        <DialogContent>
          <DialogContentText style={{ height: "100px" }}>
            請安排機台！
          </DialogContentText>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">選擇機台</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={arrangeMachineName}
              label="arrangeMachineName"
              onChange={(e) => setArrangeMachineName(e.target.value)}
            >
              {showMachineList()}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setArrangeMachineOpen(false)}>取消</Button>
          <Button onClick={handleArrangeMachine}>安排</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={userRequestOpen}>
        <DialogTitle>預約機台</DialogTitle>
        <DialogContent>
          <DialogContentText style={{ height: "100px" }}>
            <div>總共有 {machineList.length} 台機台</div>
            <div>前面有 {userList.length} 個人在等待</div>
          </DialogContentText>
        </DialogContent>
        <DialogActions
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Button onClick={() => setUserRequestOpen(false)}>取消</Button>
          <Button onClick={handleUserRequest}>預約</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={finishUserOpen}>
        <DialogTitle>結束</DialogTitle>
        <DialogContent>
          <DialogContentText style={{ height: "100px" }}>
            請結束機台！
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFinishUserOpen(false)}>取消</Button>
          <Button onClick={handleFinishUser}>結束</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={howToUseOpen}>
        <DialogTitle>操作說明</DialogTitle>
        <DialogContent>
          <DialogContentText style={{ height: "100px" }}>
            <div>1. 點選新增機台，可以新增機台，請注意不要重複命名</div>
            <div>2. 點選清除機台，可以清除所有機台</div>
            <div>3. 點選清除使用者，可以清除所有在預約或使用中的使用者</div>
            <div>4. 等待中下面的卡片點選後可以安排機台給參賽者</div>
            <div>5. 使用中下面的卡片點選後可以結束使用</div>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setHowToUseOpen(false)}>關閉</Button>
          {/*<Button onClick={handleFinishUser}>結束</Button>*/}
        </DialogActions>
      </Dialog>
      <Dialog open={description}>
        <DialogTitle>操作說明</DialogTitle>
        <DialogContent>
          <DialogContentText style={{ height: "100px" }}>
            <div>
              1. 點選我要預約，即可預約3D列印機，送出後請等待工作人員安排
            </div>
            <div>
              2.
              顯示預約完成，表示成功預約，這時表示正在安排您的機台，若機台全部都在使用中，可能需要等待數分鐘
            </div>
            <div>
              3.
              當圖示變成使用中，表示已排到3D列印機，這時可前往服務台跟工作人員確認並開始使用
            </div>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDescription(false)}>關閉</Button>
          {/*<Button onClick={handleFinishUser}>結束</Button>*/}
        </DialogActions>
      </Dialog>
      <Dialog open={clearMachineOpen}>
        <DialogTitle>刪除所有機台</DialogTitle>
        <DialogContent>
          <DialogContentText style={{ height: "100px" }}>
            <div>請注意：此操作將刪除所有機台</div>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setClearMachineOpen(false)}>關閉</Button>
          <Button onClick={handleDeleteMachines}>刪除</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={clearUserOpen}>
        <DialogTitle>刪除所有使用者</DialogTitle>
        <DialogContent>
          <DialogContentText style={{ height: "100px" }}>
            <div>請注意：此操作將刪除所有使用者</div>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setClearUserOpen(false)}>關閉</Button>
          <Button onClick={handleClearUser}>刪除</Button>
        </DialogActions>
      </Dialog>
      {/*New*/}
      <Dialog open={newMachineOpen}>
        <DialogTitle>機台資訊</DialogTitle>
        <DialogContent>
          <DialogContentText>請填寫欲新增之機台資訊！</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="機台名稱"
            type="text"
            fullWidth
            variant="standard"
            onChange={(e) => setNewMachineName(e.target.value)}
          />
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="使用時間(分鐘)"
            type="number"
            fullWidth
            variant="standard"
            onChange={(e) => setNewMachineTime(parseInt(e.target.value))}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleNewMachineClose}>取消</Button>
          <Button onClick={handleNewMachine}>新增</Button>
        </DialogActions>
      </Dialog>
      {/*<Alert>This is an info alert — check it out!</Alert>*/}
    </>
  );
}

import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { CardHeader, CardMedia } from "@mui/material";
import dpImg from "../../assets/images/3dp.jpg";
import { makeStyles } from "@mui/styles";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import Dialog from "@mui/material/Dialog";
import Slide from "@mui/material/Slide";
import { useMutation } from "@apollo/client";
import {
  CREATE_MACHINE_MUTATION,
  CLEAR_MACHINE_MUTATION,
  DELETE_MACHINE_MUTATION,
  CLEAR_USER_MUTATION,
} from "../../graphql";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} timeout={2} {...props} />;
});

const useStyles = makeStyles(() => ({
  root: {
    background: "linear-gradient(45deg, #FFFFFF 30%, #FFFFFF 90%)",
    transitionDuration: "0.4s",
    border: "10px solid black",
    borderBlockColor: "azure",
    borderRadius: 3,
    boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
    color: "black",
    height: 48,
    padding: "0 30px",
    fontWeight: "bold",
    "&:hover": {
      background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
      color: "white",
    },
  },
  card: {
    "&:hover": {
      transform: "scale(1.1)",
      transition: "all 0.5s ease",
    },
  },
}));

export default function DPCard(props) {
  const { data, _new, authority, resetCard, setMachineList } = props;

  // New Machine
  const [newMachineName, setNewMachineName] = React.useState("");
  const [newMachineTime, setNewMachineTime] = React.useState(0);
  const [newMachineOpen, setNewMachineOpen] = React.useState(false);

  const [createMachine] = useMutation(CREATE_MACHINE_MUTATION);
  const [clearMachine] = useMutation(CLEAR_MACHINE_MUTATION);
  const [deleteMachine] = useMutation(DELETE_MACHINE_MUTATION);
  const [clearUser] = useMutation(CLEAR_USER_MUTATION);
  // New Machine End

  // Delete Machine
  const [deleteMachineOpen, setDeleteMachineOpen] = React.useState(false);
  // Delete Machine End

  const classes = useStyles();

  const getState = () => {
    if (data.status === 1) {
      return (
        <CardHeader
          title={"In Progress"}
          style={{ color: "white", backgroundColor: "red" }}
        />
      );
    } else if (data.status === 2) {
      return (
        <CardHeader
          title={"Finished"}
          style={{ color: "white", backgroundColor: "orange" }}
        />
      );
    } else {
      return (
        <CardHeader
          title={"Enable"}
          style={{ color: "white", backgroundColor: "green" }}
        />
      );
    }
  };

  // New Machine
  const handleNewMachineClickOpen = () => {
    setNewMachineOpen(true);
  };

  const handleNewMachineClose = () => {
    setNewMachineOpen(false);
  };

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
  // New Machine End

  // Delete Machine
  const handleDeleteMachineClickOpen = () => {
    setDeleteMachineOpen(true);
  };

  const handleDeleteMachineClose = () => {
    setDeleteMachineOpen(false);
  };

  const handleClearUser = () => {
    clearUser();
  };

  const handleDeleteMachines = () => {
    clearMachine();
  };

  const handleDeleteMachine = () => {
    deleteMachine({
      variables: {
        input: {
          name: data.name,
        },
      },
    });
    setDeleteMachineOpen(false);
  };
  // Delete Machine End

  const getCard = (_new) => {
    console.log(data);
    if (!_new) {
      return (
        <Card className={classes.card}>
          {getState()}
          <CardMedia component="img" image={dpImg} alt="3DP" />
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Grid item xs={12}>
                  <Typography
                    sx={{ fontSize: 20 }}
                    color="text.secondary"
                    gutterBottom
                  >
                    機台名稱：{data.name}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography
                    sx={{ fontSize: 20 }}
                    color="text.secondary"
                    gutterBottom
                  >
                    組別：
                    {data.user === null ? "無" : data.user}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography
                    sx={{ fontSize: 20 }}
                    color="text.secondary"
                    gutterBottom
                  >
                    {data.userId === "-1"
                      ? `時間：${data.time} 分鐘`
                      : `時間：${data.duration} 分鐘`}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            {/*<LinearBuffer></LinearBuffer>*/}
          </CardContent>
          <CardActions>
            <Grid container spacing={2}>
              {authority === 1 && (
                <Grid item xs={4}>
                  <Button
                    size="small"
                    variant="contained"
                    onClick={handleDeleteMachineClickOpen}
                    className={classes.root}
                  >
                    刪除
                  </Button>
                </Grid>
              )}
              {authority === 1 && (
                <Grid item xs={4}>
                  <Button
                    size="small"
                    variant="contained"
                    onClick={() => resetCard(data.name)}
                    className={classes.root}
                  >
                    結束
                  </Button>
                </Grid>
              )}
              {authority === 0 && (
                <Grid item xs={4}>
                  <Button
                    size="small"
                    variant="contained"
                    className={classes.root}
                  >
                    預約
                  </Button>
                </Grid>
              )}
            </Grid>
          </CardActions>
        </Card>
      );
    }
    // else if (authority === 1) {
    //   return (
    //     <Card className={classes.card}>
    //       <CardActions>
    //         <Grid container spacing={2}>
    //           <Grid item xs={12}>
    //             <Button
    //               size="small"
    //               variant="contained"
    //               onClick={handleNewMachineClickOpen}
    //               style={{ width: "100%", height: "100px" }}
    //             >
    //               新增機台
    //             </Button>
    //           </Grid>
    //           <Grid item xs={12}>
    //             <Button
    //               size="small"
    //               variant="contained"
    //               onClick={handleDeleteMachines}
    //               style={{ width: "100%", height: "100px" }}
    //             >
    //               清除機台
    //             </Button>
    //           </Grid>
    //           <Grid item xs={12}>
    //             <Button
    //               size="small"
    //               variant="contained"
    //               onClick={handleClearUser}
    //               style={{ width: "100%", height: "100px" }}
    //             >
    //               清除使用者
    //             </Button>
    //           </Grid>
    //         </Grid>
    //       </CardActions>
    //     </Card>
    //   );
    // }
  };

  return (
    <>
      {getCard(_new)}
      {/*Deletion*/}
      <Dialog
        open={deleteMachineOpen}
        TransitionComponent={Transition}
        keepMounted
        aria-describedby="alert-dialog-slide-description"
        PaperProps={{
          style: {
            backgroundColor: "black",
            color: "white",
            boxShadow: "none",
            borderRadius: "10px",
          },
        }}
      >
        <DialogTitle>
          <Typography align={"center"}>WARNING</Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            <Typography align={"center"}>
              將機台刪除可能會造成需要重新手動匯入。
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteMachineClose}>Disagree</Button>
          <Button
            onClick={handleDeleteMachine}
            style={{ border: "2px solid darkred" }}
          >
            Agree
          </Button>
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
    </>
  );
}

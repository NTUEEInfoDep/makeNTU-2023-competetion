import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import axios from "axios";
import { MachineAPI } from "../../api";

export default function DPOpenDialog({ MachineList, setMachineList }) {
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [time, setTime] = React.useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleNew = () => {
    setOpen(false);
    MachineAPI.postMachine(name, time);
    MachineAPI.getMachines().then((data) => {
      setMachineList(data.data);
    });
  };

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        新增機台
      </Button>
      <Dialog open={open} onClose={handleClose}>
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
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="使用時間(分鐘)"
            type="number"
            fullWidth
            variant="standard"
            onChange={(e) => setTime(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>取消</Button>
          <Button onClick={handleNew}>新增</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

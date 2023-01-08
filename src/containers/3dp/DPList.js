import * as React from "react";
import Box from "@mui/material/Box";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import List from "@mui/material/List";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import DPListSelect from "./DPListSelect";

function renderRow(props) {
  const { index, style, list, machineList } = props;

  console.log("renderRow", list);

  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <>
      <ListItem style={style} key={index} component="div" disablePadding>
        <ListItemButton onClick={handleClick}>
          <ListItemText primary={`${list.id}`} />
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton sx={{ pl: 4 }}>
              <DPListSelect list={machineList} peopleID={list.id} />
            </ListItemButton>
          </List>
        </Collapse>
      </ListItem>
    </>
  );
}

export default function DPList(props) {
  const { list, machineList } = props;

  return (
    <Box
      sx={{
        width: "100%",
        height: 200,
        bgcolor: "background.paper",
      }}
    >
      <List>
        {list.map((item, index) =>
          renderRow({ index, list: item, machineList: machineList })
        )}
      </List>
    </Box>
  );
}

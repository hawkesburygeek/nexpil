import React, { useState, useEffect } from "react";
import ReactDOM from 'react-dom';
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import AddIcon from "@mui/icons-material/Add";
import "../style.css";
import Moment from 'moment';
import CommentIcon from "@mui/icons-material/Comment";
import IconButton from "@mui/material/IconButton";
import Brightness1Icon from "@mui/icons-material/Brightness1";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import ButtonUnstyled from '@mui/core/ButtonUnstyled';
import Stack from "@mui/material/Stack";
import { purple } from "@mui/material/colors";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import jwt from "jwt-simple";
import { Link } from "react-router-dom";
import axios from "axios";
import { server } from "../../../config/server";
import Avatar from '@mui/material/Avatar';
import { useDispatch, useSelector } from "react-redux";
import {
  GET_PATIENT_MEDICATION_DATA,
  GET_ASSIGNED_DATA,
  GET_USER_CHAT,
} from "../../../store/actionNames";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Typography from '@mui/material/Typography';

import { createTheme, ThemeProvider } from "@mui/material/styles";
import MUIRichTextEditor from "mui-rte";


let token = localStorage.getItem("token");

const ColorButton = styled(ButtonUnstyled)(({ theme }) => ({
  color: theme.palette.getContrastText(purple[500]),
  backgroundColor: "#6308F7",
  borderRadius: 15,
  width: 300,
  borderColor:"transparent",
  fontFamily:"poppins",
  "&:hover": {
    backgroundColor: "#6308F7",
  },
}));
let drugData = [];
let noAllergy = "";
drugData = [];
let survey_id = "";

let button_text = ["Mark update", "Mark as done", "Mark new"];

export const Allergy = () => {  
    const [checkAction1, setCheckAction1] = React.useState("disable-check");  
    return (
           <div></div>
    );
}


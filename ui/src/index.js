import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import Link from '@mui/material/Link';
import Typography from "@mui/material/Typography";

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center" >
      {'Copyright © '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      {Copyright()}
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);

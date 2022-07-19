import React from "react";
import ReactDOM from "react-dom";
import "./style/main.scss";
import Entrypoint from "./components/Entrypoint";

// FontAwsome icons
import { library } from "@fortawesome/fontawesome-svg-core";
import { faUser, faPen, faEraser, faArrowsAlt, faObjectUngroup, faSquare, faCircle } from "@fortawesome/free-solid-svg-icons";

library.add(faUser, faPen, faEraser, faArrowsAlt, faObjectUngroup, faSquare, faCircle);

ReactDOM.render(
  React.createElement(Entrypoint),
  document.getElementById("root")
);

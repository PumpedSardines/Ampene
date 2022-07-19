import React from "react";
import Circle from "./Circle";
import Draw from "./Draw";
import Erase from "./Erase";
import Move from "./Move";
import Rectangle from "./Rectangle";
import Select from "./Select";

export default function Logic() {

    return <>
        <Draw />
        <Erase />
        <Move />
        <Circle />
        <Rectangle />
        <Select />
    </>;

}
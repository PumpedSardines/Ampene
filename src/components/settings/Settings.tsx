import React from 'react'
import { useRecoilValue } from 'recoil';
import { classMates } from '../../lib/classMates';
import { _mouse } from '../../state/mouse';
import classes from "./settings.module.scss";

export default function Settings() {
  const { down: mouseDown } = useRecoilValue(_mouse)

  return (
    <div className={classMates([
      classes.button,
      mouseDown && classes["mouse-hidden"]
    ])}>
      <p>Settings</p>
    </div>
  )
}

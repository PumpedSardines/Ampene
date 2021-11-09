import * as React from 'react';
import { useRecoilCallback, useRecoilState, useRecoilValue } from 'recoil';
import Canvas from './Canvas';
import ElectronManager, { _electronManager } from './ElectronManager';
import Layer from './Layer';
import Logic from './Logic';
import { _camera } from './state/camera';
import { _lines } from './state/lines';
import { _mode } from './state/mode';
import { _saveLocation } from './state/save';

const path = require("path");

function App() {
  const saveLocation = useRecoilValue(_saveLocation);
  const electronManager = useRecoilValue(_electronManager);

  if (!electronManager) return <><ElectronManager /></>;


  document.title = saveLocation ? path.basename(saveLocation).split(".")[0] : "InfiCanvas"

  if (!saveLocation) {
    return <div id="load-file">
      <h1>InfiCanvas</h1>
      <button onClick={async () => {
        await electronManager.saveFromDialog();
        await electronManager.pushUndoStack();
      }}>New</button>
      <button onClick={electronManager.loadFromDialog}>Load</button>
    </div>
  }

  return (
    <div id="app">
      <ElectronManager />
      <Panel />
      <Logic />
      <Layer />
      <Canvas />
    </div>
  );
}

function Panel() {
  const [mode, setMode] = useRecoilState(_mode);

  const buttons = [
    {
      name: "Draw",
      id: "draw"
    },
    {
      name: "Erase",
      id: "erase"
    },
    {
      name: "Move",
      id: "move"
    }
  ] as const;

  return <div id="panel">
    <div className="buttons">
      {buttons.map(v => {
        return <button
          key={v.id}
          onClick={() => {
            setMode(v.id);
          }}
          className={v.id === mode ? "selected" : ""}>
          {v.name}
        </button>
      })}
    </div>
    <div id="workspace">

    </div>
  </div>
}

export default App;

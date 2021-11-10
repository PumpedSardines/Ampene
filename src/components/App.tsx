import * as React from 'react';
import Canvas from './draw/Canvas';
import Logic from './logic/Logic';
import Panel from './input/Panel';
import MouseInputLayer from './input/MouseInputLayer';
import Managers from './managers/Managers';

function App() {
  return (
    <div id="app">
      <Managers />

      <div className="renderers">
        <Canvas />
      </div>

      <div className="input">
        <MouseInputLayer />
        <Panel />
      </div>

      <Logic />
    </div>
  );
}

export default App;

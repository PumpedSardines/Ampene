import * as React from 'react';
import Canvas from './draw/Canvas';
import Logic from './logic/Logic';
import Managers from './managers/Managers';
import MouseInputLayer from './mouseInputLayer/MouseInputLayer';
import Panel from './panel/Panel';
import Settings from './settings/Settings';
import Theme from './Theme';

function App() {

  return (
    <>
      <Theme />
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
    </>
  );
}

export default App;

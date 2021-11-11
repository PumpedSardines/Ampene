import * as React from 'react';
import { useRecoilValue } from 'recoil';
import { _saveLocation } from '../../state/save';


const path = require("path");

function Title() {
  const saveLocation = useRecoilValue(_saveLocation);

  document.title = saveLocation ? path.basename(saveLocation).split(".")[0] : "Ampene";

  return <></>;
}

export default Title;

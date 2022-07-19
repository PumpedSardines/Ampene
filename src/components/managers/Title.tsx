import * as React from 'react';
import { useRecoilValue } from 'recoil';
import { IS_ELECTRON } from '../../config';
import { _saveLocation } from '../../state/save';



function Title() {
  const saveLocation = useRecoilValue(_saveLocation);

  if (IS_ELECTRON) {
    const path = require("path");
    document.title = saveLocation ? path.basename(saveLocation).split(".")[0] : "Ampene";
  } else {
    document.title = "Ampene";
  }

  return <></>;
}

export default Title;

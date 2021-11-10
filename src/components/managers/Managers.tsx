/**
 * This component should always be instantiated
 */

import MainProcessCommunication from "./MainProcessCommunication";
import SaveLoad from "./SaveLoad";
import Title from "./Title";
import UndoRedo from "./UndoRedo";

export default function Managers() {
    return <>
        <Title />
        <SaveLoad />
        <UndoRedo />
        <MainProcessCommunication />
    </>
}
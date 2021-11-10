import * as React from "react"
import { RecoilRoot } from "recoil"
import App from "./App"
import Managers from "./managers/Managers"


const Entrypoint = () => {
    return <React.StrictMode>
        <RecoilRoot>
            <Managers />
            <App />
        </RecoilRoot>
    </React.StrictMode>
}

export default Entrypoint;
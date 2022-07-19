import React from 'react'
import ReactDOM from 'react-dom';
import { useRecoilValue } from 'recoil';
import { _theme } from '../state/design';

export default function Theme() {
    const theme = useRecoilValue(_theme);

    

    return ReactDOM.createPortal(
        <style dangerouslySetInnerHTML={{
            __html: `

            :root {
                --background: ${theme.background};
                --background-alt: ${theme.backgroundAlt};
                --contrast: ${theme.contrast};
                --contrast-alt: ${theme.contrastAlt};
                --highlight: ${theme.highlight};
            }
            
            `
        }}></style>
    , document.head)
}

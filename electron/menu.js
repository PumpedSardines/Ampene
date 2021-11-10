const { app, Menu } = require('electron');
const isMac = process.platform === 'darwin'

module.exports = (win) => {
    const template = [
        // { role: 'appMenu' }
        ...(isMac ? [{
            label: app.name,
            submenu: [
                { role: 'about' },
                { type: 'separator' },
                { role: 'services' },
                { type: 'separator' },
                { role: 'hide' },
                { role: 'hideOthers' },
                { role: 'unhide' },
                { type: 'separator' },
                { role: 'quit' }
            ]
        }] : []),
        // { role: 'fileMenu' }
        {
            label: 'File',
            submenu: [
                {
                    label: 'New File',
                    accelerator: 'CommandOrControl+N',
                    click(item, focusedWindow) {
                        win.webContents.send('new-data', "bruh");
                    },
                },
                {
                    label: 'Open File',
                    accelerator: 'CommandOrControl+O',
                    click(item, focusedWindow) {
                        win.webContents.send('load-data', "bruh");
                    },
                },
                {
                    label: 'Save File',
                    accelerator: 'CommandOrControl+S',
                    click(item, focusedWindow) {
                        win.webContents.send('store-data', "bruh");
                    },
                },
                {
                    label: 'Duplicate',
                    accelerator: 'CommandOrControl+Shift+S',
                    click(item, focusedWindow) {
                        win.webContents.send('duplicate-data', "bruh");
                    },
                },
                isMac ? { role: 'close' } : { role: 'quit' }
            ]
        },
        // { role: 'editMenu' }
        {
            label: 'Edit',
            submenu: [
                {
                    label: 'Undo',
                    accelerator: 'CommandOrControl+Z',
                    click(item, focusedWindow) {
                        win.webContents.send('undo', "bruh");
                    },
                },
                {
                    label: 'Redo',
                    accelerator: 'CommandOrControl+Shift+Z',
                    click(item, focusedWindow) {
                        win.webContents.send('redo', "bruh");
                    },
                },
                { type: 'separator' },
                {
                    label: "Mode",
                    submenu: [
                        {
                            label: "Draw",
                            accelerator: "1",
                            click(item, focusedWindow) {
                                win.webContents.send('set-mode', "draw");
                            },
                        },
                        {
                            label: "Erase",
                            accelerator: "2",
                            click(item, focusedWindow) {
                                win.webContents.send('set-mode', "erase");
                            },
                        },
                        {
                            label: "Move",
                            accelerator: "3",
                            click(item, focusedWindow) {
                                win.webContents.send('set-mode', "move");
                            },
                        }
                    ]
                }
            ]
        },
        // { role: 'viewMenu' }
        {
            label: 'View',
            submenu: [
                { role: 'reload' },
                { role: 'forceReload' },
                { role: 'toggleDevTools' },
                { type: 'separator' },
                { role: 'resetZoom' },
                { role: 'zoomIn' },
                { role: 'zoomOut' },
                { type: 'separator' },
                { role: 'togglefullscreen' }
            ]
        },
        // { role: 'windowMenu' }
        {
            label: 'Window',
            submenu: [
                { role: 'minimize' },
                { role: 'zoom' },
                ...(isMac ? [
                    { type: 'separator' },
                    { role: 'front' },
                    { type: 'separator' },
                    { role: 'window' }
                ] : [
                    { role: 'close' }
                ])
            ]
        },
        {
            role: 'help',
            submenu: [
                {
                    label: 'Credits',
                    click: async () => {
                        const { shell } = require('electron')
                        await shell.openExternal('https://electronjs.org')
                    }
                }
            ]
        }
    ]

    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
}

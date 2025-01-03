import { app, BaseWindow, WebContentsView } from 'electron'
import { join } from 'path'
import { electronApp, is } from '@electron-toolkit/utils'

function createWindow() {
    electronApp.setAppUserModelId('com.stoneark')

    const win = new BaseWindow({
        width: 800,
        height: 600,
        //titleBarStyle: 'hidden',
        //titleBarOverlay: true
    })

    let w = win.getContentSize()[0];
    let d = win.getContentSize()[1];

    const bound = 0

    let topbar_h = 22+6+6+2
    let leftbar_w = 0
    let rightbar_w = 0

    const parentView = new WebContentsView()
    win.contentView.addChildView(parentView)

    parentView.setBounds({ x: 0, y: 0, width: w, height: d })
    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
        parentView.webContents.loadURL(process.env['ELECTRON_RENDERER_URL'])
    } else {
        parentView.webContents.loadFile(join(__dirname, '../renderer/index.html'))
    }

    const browserView = new WebContentsView()
    win.contentView.addChildView(browserView)

    browserView.setBounds({
        x: leftbar_w+bound,
        y: topbar_h+bound,
        width: w-leftbar_w-rightbar_w-2*bound,
        height: d-topbar_h-2*bound
    })

    browserView.webContents.loadURL('https://kimi.moonshot.cn')
    //browserView.webContents.loadURL('https://www.doubao.com/chat/search')

    win.on('resize',() => {
        w = win.getContentSize()[0];
        d = win.getContentSize()[1];

        parentView.setBounds({ x: 0, y: 0, width: w, height: d })
        browserView.setBounds({
            x: leftbar_w+bound,
            y: topbar_h+bound,
            width: w-leftbar_w-rightbar_w-2*bound,
            height: d-topbar_h-2*bound
        })
    })
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    app.quit();
});


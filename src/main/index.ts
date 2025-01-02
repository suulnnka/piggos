const { app, BaseWindow, WebContentsView} = require('electron')

function createWindow() {

    let w = 800
    let d = 600
    const bound = 8

    const win = new BaseWindow({
        width: w,
        height: d,
        //titleBarStyle: 'hidden',
        //titleBarOverlay: true
    })

    w = win.getContentSize()[0];
    d = win.getContentSize()[1];

    const parentView = new WebContentsView()
    win.contentView.addChildView(parentView)

    parentView.setBounds({ x: 0, y: 0, width: w, height: d })
    //parentView.webContents.loadURL('https://kimi.moonshot.cn')
    parentView.webContents.loadFile('src/renderer/black.html')

    const leftView = new WebContentsView()
    win.contentView.addChildView(leftView)

    const rightView = new WebContentsView()
    win.contentView.addChildView(rightView)

    leftView.setBounds({ x: bound, y: bound, width: (w-3*bound)/2, height: d-2*bound })
    rightView.setBounds({ x: (w+bound)/2, y: bound, width: (w-3*bound)/2, height: d-2*bound })

    //leftView.webContents.loadURL('https://baidu.com')
    leftView.webContents.loadFile('src/renderer/white.html')
    //rightView.webContents.loadURL('https://baidu.com')
    rightView.webContents.loadFile('src/renderer/white.html')

    win.on('resize',() => {
        w = win.getContentSize()[0];
        d = win.getContentSize()[1];

        parentView.setBounds({ x: 0, y: 0, width: w, height: d })

        leftView.setBounds({ x: bound, y: bound, width: (w-3*bound)/2, height: d-2*bound })
        rightView.setBounds({ x: (w+bound)/2, y: bound, width: (w-3*bound)/2, height: d-2*bound })
    })
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    app.quit();
});


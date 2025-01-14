import { BaseWindow,WebContentsView } from 'electron'
const tldjs = require('tldjs');

const browserHomePage = 'https://baidu.com';
//const browserHomePage = 'https://www.doubao.com/chat/search';

let currentId = 0

class Tab{
    view: WebContentsView
    history: string[]
    name: string
    url: string
    id: number
    constructor(url?:string){
        this.history = []
        this.view = new WebContentsView()
        this.url = url || browserHomePage
        this.name = tldjs.getDomain(this.url) || this.url
        this.id = currentId
        currentId = currentId + 1

        let changeUrl = (_,url)=>{this.url = url}

        // enable browser touch zoom
        this.view.webContents.setVisualZoomLevelLimits(1, 3)

        this.view.webContents.on('will-navigate', changeUrl);
        this.view.webContents.on('did-navigate', changeUrl);
        this.view.webContents.on('did-navigate-in-page', changeUrl);

        // TODO set bound
        
        this.view.webContents.setWindowOpenHandler(({url}) => {
            // TODO 打开新tab
            this.view.webContents.loadURL(url);
            changeUrl(null,url);
            return {action: 'deny'};
        });

        this.view.webContents.loadURL(url || browserHomePage)
    }
}

export class Tabs{
    tabs: Tab[]
    active: number
    win: BaseWindow
    constructor(win:BaseWindow){
        this.win = win
        this.tabs = []
        this.active = -1
    }

    getTabs(): {name: string; url: string}[]{
      let tabs:{ name: string; url: string }[] = []
      for(let tab of this.tabs){
        tabs.push({name:tab.name,url:tab.url})
      }
      return tabs
    }

    rendererTab(){

      // send tabs
      // send active

    }

    addTab(url?:string){
      this.tabs.push(new Tab(url))
      if(this.active == -1){
        this.setActiveByTabId(0)
      }else{
        for(let i = this.tabs.length-1 ; i>this.active+1 ; i--){
          let old = this.tabs[i-1]
          this.tabs[i-1] = this.tabs[i]
          this.tabs[i] = old
        }
      }
      this.rendererTab()
      // send to renderer
    }

    setActiveByTabId(tabId:number){
      if(tabId == -1 && this.tabs.length > 0){
        tabId = 0
      }
      if(tabId != -1){
        let view: WebContentsView = this.tabs[tabId].view
        this.win.contentView.addChildView(view)
      }
      if(this.active != -1){
        let view: WebContentsView = this.tabs[this.active].view
        this.win.contentView.removeChildView(view)
      }
      this.active = tabId
      this.rendererTab()
    }

    setTabName(tabId:number,name:string){

      this.rendererTab()
    }

    setTabUrl(tabId:number,url:string){

      this.rendererTab()
    }
    
    removeTab(tabId){
      let tab = this.tabs[tabId]
      this.tabs.splice(tabId, 1)
      if(tabId <= this.active){
        this.setActiveByTabId(tabId-1)
      }
      // shuld close webContents ?
      // tab.view.webContents.close()

      this.rendererTab()
    }

    setActiveBound(){
      
    }
}


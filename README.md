# WebSocketUtils
**参数**
```javascript
//WebSocket实例
ws = null;
//心跳任务
heartbeatTask = null
//重试任务
retryTask = null
//请求重试次数
retryCount = 0
config = {
//心跳频率 默认3s
    heartbeatDelay: 3000,
//重试频率 默认3s
    retryDelay: 3000,
//最大重试请求次数 -1为无限制 默认-1
    maximumRetry: -1,
//请求url
    url: "",
//每个请求必带参数
    requiredParams: {},
    binaryType: "blob"
}
//外部api 
async onOpen(event) {
}
//外部api 
async onMessage(event) {
}
//外部api 
async onClose(event) {
}
//外部api 
async onError(event) {
}
//外部api 
async onHeartbeat(event) {
}
```

**调用方法**
```javascript
class Index {
    ws = null

    constructor() {
        this.ws = new WebSocketUtils({...config.websocket, url: config.api.connect})
        this.ws.onMessage = this.onMessage.bind(this)
        this.ws.connect()
            .then((data) => {
                console.log(data)
            })
    }

    async processTick(data) {
        console.log(data)
    }

    async sendHeartbeatData(ping) {
        this.send({
            pong: ping
        })
    }

    async onMessage(res) {
        console.log(res)
    }

    async send(data) {
        this.ws.send({data});
    }
}


new Index()
```

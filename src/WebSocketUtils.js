class WebSocketUtils {
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

    constructor(config) {
        this.config = {...this.config, ...config}
    }

    connect() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket(this.config.url)
            this.ws.binaryType = this.config.binaryType

            this.ws.addEventListener("open", (e) => {
                resolve(e)
                this._open(e)
            })
            this.ws.addEventListener("message", this._message.bind(this))
            this.ws.addEventListener("close", this._close.bind(this))
            this.ws.addEventListener("error", (err) => {
                reject(err)
                this._error(err)
            })
        })
    }

    async _open(e) {
        this.startHeartbeatHandler()
        return this.onOpen.call(null, e)
    }

    async _message(e) {
        return this.onMessage.call(null, e)
    }

    async _close(e) {
        this.reconnect()
        return this.onClose.call(null, e)
    }

    async _error(e) {
        this.reconnect()
        return this.onError.call(null, e)
    }

    async clearRetryTask() {
        clearInterval(this.retryTask)
        this.retryTask = null
        this.retryCount = 0
    }

    //重连
    async reconnect() {
        if (this.retryTask) return
        this.retryTask = setInterval(async () => {
            this.retryCount++
            if ((this.retryCount > this.config.maximumRetry) && this.config.maximumRetry !== -1) return this.clearRetryTask()
            this.connect(this.config)
                .then(() => this.clearRetryTask())
        }, this.config.retryDelay)
    }

    //停止心跳
    async stopHeartbeatHandler() {
        clearInterval(this.heartbeatTask)
        this.heartbeatTask = null
    }

    //开始心跳
    async startHeartbeatHandler() {
        if (this.retryTask) return this.stopHeartbeatHandler()
        this.heartbeatTask = setInterval(async () => {
            this.onHeartbeat()
        }, this.config.heartbeatDelay)
    }

    async send({data, isStringify = true}) {
        let finalData = data
        if ((Object.prototype.toString.call(data) === "[object Object]") && isStringify) {
            finalData = JSON.stringify({...data, ...this.config.requiredParams})
        }
        this.ws.send(finalData);
    }
}

export default WebSocketUtils




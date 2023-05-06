import { address } from "@/configs"

const useWebsocket = (handleMessage: any) => {
    const ws = new WebSocket(address)

    const init = () => {
        bindEvent()
    }

    // 事件绑定
    const bindEvent = () => {
        ws.addEventListener('open', handleOpen, false)
        ws.addEventListener('close', handleClose, false)
        ws.addEventListener('error', handleError, false)
        ws.addEventListener('message', handleMessage, false)
    }

    const handleOpen = (e: any) => {
        console.log('open', e);
    }

    const handleClose = (e: any) => {
        console.log('close', e);
    }

    const handleError = (e: any) => {
        console.log('error',e);
    }

    init()

    return ws
}

export default useWebsocket
'use strict'

class Timer {

    timerMap = {

    }

    /**
     * 启动定时器（与startNow不同，start不会立即执行）
     * @param runFunc    运行方法
     * @param mills      间隔毫秒
     * @param timerName  定时器名称，默认为 new Date().getTime()
     */
    start = (timerName, runFunc, mills) => {
        if (!timerName) {
            timerName = `_${new Date().getTime()}`
        } else if (this.timerMap[timerName]) {
            const { timeout, runFunc, mills } = this.timerMap[timerName]

            clearTimeout(timeout)
            this.timerMap[timerName] = null
            return this.start(timerName, runFunc, mills)
        }

        this.timerMap[timerName] = {
            runFunc,
            mills,
        }

        const timer = this.timerMap[timerName]
        
        timer.runFunc()

        timer.timeout = setTimeout(() => {
            this.start(timerName)
         }, timer.mills)

        return timerName;
    }

    /**
     * 启动定时器（与start不同，startNow会立即执行）
     * @param runFunc    运行方法
     * @param mills      间隔毫秒
     * @param timerName  定时器名称，默认为 new Date().getTime()
     */
    startNow = (runFunc, mills, timerName) => {
        setTimeout(() => runFunc())
        return this.start(timerName, runFunc, mills)
    }

    stop = (timerName) => {
        if (timerName && this.timerMap[timerName] && this.timerMap[timerName].timeout) {
            clearTimeout(this.timerMap[timerName].timeout)
        }
    }

    stopAll = () => {
        for (let timerName in this.timerMap) {
            if (timerName && this.timerMap[timerName] && this.timerMap[timerName].timeout) {
                clearTimeout(this.timerMap[timerName].timeout)
            }
        }
    }

}

export default new Timer()

var dateFns = require('date-fns');

class Logger {
    constructor(prefix) {
        this.prefix = prefix
        this.status = {
            default: "\x1b[37m",
            success: "\x1b[32m",
            fail: "\x1b[31m",
            info: "\x1b[35m",
            warn: "\x1b[33m"
        }
    }

    setTid(thread_id) {
        this.tid = thread_id
    }
    log(text, color = "default", timeStamp = true) {
        var prefix = ""
        var logcolor = ""
        timeStamp ? prefix = `[${dateFns.format(new Date(), 'HH:mm:ss.ms')}] [${this.prefix}] : ` : prefix = ""
        logcolor = this.status[color]
        console.log(logcolor, `${prefix}${text}`);
    }
}

module.exports = Logger
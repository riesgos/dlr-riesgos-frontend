import { appendFileSync } from "fs"

// @TODO: 
// log-rotate: a new log every day.
// maybe even delete very old logs.

export class Logger {
    constructor(private loggingDir: string, private verbosity: 'verbose' | 'silent' = 'verbose') {
        this.loggingDir = loggingDir.replace(/\/+$/, '');
    }

    /*
    * Danger-zone: 
    * monkey-patching console.log 
    * and console.error to write to logs
    * without having to pass logger along everywhere
    */
    monkeyPatch() {
        const consoleLog = console.log;
        console.log = (message, ...optionalParas) => {
            this.log(message, ...optionalParas);
            if (this.verbosity === 'verbose') consoleLog(message, ...optionalParas);
        }
        const consoleError = console.error;
        console.error = (message, ...optionalParas) => {
            this.error(message, ...optionalParas);
            consoleError(message, ...optionalParas);
        }
    }

    log(message: any, ...optionalParas: any[]) {
        const time = new Date();
        const messageString = this.messageToString(message);
        const additionalText = JSON.stringify(optionalParas);
        appendFileSync(`${this.loggingDir}/log.txt`, time.toISOString() + "---" + messageString + "\n" + additionalText + "\n");
    }

    error(message: any, ...optionalParas: any[]) {
        const time = new Date();
        const messageString = this.messageToString(message);
        const additionalText = JSON.stringify(optionalParas);
        appendFileSync(`${this.loggingDir}/errors.txt`, time.toISOString() + "---" + messageString + "\n" + additionalText + "\n");
    }

    private messageToString(message: any) {
        let messageString: String;
        if (typeof message === 'string' || message instanceof String) { // if already a string ...
            messageString = message;
        }
        else if (message instanceof Error || (message.stack && message.message) ) { // if an Error object ...
            messageString = JSON.stringify(message, Object.getOwnPropertyNames(message));
        } else { // if any other object ...
            messageString = JSON.stringify(message);
        }
        return messageString;
    }
}


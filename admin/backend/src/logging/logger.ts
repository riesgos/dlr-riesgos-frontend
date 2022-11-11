import { appendFileSync } from "fs"

// @TODO: 
// log-rotate: a new log every day.
// maybe even delete very old logs.

export class Logger {
    constructor(private loggingDir: string) {
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
            consoleLog(message, ...optionalParas);
        }
        const consoleError = console.error;
        console.error = (message, ...optionalParas) => {
            this.error(message, ...optionalParas);
            consoleError(message, ...optionalParas);
        }
    }

    log(message: string, ...optionalParas: any[]) {
        const time = new Date();
        const additionalText = JSON.stringify(optionalParas);
        appendFileSync(`${this.loggingDir}/log.txt`, time.toISOString() + "---" + message + "\n" + additionalText + "\n");
    }

    error(message: string, ...optionalParas: any[]) {
        const time = new Date();
        const additionalText = JSON.stringify(optionalParas);
        appendFileSync(`${this.loggingDir}/errors.txt`, time.toISOString() + "---" + message + "\n" + additionalText + "\n");
    }
}


import { appendFileSync } from "fs"
import { createFileSync, getFileAgeSync, renameFileSync } from "../utils/files";
import { MailClient } from "../web/mailClient";
import { config } from '../config';


export class Logger {

    private mailClient = new MailClient();

    constructor(
        private loggingDir: string,
        private verbosity: 'verbose' | 'silent' = 'verbose',
        private maxLogAge = 24 * 60 * 60,
        private sendMailOnError = true
    ) {
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
        this.checkRotate(`${this.loggingDir}/log.txt`);
        const time = new Date();
        const messageString = this.messageToString(message);
        const additionalText = JSON.stringify(optionalParas);
        appendFileSync(`${this.loggingDir}/log.txt`, time.toISOString() + "---" + messageString + "\n" + additionalText + "\n");
    }

    error(message: any, ...optionalParas: any[]) {
        this.checkRotate(`${this.loggingDir}/errors.txt`);
        const time = new Date();
        const messageString = this.messageToString(message);
        const additionalText = JSON.stringify(optionalParas);
        const fullErrorString = time.toISOString() + "---" + messageString + "\n" + additionalText + "\n";
        appendFileSync(`${this.loggingDir}/errors.txt`, fullErrorString);

        if (this.sendMailOnError) this.mailClient.sendMail([config.adminEmail], 'RIESGOS 2.0: an error has occured', fullErrorString);
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

    private checkRotate(filePath: string) {
        const fileAgeSecs = getFileAgeSync(filePath);
        if (fileAgeSecs > this.maxLogAge) {
            renameFileSync(filePath, `${filePath}_${new Date().toISOString()}.txt`);
            createFileSync(filePath);
        }
    }
}


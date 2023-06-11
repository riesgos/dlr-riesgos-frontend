import { appendFileSync } from "fs"
import { createFileSync, getFileAgeSync, renameFileSync } from "../utils/files";
import { MailClient } from "../web/mailClient";
import { inspect } from 'util';


export class Logger {

    private mailClient = new MailClient();

    constructor(
        private loggingDir: string,
        private sendMailTo: string[] = [],
        private sender: string = "info@test.com",
        private verbosity: 'verbose' | 'silent' = 'verbose',
        private maxLogAgeMinutes = 24 * 60,
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
            try {
                this.log(message, ...optionalParas);
            } catch {}
            if (this.verbosity === 'verbose') consoleLog(message, ...optionalParas);
        }
        const consoleError = console.error;
        console.error = (message, ...optionalParas) => {
            try {
                this.error(message, ...optionalParas);
            } catch {}
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

        if (this.sendMailTo.length > 0) this.mailClient.sendMail(this.sender, this.sendMailTo, 'RIESGOS 2.0: an error has occured', fullErrorString);
    }

    private messageToString(message: any) {
        if (!message) return "Sorry, unknown error. Maybe there is some clue further up in the error-logs."; // somehow, this can apparently happen sometimes.
        let messageString: String;
        if (typeof message === 'string' || message instanceof String) { // if already a string ...
            messageString = message;
        }
        else if (message instanceof Error || (message.stack && message.message) ) { // if an Error object ...
            messageString = JSON.stringify(message, Object.getOwnPropertyNames(message));
        } else { // if any other object ...
            messageString = inspect(message);
        }
        return messageString;
    }

    private checkRotate(filePath: string) {
        const fileAgeSecs = getFileAgeSync(filePath);
        if (fileAgeSecs === -1) {
            createFileSync(filePath);
        }
        if (fileAgeSecs > this.maxLogAgeMinutes * 60) {
            renameFileSync(filePath, `${filePath}_${new Date().toISOString()}.txt`);
            createFileSync(filePath);
        }
    }
}


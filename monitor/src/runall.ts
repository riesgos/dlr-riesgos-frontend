import { MailClient } from './mailClient';
import { testAndRepeat } from './utils';

const backendUrl = process.env.backendUrl || "http://localhost:8000";
const sendMailTo = (process.env.sendMailTo || "").split(",");
const sourceEmail = process.env.sourceEmail || "info@test.com";
const testServiceEveryMinutes = parseInt(process.env.testServiceEveryMinutes || "120");

main(backendUrl, testServiceEveryMinutes, sourceEmail, sendMailTo);



async function main(serverUrl: string, minutes: number, sourceEmail: string, sendMailTo: string[]) {
    const mailClient = new MailClient();
    try {
        await testAndRepeat(serverUrl, minutes);
    } catch (error) {
        console.log(`Monitor has detected a problem: `, error);
        mailClient.sendMail(sourceEmail, sendMailTo, `Monitor has detected a problem`, JSON.stringify(error));
        setTimeout(() => main(serverUrl, minutes, sourceEmail, sendMailTo), minutes * 60 * 1000);
    }
}



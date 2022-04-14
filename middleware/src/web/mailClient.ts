import sendmail from 'sendmail';


export interface MailAttachment {
  type?: string | undefined;
  filename?: string | undefined;
  content?: any;
  path?: string | undefined;
  contentType?: string | undefined;
  encoding?: string | undefined;
};

export class MailClient {

    private mailClient;

    constructor() {
        this.mailClient = sendmail({
            logger: {
              debug: console.log,
              info: console.info,
              warn: console.warn,
              error: console.error
            },
            silent: false,
            // dkim: { // Default: False
            //   privateKey: fs.readFileSync('./dkim-private.pem', 'utf8'),
            //   keySelector: 'mydomainkey'
            // },
            // devPort: 1025, // Default: False
            // devHost: 'localhost', // Default: localhost
            // smtpPort: 2525, // Default: 25
            // smtpHost: 'localhost' // Default: -1 - extra smtp host after resolveMX
          });
    }

    public sendMail(recipients: string[], subject: string, html: string, attachments?: MailAttachment[]) {
        this.mailClient({
            from: 'errormessages@riesgos.com',
            to: recipients.join(', '),
            subject: subject,
            html: html,
            attachments: attachments
          }, function(err, reply) {
            console.log(err && err.stack);
            console.dir(reply);
        });
    }
}
import { config } from '../config';
import { MailAttachment, MailClient } from '../web/mailClient';
import { WpsMarshaller100 } from '../wps/lib/wps100/wps_marshaller_1.0.0';
import { WpsMarshaller200 } from '../wps/lib/wps200/wps_marshaller_2.0.0';
//@ts-ignore
import * as XLink_1_0_Factory from 'w3c-schemas/lib/XLink_1_0'; const XLink_1_0 = XLink_1_0_Factory.XLink_1_0;
//@ts-ignore
import * as OWS_1_1_0_Factory from 'ogc-schemas/lib/OWS_1_1_0'; const OWS_1_1_0 = OWS_1_1_0_Factory.OWS_1_1_0;
//@ts-ignore
import * as OWS_2_0_Factory from 'ogc-schemas/lib/OWS_2_0'; const OWS_2_0 = OWS_2_0_Factory.OWS_2_0;
//@ts-ignore
import * as WPS_1_0_0_Factory from 'ogc-schemas/lib/WPS_1_0_0'; const WPS_1_0_0 = WPS_1_0_0_Factory.WPS_1_0_0;
//@ts-ignore
import * as WPS_2_0_Factory from 'ogc-schemas/lib/WPS_2_0'; const WPS_2_0 = WPS_2_0_Factory.WPS_2_0;
//@ts-ignore
import * as JsonixFactory from '../wps/lib/jsonix/jsonix'; const Jsonix = JsonixFactory.Jsonix as any;


const mailClient = new MailClient();

export function sendErrorMail(request: any, error: any) {

    const wpsmarshaller = 
        request.version === '1.0.0' ?
        new WpsMarshaller100() :
        new WpsMarshaller200();
    const context = 
        request.version === '1.0.0' ?
        new Jsonix.Context([XLink_1_0, OWS_1_1_0, WPS_1_0_0]) :
        new Jsonix.Context([XLink_1_0, OWS_2_0, WPS_2_0]);
    const xmlMarshaller = context.createMarshaller();
    const execBody = wpsmarshaller.marshalExecBody(request.processId, request.inputs, request.outputDescriptions, true);
    const xmlExecbody = xmlMarshaller.marshalString(execBody);


    const text = `
    Request:
    ${xmlExecbody}
    
    Error:
    ${error.message}
    
    Stack:
    ${error.stack}
    
    Time:
    ${new Date()}
    `;
    const attachment: MailAttachment = {
        content: text,
        contentType: 'text',
        encoding: 'utf-8',
        filename: 'attachment.txt',
    };
    mailClient.sendMail(config.siteAdmins, 'Riesgos Middleware: Error on execute-request', 'An error has occurred. See attachment.', [attachment]);
}
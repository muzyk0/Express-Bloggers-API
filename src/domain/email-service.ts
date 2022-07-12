import nodemailer from 'nodemailer';
import { settings } from '../constants';

export class EmailService {
    private transporter: nodemailer.Transporter;

    constructor() {
        // create reusable transporter object using the default SMTP transport
        this.transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: settings.EMAIL_FROM, // generated ethereal user
                pass: settings.EMAIL_FROM_PASSWORD, // generated ethereal password
            },
        });
    }

    private async send(mail: MailType) {
        return this.transporter.sendMail(mail);
    }

    async sendEmail(email: string, subject: string, template: string) {
        try {
            const info = await this.send({
                from: '"9ART.ru 👻" <info@9art.ru>',
                to: email,
                subject,
                html: template,
            });

            console.log('Message sent: %s', info);
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        } catch (e) {
            console.log(`email isn't send. Error: ${e}`);
        }
    }
}

export interface MailType {
    from: string; // sender address
    to: string; // list of receivers
    subject: string; // Subject line
    text?: string; // plain text body
    html: string; // html body
}

import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer'

@Injectable()
export class MailerService {

    private async transporter(){
        const testAccount = await nodemailer.createTestAccount()
        const transport = nodemailer.createTransport({
            host: '0.0.0.0',
            port: 1025,
            ignoreTLS : true,
            auth : {
                user : testAccount.user,
                pass : testAccount.pass
            }
        })
        return transport
    }

    async sendSignupConfrimation(userEmail: string){
        (await this.transporter()).sendMail({
            from: "app@localhost.com",
            to: userEmail,
            subject: "Inscription",
            html : "<h2> confirmation de l'inscription</h2>"
        })
    }

    async sendResetPassword(userEmail: string, url: string, code: string){
        (await this.transporter()).sendMail({
            from: "app@localhost.com",
            to: userEmail,
            subject: "Rest password",
            html : `<a href="${url}">Rest password </a>
                <p> Secret code <strong>${code}</strong> </p>
                <p>le code expire dans 15min....</p>
            `
        })
    }
}

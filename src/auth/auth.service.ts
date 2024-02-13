import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import * as speakeasy from 'speakeasy';
import { MailerService } from 'src/mailer/mailer.service';
import { SigninDto } from './dto/signin.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ResetPasswordDemandDto } from './dto/resetPasswordDemande.dto';
import { ResetPasswordConfirmationDto } from './dto/reserPasswordConfirmation.dto';
import { DeleteAccountDto } from './dto/deleteAccount.dto';

@Injectable()
export class AuthService {
    constructor(private readonly prismaService : PrismaService,
                private readonly mailService: MailerService,
                private readonly jwtService: JwtService,
                private readonly configService : ConfigService){}


    async signup(signupDto: SignupDto) {
        const {email, username, password} = signupDto
        // Vérifier si l'utilisateur est deja inscrit
        const user = await this.prismaService.user.findUnique({where : {email}});
        if(user) throw new ConflictException(" l'email existe deja");

        // Hasher le password
        const hash =  await bcrypt.hash(password, 10)

        // Enregistrement de l'utilisateur dans la base de données
        await this.prismaService.user.create({data : {email, username, password:hash}})

        // Envoyé un email de confirmation
        await this.mailService.sendSignupConfrimation(email);
        //retourne une reponse de success
        return {data: "l'utlisateur a été creer avec success"}
    }
    async signin(signinDto: SigninDto) {
        const {email, password} = signinDto
        // Verifier si l'utilisation est deja inscrit
        const user = await this.prismaService.user.findUnique({where: {email: email}})
        if(!user) throw new NotFoundException('le Email est introuvable')
        
        // Comparer les password
        const match = await bcrypt.compare(password, user.password)
        if(!match) throw new UnauthorizedException("le password est incorrect")
        const payload = {
            sub: user.userId,
            email: user.email
        }
        // Retourner un token JWT
        const token = this.jwtService.sign(payload, {expiresIn:'2d',secret: this.configService.get('SECRET_KEY')})
        return{
            token,
            user : {
                username : user.username,
                email : user.email
            }
        }  
    }
    async resetPasswordDemand(resetPasswordDemandDto: ResetPasswordDemandDto) {
        const {email} = resetPasswordDemandDto
        // Verifier si l'utilisation exist
        const user = await this.prismaService.user.findUnique({where: {email}})
        if(!user) throw new NotFoundException('le Email est introuvable')

        // Creer un code OTP
        const code = speakeasy.totp({
            secret: this.configService.get('OTP_CODE'),
            digits : 5, //code 5chiffres
            step : 60*15, // la durée en second
            encoding: "base32"
        })

        const url = "http://localhost:3000/auth/reset-password-confirmation"
        await this.mailService.sendResetPassword(email, url, code)

        return {data: "Reset password est envoyer par Email"}
    }
    async resetPasswordConfirmation(resetPasswordConfirmationDto: ResetPasswordConfirmationDto) {
        const {email, code, password} = resetPasswordConfirmationDto
        // Verifier si l'utilisation exist
        const user = await this.prismaService.user.findUnique({where: {email}})
        if(!user) throw new NotFoundException('le Email est introuvable')

        const match = speakeasy.totp.verify({
            secret: this.configService.get('OTP_CODE'),
            token: code,
            digits : 5,
            step : 60*15,
            encoding: "base32"
        });

        if(!match) throw new UnauthorizedException('le token est invalide ou expire')
        const hash = await bcrypt.hash(password, 10)
        await this.prismaService.user.update({
            where: {email}, 
            data: {password: hash}
        })

        return {data : "Le password est mis a jour"}
    }
    async deleteAcount(userId: number, deleteAccountDto: DeleteAccountDto) {
        const {password} = deleteAccountDto
        const user = await this.prismaService.user.findUnique({where: {userId :userId}})
        if(!user) throw new NotFoundException('le User est introuvable')

        const match = await bcrypt.compare(password, user.password)
        if(!match) throw new UnauthorizedException("le password est incorrect")

        await this.prismaService.user.delete({where: {userId}})
        return {data: " user supprimer avec success"}


    }
}

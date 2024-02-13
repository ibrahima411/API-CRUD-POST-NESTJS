import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {PassportStrategy} from "@nestjs/passport";
import {Strategy, ExtractJwt} from "passport-jwt"
import { PrismaService } from "src/prisma/prisma.service";

type Payload = {
    sub: number,
    email: string
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(
        configService: ConfigService, 
        private readonly prismaService: PrismaService){
        super({
            jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey : configService.get('SECRET_KEY'),
            ignoreExpiration: false
        })
    }

    //on va faire validation et de trouver l'utilisation qui se connect
    async validate(payload :Payload){
        const user = await this.prismaService.user.findUnique({where: { email:payload.email}})
        if(!user){
            throw new UnauthorizedException('Unauthorized')
        }
        Reflect.deleteProperty(user, "password") // ignore qu'il return le password
        console.log(user)
        return user
    }
}
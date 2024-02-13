import { Body, Controller, Delete, Post, Req, UseGuards} from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { AuthService } from './auth.service';
import { SigninDto } from './dto/signin.dto';
import { ResetPasswordDemandDto } from './dto/resetPasswordDemande.dto';
import { ResetPasswordConfirmationDto } from './dto/reserPasswordConfirmation.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { DeleteAccountDto } from './dto/deleteAccount.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Utilisateur')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService){}
    @Post('signup')
    signup(@Body() signupDto: SignupDto){
        return this.authService.signup(signupDto)
    }
    @Post('signin')
    signin(@Body() signinDto : SigninDto){
        return this.authService.signin(signinDto)
    }

    @Post('reset-password')
    resetPasswordDemand(@Body() resetPasswordDemandDto: ResetPasswordDemandDto){
       return this.authService.resetPasswordDemand(resetPasswordDemandDto)
    }

    @Post('reset-password-confirmation')
    resetPasswordDemandConfirmation(@Body() resetPasswordConfirmationDto: ResetPasswordConfirmationDto){
        return this.authService.resetPasswordConfirmation(resetPasswordConfirmationDto)
     }

    @UseGuards(AuthGuard('jwt'))
    @Delete('delete')
    deleteAccout(@Req() request: Request, @Body() deleteAccountDto:DeleteAccountDto){
        const userID = request.user["userId"]

        return this.authService.deleteAcount(userID, deleteAccountDto)
     }
}

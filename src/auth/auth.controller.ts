import { Body, Controller, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import {  AuthEmployeeDto } from "./dto/auth-emloyee.dto";
import { AuthClientDto } from "./dto/auth-client.dto";
import { ClientRegisterDto } from "./dto/client-register.dto";

@ApiTags('authorization')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({summary: 'Client registration'})
  @Post('/register/client')
  registerClient(@Body() clientRegisterDto:ClientRegisterDto ){
    return this.authService.registerClient(clientRegisterDto)
  }

  @ApiOperation({summary: 'Client authorization'})
  @Post('/login/client')
  loginClient(@Body() authClientDto:AuthClientDto){
    return this.authService.loginClient(authClientDto)
  }

  @ApiOperation({summary: 'Employee authorization'})
  @Post('/login')
  login(@Body() authEmployeeDto:AuthEmployeeDto){
    return this.authService.loginEmployee(authEmployeeDto)
  }




}

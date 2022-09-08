import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import {AuthEmployeeDto } from "./dto/auth-emloyee.dto";
import { JwtService } from "@nestjs/jwt";
import { UserEntity } from "../users/entity/user.entity";
import { AuthClientDto } from "./dto/auth-client.dto";
import { RoleEnum } from "../users/enum/role.enum";
import { AuthResponseDto } from "./dto/auth-response.dto";

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService,
              private jwtService: JwtService,

              ) {}

  async loginEmployee(authEmployeeDto:AuthEmployeeDto){
    const user = await this.validateEmployee(authEmployeeDto)
    const userResponse = new AuthResponseDto()
    userResponse.token = await this.generateToken(user)
    userResponse.role = user.role
    userResponse.firstname = user.firstname
    return userResponse
  }

  async loginClient(authClientDto:AuthClientDto) {
    const user = await this.validateClient(authClientDto)
    return this.generateToken(user)
  }

  async registerClient(clientRegisterDto){
    clientRegisterDto.role = RoleEnum.CLIENT
    const client = await this.usersService.clientRegister(clientRegisterDto)
    return this.generateToken(client)
  }

  private async generateToken(user:UserEntity){
    const payload = {phone:user.phone,role:user.role}
    return this.jwtService.sign(payload)
  }

  private async validateEmployee(authEmployeeDto: AuthEmployeeDto) {

    const user = await this.usersService.getByPhone(authEmployeeDto.phone)
    if(!user){
      throw new UnauthorizedException({message:'Invalid phone number or password'})
    }
    if(user && authEmployeeDto.password == user.password) {
      return user
    }
      throw new UnauthorizedException({message:'Invalid phone number or password'})
  }
  private async validateClient(authClientDto: AuthClientDto) {
    const user = await this.usersService.getByPhone(authClientDto.phone)
    if(user) {
      return user
    }
    throw new UnauthorizedException({message:'Invalid phone number'})
  }

}

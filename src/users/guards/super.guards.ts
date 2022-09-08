import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable
} from "@nestjs/common";
import { Observable } from "rxjs";
import { JwtService } from "@nestjs/jwt";
import { RoleEnum } from "../enum/role.enum";

@Injectable()
export class SuperGuards implements CanActivate{
  constructor(private jwtService:JwtService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {

    try
    {
      const req = context.switchToHttp().getRequest()
      const authHeader = req.headers.authorization
      const token = authHeader.split(' ')[1]

      const user = this.jwtService.verify(token)
      req.user = user
      return user.role === RoleEnum.SUPER

    } catch (e){
      throw new HttpException('User not authorized',HttpStatus.UNAUTHORIZED)
    }
  }
}
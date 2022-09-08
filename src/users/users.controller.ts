import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from "@nestjs/common";
import { UsersService } from "./users.service";
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags
} from "@nestjs/swagger";
import { CreateEmployeeDto } from "./dto/create-emloyee.dto";
import { UserEntity } from "./entity/user.entity";
import { UpdateEmployeeDto } from "./dto/update-employee.dto";
import { SuperGuards } from "./guards/super.guards";
import { filter } from "../images/images-cloudinary";
import { FileInterceptor } from "@nestjs/platform-express";
import { UpdateClientDto } from "./dto/update-client.dto";
import { ClientGuards } from "./guards/client.guards";
import { EmployeeGuard } from "./guards/employee.guard";



@Controller('users')
@ApiTags("users")
@ApiBearerAuth()
export class UsersController {

  constructor(private usersService: UsersService) {}

  @ApiOperation({summary: 'Create employee'})
  @ApiConsumes('multipart/form-data')
  @ApiBody({type: CreateEmployeeDto})
  @ApiResponse({
    status: 201,
    description: 'Successfully created employee will be returned',
    type: UserEntity,
  })
  @UseInterceptors(FileInterceptor('image', {
    fileFilter: filter
  }))
  //@UseGuards(SuperGuards)
  @Post('/employee')
  createEmployee(@Body() createEmployeeDto: CreateEmployeeDto,@UploadedFile() image: Express.Multer.File) {
    return this.usersService.createEmployee(createEmployeeDto,image)
  }


  @ApiOperation({summary: 'Get a list of all users'})
  @ApiQuery({name: 'page', description: "Page number", required: false})
  @ApiQuery({name: 'limit', description: "Item limit", required: false})
  @ApiResponse({
    status: 201,
    description: 'List of users returned successfully',
    type: [UserEntity],
  })
  @UseGuards(SuperGuards)
  @Get()
  async findAll(
    @Query('page') page: number,
    @Query('limit') limit: number
  ) {
    return this.usersService.findAll(page,limit)
  }

  @ApiOperation({summary: 'Get users by role'})
  @ApiParam({name: 'role', description: 'example: admin/florist/courier/client/employees'})
  @ApiResponse({
    status: 201,
    description: 'Users returned successfully',
    type: [UserEntity]
  })
  @UseGuards(SuperGuards)
  @Get('/getByRole/:role')
  async getByRole(@Param('role') role: string) {
    return this.usersService.getByRole(role)
  }

  @ApiOperation({summary: 'Get user by phone number'})
  @ApiParam({name: 'phone', description: 'Users phone: +996777123456'})
  @ApiResponse({
    status: 201,
    description: 'User returned successfully',
    type: [UserEntity]
  })

  @UseGuards(EmployeeGuard)
  @Get('/getByPhone/:phone')
  async getByPhone(@Param('phone') phone: string) {
    return this.usersService.getByPhone(phone)
  }

  @ApiOperation({summary: 'Update employee information'})
  @ApiConsumes('multipart/form-data')
  @ApiBody({type: UpdateEmployeeDto})
  @ApiParam({name:"phone",description:"Users phone: +996777123456"})
  @ApiResponse({
    status: 201,
    description: 'Updated user information will be returned',
    type: UserEntity,
  })
  @ApiResponse({status: 404, description: 'User not found'})
  @UseInterceptors(FileInterceptor('image', {
    fileFilter: filter
  }))
  @UseGuards(SuperGuards)
  @Put('/employee/:phone')
  updateEmployee(@Body() updateEmployeeDto: UpdateEmployeeDto, @Param('phone') phone: string,@UploadedFile() image: Express.Multer.File): Promise<UserEntity> {
    return this.usersService.updateEmployee(phone, updateEmployeeDto,image)
  }

  @ApiOperation({summary: 'Update client information'})
  @ApiBody({type: UpdateClientDto})
  @ApiParam({name:"phone",description:"Clients phone: +996777123456"})
  @ApiResponse({
    status: 201,
    description: 'Updated client information will be returned',
    type: UserEntity
  })
  @ApiResponse({status: 404, description: 'Client not found'})
  @UseGuards(ClientGuards)
  @Put('/client/:phone')
  updateClient(@Body() updateClientDto: UpdateClientDto, @Param('phone') phone: string): Promise<UserEntity> {
    return this.usersService.updateClient(phone, updateClientDto)
  }

  @ApiOperation({summary: 'Delete user'})
  @ApiParam({name:"phone",description:"Users phone: +996777123456"})
  @ApiResponse({status: 200, description: 'User deleted successfully'})
  @ApiResponse({status: 404, description: 'User not found'})
  @UseGuards(SuperGuards)
  @Delete(':phone')
  destroy(@Param('phone') phone: string) {
    return this.usersService.destroy(phone)
  }
}

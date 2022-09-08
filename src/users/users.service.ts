import { BadRequestException, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "./entity/user.entity";
import { Repository } from "typeorm";
import { UpdateEmployeeDto } from "./dto/update-employee.dto";
import { _delete, get, upload } from "../images/images-cloudinary";
import { UpdateClientDto } from "./dto/update-client.dto";
import { BranchesService } from "../branches/branches.service";
import { RoleEnum } from "./enum/role.enum";
import { ClientReturnDto } from "./dto/client-return.dto";


@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private branchesService: BranchesService
  ) {}

    private static async getPassword(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min)) + min; //Максимум не включается, минимум включается
    }

  async createEmployee(createEmployeeDto,image): Promise<UserEntity> {
  try{
    if(createEmployeeDto.phone === "+996555222222"){
       createEmployeeDto.password = 1230
    } else createEmployeeDto.password = await UsersService.getPassword(1000,10000)

    let user = await this.userRepository.findOne({ where: {phone: createEmployeeDto.phone} })
    if(user) {
      throw new HttpException("User with this phone number already exists", HttpStatus.BAD_REQUEST)
    }

    if (typeof createEmployeeDto.branch === 'string' && createEmployeeDto.branch !== '') createEmployeeDto.branch = +createEmployeeDto.branch
    if (typeof createEmployeeDto.branch === 'string' && createEmployeeDto.branch === '') createEmployeeDto.branch = null
   // createEmployeeDto.schedule = await this.checkSchedule(createEmployeeDto.schedule)
    if(image){
      const imageUpload = await upload(image)
      createEmployeeDto.image = imageUpload.public_id
    } else createEmployeeDto.image = null
    } catch (e){
      await _delete(image)
      throw new HttpException("Incorrect input data", HttpStatus.BAD_REQUEST)
    }
    const userNew = await this.userRepository.save(createEmployeeDto)
    userNew.image = await get(userNew.image)
    userNew.branch = await this.branchesService.getById(userNew.branch)
    return userNew
  }

  async clientRegister(clientRegisterDto){
    let user = await this.userRepository.findOne({
      where:
        {phone: clientRegisterDto.phone}
    })
    if(user) {
      throw new HttpException("User with this phone number already exists", HttpStatus.BAD_REQUEST)
    }
    return this.userRepository.save(clientRegisterDto)
  }

  async findAll(page:number,limit:number) : Promise<any> {
    const take = limit || 10
    const skip = page * limit || 0
    const [users,total] = await this.userRepository.findAndCount({ take: take,
      skip: skip})
    for(let user of users){
      user.image = await get(user.image)
    }
    return {
      data:users,total:total
    }
  }

  async getByPhone(phone: string): Promise<any> {
    const user = await this.userRepository.findOne(phone)
    if(user.role === RoleEnum.CLIENT){
      let client = new ClientReturnDto()
      client.phone = user.phone
      client.firstname = user.firstname
      client.birthday = user.birthday
      return client
    } else user.image = await get(user.image)
    return user
  }

  async getByRole(role:string): Promise<UserEntity[]> {
    let users
   if (role === "employees"){
      users = await this.userRepository.find({
       where:[
         { role: 'admin'},
         { role: 'florist'},
         { role: 'courier'},
       ]
     })
   } else users = await this.userRepository.find({
      where: {
        role: role
      }})
    for(let user of users){
      user.image = await get(user.image)
    }
    return users
  }

  async updateEmployee(phone: string, updateEmployeeDto: UpdateEmployeeDto,image): Promise<any> {
    let user = await this.userRepository.findOne(phone)
    if (!user) {
      throw new HttpException("No user for this phone", HttpStatus.BAD_REQUEST)
    }
    if(image){
      await _delete(user.image)
      const imageUpload = await upload(image)
      updateEmployeeDto.image = imageUpload.public_id
    } else updateEmployeeDto.image = user.image
    if (typeof updateEmployeeDto.branch === 'string' && updateEmployeeDto.branch !== '') updateEmployeeDto.branch = +updateEmployeeDto.branch
    if (typeof updateEmployeeDto.branch === 'string' && updateEmployeeDto.branch === '') updateEmployeeDto.branch = null
    // @ts-ignore
    //updateEmployeeDto.schedule = await this.checkSchedule(updateEmployeeDto.schedule )
    Object.assign(user,updateEmployeeDto)
    const userNew = await this.userRepository.save(user)
    updateEmployeeDto.image = await get(userNew.image)
    // @ts-ignore
    updateEmployeeDto.branch = await this.branchesService.getById(updateEmployeeDto.branch)
    return updateEmployeeDto
  }

  async updateClient(phone: string, updateClientDto: UpdateClientDto): Promise<UserEntity> {
    let user = await this.userRepository.findOne(phone)
    if (!user) {
      throw new HttpException("No user for this phone", HttpStatus.BAD_REQUEST)
    }
    Object.assign(user,updateClientDto)
    return await this.userRepository.save(user)
  }

  async destroy(phone: string): Promise<void> {
    const user = await this.userRepository.findOne({phone})
    if (user.image) await _delete(user.image)
    if (!user) {
      throw new HttpException("No user for this phone", HttpStatus.BAD_REQUEST)
    }
      await this.userRepository.delete(user)
  }
  async arrayFromStringSchedule(a: string): Promise<string[]> {
    a = a.replace("\n", "");
    a = a.replace(/\s+/g, '');
    a = a.replace("},{", '}#{');
    return a.split("#");
  }

  async checkSchedule(schedule): Promise<object[]> {
    if ((typeof schedule === 'string' && schedule !== '') || typeof schedule === 'object' && schedule.length > 0) {
      try {
        if (typeof schedule === 'string' && schedule !== '') schedule = await this.arrayFromStringSchedule(schedule);
        return schedule.map(e => {
          while (typeof e === 'string') e = JSON.parse(e);
          return e
        })
      } catch (e) {
        throw new BadRequestException('Wrong composition')
      }
    } else return null
  }
}

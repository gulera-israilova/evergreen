import { BadRequestException, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Between, Repository } from "typeorm";
import { OrderEntity } from "./entity/order.entity";
import { BouquetsService } from "../bouquets/bouquets.service";
import { UpdateOrderAdminDto } from "./dto/update-order-admin.dto";
import { UpdateOrderCourierDto } from "./dto/update-order-courier.dto";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import { BouquetStatus } from "../bouquets/enum/bouquet.status";
import { OrderStatus } from "./enum/orderStatus.enum";


@Injectable()
export class OrdersService {
  constructor(@InjectRepository(OrderEntity)
              private orderRepository: Repository<OrderEntity>,
              private bouquetsService:BouquetsService,
              private usersService:UsersService,
              private jwtService: JwtService){}

  async create(createOrderDto):Promise<OrderEntity>{
    let newOrder
    try{
      newOrder = await this.orderRepository.save(createOrderDto)
      createOrderDto.bouquets = newOrder.bouquets

    } catch (e){
      throw new HttpException("Incorrect input data", HttpStatus.BAD_REQUEST)
    }

    try{
      for (let bouquet of createOrderDto.bouquets){
        const findBouquet = await this.bouquetsService.getOne(bouquet)
        findBouquet.order = newOrder.id
        findBouquet.status = BouquetStatus.SOLD
        await this.bouquetsService.addOrderId(findBouquet.id,findBouquet)
      }

    } catch (e){
      throw new BadRequestException('Cant save bouquets')
    }
    Object.assign(newOrder, createOrderDto)
    return await this.orderRepository.save(newOrder)
  }

  async findAll() : Promise<OrderEntity[]> {
    const orders = await this.orderRepository.find()
     for(let order of orders){
       order.bouquets = await this.bouquetsService.getByOrder(order.id)
     }
    return orders
  }
  async getOrdersByStatus(status:string): Promise<OrderEntity> {
    let orders
    if(status === 'current'){
      orders = await this.orderRepository.find({
        where:[
          { status:1 },
          { status:2 },
          { status:3 }
        ]
        })
    } else if(status === 'delivered'){
      orders = await this.orderRepository.find({
        where:{
          status:4
        }
      })
    } else orders = await this.orderRepository.find({ where: { status: status } })
    for (let order of orders) {
      order.bouquets = await this.bouquetsService.getByOrder(order.id)
    }
    return orders
  }

  async getOrderById(header:string,id:number): Promise<OrderEntity> {
  const token = header.split(' ')[1]
  const user = this.jwtService.verify(token)
  let courier = await this.usersService.getByPhone(user.phone)
   let order = await this.orderRepository.findOne({
     where:{
       id:id,
       courier:courier.phone
     }
   })
   order.bouquets = await this.bouquetsService.getByOrder(order.id)
   return order
  }

  async updateByAdmin(id: number, updateOrderDto: UpdateOrderAdminDto): Promise<OrderEntity> {
    try {
      let order = await this.orderRepository.findOne(id)
      if (!order) {
        throw new HttpException("No order for this id", HttpStatus.BAD_REQUEST)
      }
      Object.assign(order, updateOrderDto)
      return await this.orderRepository.save(order)
    } catch (e){
      throw new HttpException("Incorrect input data", HttpStatus.BAD_REQUEST)
    }
  }

  async updateByCourier(header:string,id: number, updateOrderCourierDto: UpdateOrderCourierDto): Promise<OrderEntity> {
    try {
      let order = await this.orderRepository.findOne(id)
      if (!order) {
        throw new HttpException("No order for this id", HttpStatus.BAD_REQUEST)
      }
      const token = header.split(' ')[1]
      const user = this.jwtService.verify(token)

      let courier = await this.usersService.getByPhone(user.phone)

      updateOrderCourierDto.courier = courier.phone
      updateOrderCourierDto.earnedByCourier = 0.1*updateOrderCourierDto.total_cost
      Object.assign(order, updateOrderCourierDto)
      return await this.orderRepository.save(order)
    } catch (e){
      throw new HttpException("Incorrect input data", HttpStatus.BAD_REQUEST)
    }
  }

  async destroy(id: number): Promise<void> {
    let order = await this.orderRepository.findOne(id)
    if(!order){
      throw new HttpException("No order for this id", HttpStatus.BAD_REQUEST)
    }
    const bouquets = await this.bouquetsService.getByOrder(order.id)

      for (let bouquet of bouquets) {
        const findBouquet = await this.bouquetsService.getOne(bouquet.id)
        findBouquet.order = null
        if (order.status === OrderStatus.waiting){
          findBouquet.status = BouquetStatus.AVAILABLE
        }
        await this.bouquetsService.addOrderId(findBouquet.id,findBouquet)
      }
    await this.orderRepository.delete(id)
  }
}

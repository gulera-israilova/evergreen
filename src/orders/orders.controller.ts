import { Body, Controller, Delete, Get, Param, Post, Put, Request, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { OrdersService } from "./orders.service";
import { CreateOrderDto } from "./dto/create-order.dto";
import { OrderEntity } from "./entity/order.entity";
import { UpdateOrderAdminDto } from "./dto/update-order-admin.dto";
import { UpdateOrderCourierDto } from "./dto/update-order-courier.dto";
import { AdminGuards } from "../users/guards/admin.guards";
import { CourierGuards } from "../users/guards/courier.guards";



@Controller('orders')
@ApiTags("orders")
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @ApiOperation({summary: 'Create order'})
  @ApiBody({type: CreateOrderDto})
  @ApiResponse({
    status: 200,
    description: 'Successfully created category will be returned',
    type: OrderEntity
  })
  @Post()
  create(@Body()createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto)
  }

  @ApiBearerAuth()
  @ApiOperation({summary: 'Get a list of all orders'})
  @ApiResponse({
    status: 200,
    description: 'List of orders returned successfully',
    type: [OrderEntity]
  })
  @UseGuards(AdminGuards)
  @Get('/getAll')
  findAll() {
    return this.ordersService.findAll()
  }

  @ApiBearerAuth()
  @ApiOperation({summary: 'Get orders by status for admin'})
  @ApiParam({name: 'status', description: 'example: waiting/approved/current/delivered'})
  @ApiResponse({
    status: 200,
    description: 'Orders returned successfully',
    type: [OrderEntity]
  })
  @UseGuards(AdminGuards)
  @Get('/getByStatus/:status')
  async getOrdersByStatus(@Param('status') status: string) {
    return this.ordersService.getOrdersByStatus(status)
  }

  @ApiBearerAuth()
  @ApiOperation({summary: 'Get order by Id for couriers'})
  @ApiParam({name: 'id', description: 'example: 1'})
  @ApiResponse({
    status: 200,
    description: 'Orders returned successfully',
    type: [OrderEntity]
  })
  @UseGuards(CourierGuards)
  @Get('/getByIdByStatus/:id')
  async getOrderById(@Request() req,@Param('id') id: number) {
    return this.ordersService.getOrderById(req.headers.authorization,id)
  }

  @ApiBearerAuth()
  @ApiOperation({summary: 'Update order status: approve order by admin'})
  @ApiBody({type:UpdateOrderAdminDto})
  @ApiParam({name:"id",description:"Order id"})
  @ApiResponse({
    status: 200,
    description: 'Updated order information will be returned',
    type: OrderEntity,
  })
  @ApiResponse({status: 404, description: 'Order not found'})
  @UseGuards(AdminGuards)
  @Put('/byAdmin/:id')
  updateByAdmin(@Body() updateOrderDto: UpdateOrderAdminDto, @Param('id') id: number): Promise<OrderEntity> {
    return this.ordersService.updateByAdmin(id, updateOrderDto)
  }

  @ApiBearerAuth()
  @ApiOperation({summary: 'Update order status by courier'})
  @ApiBody({type:UpdateOrderCourierDto})
  @ApiParam({name:"id",description:"Order id"})
  @ApiResponse({
    status: 200,
    description: 'Updated order information will be returned',
    type: OrderEntity,
  })
  @ApiResponse({status: 404, description: 'Order not found'})
  @UseGuards(CourierGuards)
  @Put('/byCourier/:id')
  updateByCourier(@Request() req,@Body() updateOrderCourierDto: UpdateOrderCourierDto, @Param('id') id: number): Promise<OrderEntity> {
    return this.ordersService.updateByCourier(req.headers.authorization,id, updateOrderCourierDto)
  }

  @ApiBearerAuth()
  @ApiOperation({summary: 'Delete order'})
  @ApiParam({name:"id",description:"Order id"})
  @ApiResponse({status: 200, description: 'Order deleted successfully'})
  @ApiResponse({status: 404, description: 'Order not found'})
  @UseGuards(AdminGuards)
  @Delete(':id')
  destroy(@Param('id') id: number) {
    return this.ordersService.destroy(id)
  }
}

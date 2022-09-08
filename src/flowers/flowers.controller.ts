import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put, Query,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from "@nestjs/common";
import { FlowersService } from "./flowers.service";
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
import { CreateFlowerDto } from "./dto/create-flower.dto";
import { FlowerEntity } from "./entity/flower.entity";
import { UpdateFlowerDto } from "./dto/update-flower.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { filter } from "../images/images-cloudinary";
import { SuperGuards } from "../users/guards/super.guards";
import { AdminGuards } from "../users/guards/admin.guards";

@Controller('flowers')
@ApiTags("flowers")
export class FlowersController {
  constructor(private flowersService: FlowersService) {}

  @ApiBearerAuth()
  @ApiOperation({summary: 'Create flower'})
  @ApiConsumes('multipart/form-data')
  @ApiBody({type: CreateFlowerDto})
  @ApiResponse({
    status: 201,
    description: 'Successfully created flower will be returned',
    type: FlowerEntity
  })
  @UseInterceptors(FileInterceptor('image', {
    fileFilter: filter
  }))
  @UseGuards(SuperGuards)
  @Post()
  create(@Body()createFlowerDto: CreateFlowerDto,@UploadedFile() image: Express.Multer.File) {
    return this.flowersService.create(createFlowerDto,image)
  }

  @ApiOperation({summary: 'Get a list of all flowers'})
  @ApiQuery({name: 'page', description: "Page number", required: false})
  @ApiQuery({name: 'limit', description: "Item limit", required: false})
  @ApiResponse({
    status: 201,
    description: 'List of flowers returned successfully',
    type: [FlowerEntity]
  })
  @Get()
  async findAll(
    @Query('page') page: number,
    @Query('limit') limit: number
  ) {
    return this.flowersService.findAll(page,limit)
  }

  @ApiOperation({summary: 'Get flower by id'})
  @ApiParam({name: 'id', description: 'Flower id'})
  @ApiResponse({
    status: 201,
    description: 'Flower returned successfully',
    type: [FlowerEntity],
  })
  @Get('/getById/:id')
  async getById(@Param('id') id: number) {
    return this.flowersService.getById(id);
  }

  @ApiBearerAuth()
  @ApiOperation({summary: 'Update flower information'})
  @ApiConsumes('multipart/form-data')
  @ApiBody({type: CreateFlowerDto})
  @ApiParam({name:"id",description:"Flower id"})
  @ApiResponse({
    status: 201,
    description: 'Updated flower information will be returned',
    type: FlowerEntity
  })
  @UseInterceptors(FileInterceptor('image', {
    fileFilter: filter
  }))
  @ApiResponse({status: 404, description: 'User not found'})
  @UseGuards(SuperGuards)
  @Put(':id')
  update(@Body() updateFlowerDto: UpdateFlowerDto, @Param('id') id: number,@UploadedFile() image: Express.Multer.File): Promise<FlowerEntity> {
    return this.flowersService.update(id, updateFlowerDto,image)
  }

  @ApiBearerAuth()
  @ApiOperation({summary: 'Delete flower'})
  @ApiParam({name:"id",description:"Flower id"})
  @ApiResponse({status: 200, description: 'Flower deleted successfully'})
  @ApiResponse({status: 404, description: 'Flower not found'})
  @UseGuards(SuperGuards)
  @Delete(':id')
  destroy(@Param('id') id: number) {
    return this.flowersService.destroy(id)
  }

}

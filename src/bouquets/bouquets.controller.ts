import {
  Body,
  Controller,
  Delete,
  Get, Header, Headers,
  Param,
  Post,
  Put, Query, Request,
  UploadedFile, UploadedFiles,
  UseGuards,
  UseInterceptors
} from "@nestjs/common";
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
import { FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { filter } from "../images/images-cloudinary";
import { BouquetsService } from "./bouquets.service";
import { CreateBouquetDto } from "./dto/create-bouquet.dto";
import { BouquetEntity } from "./entity/bouquet.entity";
import { UpdateBouquetDto } from "./dto/update-bouquet.dto";
import { FloristGuards } from "../users/guards/florist.guards";
import { ImageUploadDto } from "./dto/imageUpload.dto";
import { AdminGuards } from "../users/guards/admin.guards";

@Controller('bouquets')
@ApiTags("bouquets")
export class BouquetsController {
  constructor(private bouquetsService: BouquetsService) {}

  @ApiBearerAuth()
  @ApiOperation({summary: 'Create bouquet'})
  @ApiConsumes('multipart/form-data')
  @ApiBody({type: CreateBouquetDto})
  @ApiResponse({
    status: 200,
    description: 'Successfully created bouquet will be returned',
    type: BouquetEntity
  })
  @UseInterceptors(FileFieldsInterceptor([{name:'images',maxCount:5}],{
    fileFilter: filter
  }))
  @UseGuards(FloristGuards)
  @Post()
  create(@Request() req,@Body() createBouquetDto: CreateBouquetDto,@UploadedFiles() images:{ images?: Express.Multer.File[]}) {
  return this.bouquetsService.create(req.headers.authorization,createBouquetDto,images)
  }


  @ApiBearerAuth()
  @ApiOperation({summary: 'Get a list of all bouquets with compositions for florists'})
  @ApiParam({name: 'status', description: 'example: available/sold'})
  @ApiResponse({
    status: 200,
    description: 'List of bouquets returned successfully',
    type: [BouquetEntity]
  })
  @UseGuards(FloristGuards)
  @Get('/withComposition/:status')
  findAllWithComposition(@Request() req, @Param('status') status:string) {
    return this.bouquetsService.findAllWithComposition(req.headers.authorization,status)
  }

  @ApiOperation({summary: 'Get a list of all bouquets for clients'})
  @ApiParam({name: 'status', description: 'example: all/available/sold',required:true})
  @ApiQuery({name: 'start', description: 'example: 2022-03-03',required:false})
  @ApiQuery({name: 'end', description: 'example: 2022-03-11',required:false})
  @ApiResponse({
    status: 200,
    description: 'List of bouquets returned successfully',
    type: [BouquetEntity]
  })
  @Get(':status')
  async findAll(@Query('start') start: Date, @Query('end') end: Date, @Param('status') status:string) {
    return this.bouquetsService.findAll(start,end,status)
  }

  @ApiOperation({summary: 'Get bouquets by category'})
  @ApiParam({name: 'category', description: 'example: 1'})
  @ApiResponse({
    status: 200,
    description: 'Bouquets returned successfully',
    type: [BouquetEntity]
  })
  @Get('/getByCategory/:category')
  async getByCategory(@Param('category') category: number) {
    return this.bouquetsService.getByCategory(category)
  }

  @ApiOperation({summary: 'Get recommended bouquets'})
  @ApiParam({name: 'recommended', description: 'example: recommended'})
  @ApiResponse({
    status: 201,
    description: 'Bouquets returned successfully',
    type: [BouquetEntity]
  })
  @Get('/getRecommended/:recommended')
  async getRecommended(@Param('recommended') recommended: string) {
    return this.bouquetsService.getRecommended(recommended)
  }

  @ApiOperation({summary: 'Get bouquet by name'})
  @ApiParam({name: 'name', description: 'example: bouquet name'})
  @ApiResponse({
    status: 201,
    description: 'Bouquet returned successfully',
    type: [BouquetEntity]
  })
  @Get('/getByName/:name')
  async getByName(@Param('name') name: string) {
    return this.bouquetsService.getByName(name)
  }

  @ApiOperation({summary: 'Get bouquet by id'})
  @ApiParam({name: 'id', description: 'Bouquet ID'})
  @ApiResponse({
    status: 200,
    description: 'Bouquet returned successfully',
    type: [BouquetEntity],
  })
  @ApiResponse({status: 404, description: 'Bouquet not found'})
  @Get('/getById/:id')
  async getById(@Param('id') id: number) {
    return this.bouquetsService.getById(id)
  }

  @ApiBearerAuth()
  @ApiOperation({summary: 'Update bouquet information'})
  @ApiConsumes('multipart/form-data')
  @ApiBody({type: UpdateBouquetDto})
  @ApiParam({name:"id",description:"Bouquet ID"})
  @ApiResponse({
    status: 200,
    description: 'Updated bouquet information will be returned',
    type: BouquetEntity
  })
  @ApiResponse({status: 404, description: 'Bouquet not found'})
  @UseInterceptors(FileFieldsInterceptor([{name:'images',maxCount:5}],{
    fileFilter: filter
  }))
  @UseGuards(FloristGuards)
  @Put(':id')
  update(@Body() updateBouquetDto: UpdateBouquetDto, @Param('id') id: number,@UploadedFiles() images:{images?: Express.Multer.File[]}): Promise<BouquetEntity> {
    return this.bouquetsService.update(id, updateBouquetDto,images)
  }

  @ApiBearerAuth()
  @ApiOperation({summary: 'Delete bouquet'})
  @ApiParam({name:"id",description:"Bouquet ID"})
  @ApiResponse({status: 200, description: 'Bouquet deleted successfully'})
  @ApiResponse({status: 404, description: 'Bouquet not found'})
  @UseGuards(AdminGuards)
  @Delete(':id')
  destroy(@Param('id') id: number) {
    return this.bouquetsService.destroy(id)
  }
}

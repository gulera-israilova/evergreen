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
import { BranchesService } from "./branches.service";
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
import { CreateBranchDto } from "./dto/create-branch.dto";
import { BranchEntity } from "./entity/branch.entity";
import { SuperGuards } from "../users/guards/super.guards";
import { UpdateBranchDto } from "./dto/update-branch.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { filter } from "../images/images-cloudinary";

@Controller('branches')
@ApiTags("branches")
export class BranchesController {
  constructor(private branchesService: BranchesService) {}

  @ApiBearerAuth()
  @ApiOperation({summary: 'Create branch'})
  @ApiConsumes('multipart/form-data')
  @ApiBody({type: CreateBranchDto})
  @ApiResponse({
    status: 201,
    description: 'Successfully created branch will be returned',
    type: BranchEntity
  })
  @UseInterceptors(FileInterceptor('image', {
    fileFilter: filter
  }))
 // @UseGuards(SuperGuards)
  @Post()
  create(@Body()createBranchDto: CreateBranchDto,@UploadedFile() image: Express.Multer.File) {
    return this.branchesService.create(createBranchDto,image)
  }

  @ApiOperation({summary: 'Get a list of all branches'})
  @ApiResponse({
    status: 201,
    description: 'List of branches returned successfully',
    type: [BranchEntity]
  })
  @Get()
  async findAll() {
    return this.branchesService.findAll()
  }

  @ApiOperation({summary: 'Get branch by id'})
  @ApiParam({name: 'id', description: 'Branch id'})
  @ApiResponse({
    status: 201,
    description: 'Branch returned successfully',
    type: [BranchEntity],
  })
  @Get('/getById/:id')
  async getById(@Param('id') id: number) {
    return this.branchesService.getById(id);
  }

  @ApiBearerAuth()
  @ApiOperation({summary: 'Update branch information'})
  @ApiConsumes('multipart/form-data')
  @ApiBody({type: CreateBranchDto})
  @ApiParam({name:"id",description:"Branch id"})
  @ApiResponse({
    status: 201,
    description: 'Updated branch information will be returned',
    type: BranchEntity,
  })
  @UseInterceptors(FileInterceptor('image', {
    fileFilter: filter
  }))
  @ApiResponse({status: 404, description: 'User not found'})
  @UseGuards(SuperGuards)
  @Put(':id')
  update(@Body() updateBranchDto: UpdateBranchDto, @Param('id') id: number,@UploadedFile() image: Express.Multer.File): Promise<BranchEntity> {
    return this.branchesService.update(id, updateBranchDto,image)
  }

  @ApiBearerAuth()
  @ApiOperation({summary: 'Delete branch'})
  @ApiParam({name:"id",description:"Branch id"})
  @ApiResponse({status: 200, description: 'Branch deleted successfully'})
  @ApiResponse({status: 404, description: 'Branch not found'})
  @UseGuards(SuperGuards)
  @Delete(':id')
  destroy(@Param('id') id: number) {
    return this.branchesService.destroy(id)
  }
}

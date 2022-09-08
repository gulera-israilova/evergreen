import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CategoriesService } from "./categories.service";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { CategoryEntity } from "./entity/category.entity";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { SuperGuards } from "../users/guards/super.guards";

@Controller('categories')
@ApiTags("categories")
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @ApiBearerAuth()
  @ApiOperation({summary: 'Create category'})
  @ApiBody({type: CreateCategoryDto})
  @ApiResponse({
    status: 200,
    description: 'Successfully created category will be returned',
    type: CategoryEntity
  })
  @UseGuards(SuperGuards)
  @Post()
  create(@Body()createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto)
  }

  @ApiOperation({summary: 'Get a list of all category'})
  @ApiResponse({
    status: 200,
    description: 'List of branches returned successfully',
    type: [CategoryEntity]
  })
  @Get()
  findAll() {
    return this.categoriesService.findAll()
  }

  @ApiOperation({summary: 'Get category by id'})
  @ApiParam({name: 'id', description: 'Category id'})
  @ApiResponse({
    status: 200,
    description: 'Category returned successfully',
    type: [CategoryEntity],
  })
  @Get('/getById/:id')
  async getById(@Param('id') id: number) {
    return this.categoriesService.getById(id);
  }

  @ApiBearerAuth()
  @ApiOperation({summary: 'Update category information'})
  @ApiBody({type: UpdateCategoryDto})
  @ApiParam({name:"id",description:"Category id"})
  @ApiResponse({
    status: 200,
    description: 'Updated category information will be returned',
    type: CategoryEntity,
  })
  @ApiResponse({status: 404, description: 'User not found'})
  @UseGuards(SuperGuards)
  @Put(':id')
  update(@Body() updateCategoryDto: UpdateCategoryDto, @Param('id') id: number): Promise<CategoryEntity> {
    return this.categoriesService.update(id, updateCategoryDto)
  }

  @ApiBearerAuth()
  @ApiOperation({summary: 'Delete category'})
  @ApiParam({name:"id",description:"Category id"})
  @ApiResponse({status: 200, description: 'Category deleted successfully'})
  @ApiResponse({status: 404, description: 'Category not found'})
  @UseGuards(SuperGuards)
  @Delete(':id')
  destroy(@Param('id') id: number) {
    return this.categoriesService.destroy(id)
  }
}

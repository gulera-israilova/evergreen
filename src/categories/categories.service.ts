import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CategoryEntity } from "./entity/category.entity";
import { UpdateCategoryDto } from "./dto/update-category.dto";

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>
  ) {}

  async create(createCategoryDto): Promise<CategoryEntity> {
    try {
      let category = await this.categoryRepository.findOne({
        where:
          {
            name: createCategoryDto.name,
          }
      })
      if (category) {
        throw new HttpException("Category with this name number already exists", HttpStatus.BAD_REQUEST)
      }
      return this.categoryRepository.save(createCategoryDto)
    } catch (e){
      throw new HttpException("Incorrect input data", HttpStatus.BAD_REQUEST)
    }
  }

  async findAll() : Promise<CategoryEntity[]> {
    return this.categoryRepository.find();
  }

  async getById(id: number): Promise<CategoryEntity> {
    return this.categoryRepository.findOne(id);
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto): Promise<CategoryEntity> {
    try {
      let category = await this.categoryRepository.findOne(id)
      if (!category) {
        throw new HttpException("No category for this id", HttpStatus.BAD_REQUEST)
      }

      Object.assign(category, updateCategoryDto)

      return await this.categoryRepository.save(category)
    } catch (e){
      throw new HttpException("Incorrect input data", HttpStatus.BAD_REQUEST)
    }
  }

  async destroy(id: number): Promise<void> {
    let category = await this.categoryRepository.findOne(id)
    if(!category){
      throw new HttpException("No category for this id", HttpStatus.BAD_REQUEST)
    }
    await this.categoryRepository.delete(id);
  }
}

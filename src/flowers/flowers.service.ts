import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { FlowerEntity } from "./entity/flower.entity";
import { UpdateFlowerDto } from "./dto/update-flower.dto";
import { _delete, get, upload } from "../images/images-cloudinary";

@Injectable()
export class FlowersService {

  constructor(
    @InjectRepository(FlowerEntity)
    private flowerRepository: Repository<FlowerEntity>
  ) {}

  async create(createFlowerDto,image): Promise<FlowerEntity> {
    try{
      let flower = await this.flowerRepository.findOne({
        where:
        {
          name: createFlowerDto.name,
        }
      })
    if(flower) {
      throw new HttpException("Flower with this name number already exists", HttpStatus.BAD_REQUEST)
    }
      if (typeof createFlowerDto.price === 'string' && createFlowerDto.price !== '') +createFlowerDto.price
      if (typeof createFlowerDto.price === 'string' && createFlowerDto.price === '') createFlowerDto.price = null
      if (typeof createFlowerDto.quantity === 'string' && createFlowerDto.quantity !== '') +createFlowerDto.quantity
      if (typeof createFlowerDto.quantity === 'string' && createFlowerDto.quantity === '') createFlowerDto.quantity = null
      if(image){
        const imageUpload = await upload(image);
        createFlowerDto.image = imageUpload.public_id
      } else createFlowerDto.image = null
      const flowerNew = await this.flowerRepository.save(createFlowerDto)
      flowerNew.image = await get(flowerNew.image)
      return flowerNew
    } catch (e){
      await _delete(createFlowerDto.image)
      throw new HttpException("Incorrect input data", HttpStatus.BAD_REQUEST)
    }
  }

  async findAll(page:number,limit:number) : Promise<any> {
    const take = limit || 10
    const skip = page * limit || 0
    const [flowers,total] = await this.flowerRepository.findAndCount({ take: take,
      skip: skip})
    for(let flower of flowers){
      flower.image = await get(flower.image)
    }
    return {
      data:flowers,total:total
    }
  }

  async getById(id: number): Promise<FlowerEntity> {
    const flower = await this.flowerRepository.findOne(id)
    flower.image = await get(flower.image)
    return flower
  }

  async getFlower(id: number): Promise<FlowerEntity> {
    return await this.flowerRepository.findOne(id)
  }

  async update(id: number, updateFlowerDto: UpdateFlowerDto,image): Promise<any> {
    try {
      let flower = await this.flowerRepository.findOne(id)
      if (!flower) {
        throw new HttpException("No flower for this id", HttpStatus.BAD_REQUEST)
      }
      if(image){
        await _delete(flower.image)
        const imageUpload = await upload(image)
        updateFlowerDto.image = imageUpload.public_id
      } else updateFlowerDto.image = flower.image
      Object.assign(flower, updateFlowerDto)

      const flowerNew = await this.flowerRepository.save(flower)
      updateFlowerDto.image = await get(flowerNew.image)
      return updateFlowerDto
    } catch (e){
      throw new HttpException("Incorrect input data", HttpStatus.BAD_REQUEST)
    }
  }
  async updateFlowerQuantity(id: number, updateFlowerDto: UpdateFlowerDto): Promise<FlowerEntity> {
    try {
      let flower = await this.flowerRepository.findOne(id)
      if (!flower) {
        throw new HttpException("No flower for this id", HttpStatus.BAD_REQUEST)
      }
      Object.assign(flower, updateFlowerDto)
      return await this.flowerRepository.save(flower)
    } catch (e){
      throw new HttpException("Incorrect input data", HttpStatus.BAD_REQUEST)
    }
  }
  async destroy(id: number): Promise<void> {
    let flower = await this.flowerRepository.findOne(id)
    if (flower.image) await _delete(flower.image)
    if (!flower) {
      throw new HttpException("No flower for this id", HttpStatus.BAD_REQUEST)
    }
    await this.flowerRepository.delete(id)
  }
}

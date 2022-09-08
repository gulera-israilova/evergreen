import {
  BadGatewayException,
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { FlowerBouquetEntity } from "./entity/flower-bouquet.entity";
import { CreateFbDto} from "./dto/create-flower-bouquet.dto";
import { UpdateFBDto } from "./dto/update-flower-bouquet.dto";

@Injectable()
export class FlowersBouquetsService {
  constructor(@InjectRepository(FlowerBouquetEntity)
              private flowerBouquetRepository: Repository<FlowerBouquetEntity>) {}

  async create(createFbDto): Promise<FlowerBouquetEntity[]> {
    const exist: FlowerBouquetEntity = await this.flowerBouquetRepository.findOne({
      flower: createFbDto.flower,
      bouquet: createFbDto.bouquet
    })
    if (exist) {
      throw new ConflictException(
        `The flower is already in the bouquet`,
      )
    }
    try {
      return await this.flowerBouquetRepository.save(createFbDto)
    } catch (e) {
      throw new BadRequestException(e.message)
    }
  }

  async get(options = {}): Promise<FlowerBouquetEntity[]> {
    return await this.flowerBouquetRepository.find({
      where: options,
      relations: ["bouquet","flower"]
    })
  }

  async getFlowersByBouquet(id:number): Promise<FlowerBouquetEntity[]> {
    return await this.flowerBouquetRepository.find({
     where:{ bouquet: id}

    })
  }
  async delete(id: number): Promise<any> {
    const entity: FlowerBouquetEntity = await this.flowerBouquetRepository.findOne({id});
    if (!entity) {
      throw new NotFoundException(
        `Данного цветка в составе букета нет`,
      );
    }
    try {
      await this.flowerBouquetRepository.delete(entity);
      return {
        status: 200,
        success: true,
        description: 'Flower successfully removed from bouquet\'s composition'
      };
    } catch (e) {
      throw new BadGatewayException(e.message);
    }
  }
  async removeUseless(entities: FlowerBouquetEntity[]): Promise<void> {
    for (const entity of entities) {
      await this.delete(entity.id);
    }
  }
  async edit(id: number, data: UpdateFBDto): Promise<any> {
    const entity: FlowerBouquetEntity = await this.flowerBouquetRepository.findOne({id});
    if (!entity) {
      throw new NotFoundException(
        `Данного продукта в составе блюда нет`,
      );
    }
    try {
      Object.assign(entity, data);
      await this.flowerBouquetRepository.save(entity);
      return {
        status: 200,
        success: true,
        description: 'DishesProduct updated successfully'
      };
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
}

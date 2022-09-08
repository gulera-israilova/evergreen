import { BadGatewayException, BadRequestException, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Between, Repository } from "typeorm";
import { _delete, get, upload } from "../images/images-cloudinary";
import { BouquetEntity } from "./entity/bouquet.entity";
import { UpdateBDto, UpdateBouquetDto } from "./dto/update-bouquet.dto";
import { FlowersBouquetsService } from "../flowers-bouquets/flowers-bouquets.service";
import { CreateFlowerBouquetDto } from "../flowers-bouquets/dto/create-flower-bouquet.dto";
import { FlowersService } from "../flowers/flowers.service";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";
import { BouquetStatus } from "./enum/bouquet.status";



@Injectable()
export class BouquetsService {

  constructor(@InjectRepository(BouquetEntity)
              private bouquetRepository: Repository<BouquetEntity>,
              private flowersBouquetsService: FlowersBouquetsService,
              private flowersService:FlowersService,
              private usersService:UsersService,
              private jwtService: JwtService) {}

  async create(header,createBouquetDto,images): Promise<BouquetEntity> {
    let bouquet = await this.bouquetRepository.findOne({ where: {name: createBouquetDto.name}})
    if(bouquet) {throw new HttpException("Bouquet with this name already exists", HttpStatus.BAD_REQUEST)}

    const token = header.split(' ')[1]
    const user = this.jwtService.verify(token)

    let florist = await this.usersService.getByPhone(user.phone)

    createBouquetDto.florist_phone = florist.phone
    createBouquetDto.branch = florist.branch.id
    createBouquetDto.florist_name = florist.firstname

    if (typeof createBouquetDto.category === 'string' && createBouquetDto.category !== '') createBouquetDto.category = +createBouquetDto.category
    createBouquetDto.composition = await this.checkComposition(createBouquetDto.composition)

    createBouquetDto.price = 0
    createBouquetDto.images = []

    if(images){
      for(let image of images.images){
      const imageUpload = await upload(image)
      createBouquetDto.images.push(imageUpload.public_id)}}

   for (let item of createBouquetDto.composition){
     let price
     let flower = await this.flowersService.getFlower(item.flower)
     price = item.quantity*flower.price
     createBouquetDto.price += price

     let updateFlower = flower
     updateFlower.quantity -=item.quantity
     await this.flowersService.updateFlowerQuantity(updateFlower.id,updateFlower)
   }

    let newBouquet
      try{
      newBouquet = await this.bouquetRepository.save(createBouquetDto)
      createBouquetDto.composition = newBouquet.composition

      } catch (e) {
        for (let image of images.images){
        await _delete(image)
      }
        throw new HttpException("Incorrect input data", HttpStatus.BAD_REQUEST)
      }
      try {
         if (createBouquetDto.composition && createBouquetDto.composition.length !== 0) {
          for (let e of createBouquetDto.composition) {
            if (!e.flower || !e.quantity) throw new BadRequestException()
            e.bouquet = newBouquet.id
            await this.flowersBouquetsService.create(e)
          }
        }
         Object.assign(newBouquet, createBouquetDto)
         return await this.bouquetRepository.save(newBouquet)
       } catch (e) {
         await this.destroy(newBouquet.id)
         throw new BadRequestException('Wrong composition')
      }
     }

  async findAllWithComposition(header, status:string) : Promise<BouquetEntity[]> {
    const token = header.split(' ')[1]
    const user = this.jwtService.verify(token)

    let bouquets = await this.bouquetRepository.find({
        where: {
          florist_phone: user.phone,
          status: status
        }
      })

     for (let bouquet of bouquets ){
     let imagesCheck = this.arrayFromStringImages(bouquet.images)
     const tmp = []
     for(let image of await imagesCheck) tmp.push(await get(image))
     bouquet.images = tmp
     bouquet.composition = await this.flowersBouquetsService.getFlowersByBouquet(bouquet.id)
     }
    return  bouquets
  }

  async findAll(start: Date,end: Date,status:string) : Promise<BouquetEntity[]> {
    let bouquets =[]
    if (status === 'all') {
      if (start !== undefined && end !== undefined) {
        let startedAt = new Date(start)
        let endedAt = new Date(end)
        bouquets = await this.bouquetRepository.find(
          {
            where:
              { created_at: Between(startedAt, endedAt) }
          })
      } else bouquets = await this.bouquetRepository.find()
    }

    if (status !== 'all') {
      if (start !== undefined && end !== undefined) {
        let startedAt = new Date(start)
        let endedAt = new Date(end)
        bouquets = await this.bouquetRepository.find(
          {
            where:
              { created_at: Between(startedAt, endedAt),
                status: status}
          })
      } else bouquets = await this.bouquetRepository.find({where:{status:status}})
    }

    for (let bouquet of bouquets ) {
      let imagesCheck = this.arrayFromStringImages(bouquet.images)
      const tmp = []
      for (let image of await imagesCheck) tmp.push(await get(image))
      bouquet.images = tmp
    }
    return bouquets
  }

  async getRecommended(recommended:string): Promise<any> {
    let bouquets =[]
    if (recommended === "recommended"){
    bouquets = await this.bouquetRepository.find({
      where:{
      status:BouquetStatus.AVAILABLE
      }})
    for (let bouquet of bouquets){
    let imagesCheck = this.arrayFromStringImages(bouquet.images)
    const tmp = []
    for(let image of await imagesCheck) {
      tmp.push(await get(image))
      bouquet.images = tmp
    }
  }
    }
    const recommendedBouquet =[]
    for(let i=0;i<4;i++){
      const randomIndex = Math.floor(Math.random() * bouquets.length)
      const randomItem = bouquets.splice(randomIndex, 1)[0]
      recommendedBouquet.push(randomItem)
    }
   return recommendedBouquet
  }

  async getByName(name:string):Promise<BouquetEntity>{
    let findBouquet
    const bouquets = await this.bouquetRepository.find()
    for (let bouquet of bouquets){
     if (bouquet.name.toLowerCase() === name.toLowerCase()){
       findBouquet = bouquet
     }
    }
    if(!findBouquet){
      throw new HttpException("A bouquet with this name does not exist", HttpStatus.BAD_REQUEST)
    }
    let imagesCheck = this.arrayFromStringImages(findBouquet.images)
    findBouquet.images =[]
    for(let image of await imagesCheck) {findBouquet.images.push(await get(image))}
    return findBouquet
  }

  async getByCategory(category:number): Promise<BouquetEntity[]> {
    const bouquets = await this.bouquetRepository.find({ where: { category: category } })
    for (let bouquet of bouquets ){
      let imagesCheck = this.arrayFromStringImages(bouquet.images)
      const tmp = []
      for(let image of await imagesCheck) tmp.push(await get(image))
      bouquet.images = tmp
    }
    return bouquets
  }

  async getByOrder(order:number): Promise<BouquetEntity[]> {
    const bouquets = await this.bouquetRepository.find({ where: { order: order } })
    for (let bouquet of bouquets ){
      let imagesCheck = this.arrayFromStringImages(bouquet.images)
      const tmp = []
      for(let image of await imagesCheck) tmp.push(await get(image))
      bouquet.images = tmp
    }
    return bouquets
  }

  async getById(id: number): Promise<BouquetEntity> {
    const bouquet = await this.bouquetRepository.findOne(id)
    let imagesCheck = this.arrayFromStringImages(bouquet.images)
    bouquet.images =[]
    for(let image of await imagesCheck) {bouquet.images.push(await get(image))}
    bouquet.composition = await this.flowersBouquetsService.getFlowersByBouquet(bouquet.id)
    return bouquet
  }

   async getOne(id:number):Promise<BouquetEntity>{
     return await this.bouquetRepository.findOne(id)
   }

  async addOrderId(id:number,data:BouquetEntity):Promise<BouquetEntity>{
    const bouquet = await this.bouquetRepository.findOne(id)
    Object.assign(bouquet,data)
    return await this.bouquetRepository.save(bouquet)
  }

    async update(id: number, updateBouquetDto: UpdateBouquetDto,images): Promise<BouquetEntity> {
      let bouquet = await this.bouquetRepository.findOne(id)
      if (!bouquet) {
        throw new HttpException("No bouquet for this id", HttpStatus.BAD_REQUEST)
      }
      const updateBouquet = new UpdateBDto()

      if (typeof updateBouquetDto.category === 'string' && updateBouquetDto.category !== '') updateBouquetDto.category = +updateBouquetDto.category
      // @ts-ignore
      updateBouquet.composition = await this.checkComposition(updateBouquetDto.composition)
      updateBouquetDto.composition = await this.checkComposition(updateBouquetDto.composition)

      updateBouquetDto.price = 0

      let composition = await this.flowersBouquetsService.getFlowersByBouquet(bouquet.id)

      for (let item of composition){
        // @ts-ignore
        let flower = await this.flowersService.getFlower(item.flower)
        let updateFlower = flower
        flower.quantity+=item.quantity
        await this.flowersService.updateFlowerQuantity(updateFlower.id,updateFlower)
      }
      for (let item of updateBouquet.composition){
        let price
        // @ts-ignore
        let flower = await this.flowersService.getFlower(item.flower)
        price = item.quantity*flower.price
        updateBouquetDto.price += price

        let updateFlower = flower
        updateFlower.quantity -=item.quantity
        await this.flowersService.updateFlowerQuantity(updateFlower.id,updateFlower)
      }

      updateBouquetDto.images = []
      let imagesCheck = this.arrayFromStringImages(bouquet.images)
      if(images){
        for(let image of await imagesCheck) await _delete(image)
        for(let image of images.images){
          const imageUpload = await upload(image)
          updateBouquetDto.images.push(imageUpload.public_id)
        }
      } else updateBouquetDto.images = bouquet.images
       if (updateBouquet.composition && updateBouquet.composition.length !== 0) {
          const composition = await this.flowersBouquetsService.get({bouquet: bouquet.id})
          await this.flowersBouquetsService.removeUseless(composition)

          for (const e of updateBouquet.composition) {
            if (!e.flower || !e.quantity) throw new BadRequestException()
            e.bouquet = bouquet
            await this.flowersBouquetsService.create(e);
          }
        }

      Object.assign(bouquet,updateBouquetDto)
      return await this.bouquetRepository.save(bouquet)
    }

    async destroy(id: number): Promise<void> {
      const bouquet = await this.bouquetRepository.findOne({id})
      if (!bouquet) {throw new HttpException("No bouquet for this id", HttpStatus.BAD_REQUEST)}

      try{
        const composition = await this.flowersBouquetsService.get({bouquet: bouquet.id});
        await this.flowersBouquetsService.removeUseless(composition)

        let images = this.arrayFromStringImages(bouquet.images)
        if (images) {for (let image of await images) await _delete(image)}

        await this.bouquetRepository.delete(id)

      } catch (e){
        throw new BadGatewayException('Deletion didn\'t happen')}
      }

    async arrayFromStringComposition(a: string): Promise<string[]> {
      a = a.replace("\n", "")
      a = a.replace(/\s+/g, '')
      a = a.replace("},{", '}#{')
      return a.split("#")
    }

    async arrayFromStringImages(images: any):Promise<any>{
      images = images.replace('{"','')
      images = images.replace('"}','')
      return  images.split('","')
    }

    async checkComposition(composition): Promise<CreateFlowerBouquetDto[]> {
      if ((typeof composition === 'string' && composition !== '') || typeof composition === 'object' && composition.length > 0) {
        try {
          if (typeof composition === 'string' && composition !== '') composition = await this.arrayFromStringComposition(composition);
          return composition.map(e => {
            while (typeof e === 'string') e = JSON.parse(e);
            return e
          })
        } catch (e) {
          throw new BadRequestException('Wrong composition')
        }
      } else return null
    }
}

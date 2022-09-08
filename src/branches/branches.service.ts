import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BranchEntity } from "./entity/branch.entity";
import { UpdateBranchDto } from "./dto/update-branch.dto";
import { _delete, get, upload } from "../images/images-cloudinary";

@Injectable()
export class BranchesService {

  constructor(
    @InjectRepository(BranchEntity)
    private branchRepository: Repository<BranchEntity>
  ) {}

  async create(createBranchDto,image): Promise<BranchEntity> {
 try{
    let branch = await this.branchRepository.findOne({
      where:
        {
          name: createBranchDto.name,
        }
    })
    if(branch) {
      throw new HttpException("Branch with this name number already exists", HttpStatus.BAD_REQUEST)
    }

    if(image){
      const imageUpload = await upload(image)
      createBranchDto.image = imageUpload.public_id
    } else createBranchDto.image = null
 }catch (e){
   await _delete(createBranchDto.image)
   throw new HttpException("Incorrect input data", HttpStatus.BAD_REQUEST)
 }
    const branchNew = await this.branchRepository.save(createBranchDto)
    branchNew.image = await get(branchNew.image)
    return branchNew
  }

  async findAll() : Promise<BranchEntity[]> {
    const branches = await this.branchRepository.find()
    for(let branch of branches){
      branch.image = await get(branch.image)
    }
    return branches
  }

  async getById(id: number): Promise<BranchEntity> {
    const branch = await this.branchRepository.findOne(id)
    branch.image = await get(branch.image)
    return branch
  }

  async update(id: number, updateBranchDto: UpdateBranchDto,image): Promise<any> {
    let branch = await this.branchRepository.findOne(id)
    if (!branch) {
      throw new HttpException("No branch for this id", HttpStatus.BAD_REQUEST)
    }
    if(image){
      await _delete(branch.image)
      const imageUpload = await upload(image)
      updateBranchDto.image = imageUpload.public_id
    } else updateBranchDto.image = branch.image
    Object.assign(branch,updateBranchDto)

    const branchNew = await this.branchRepository.save(branch)
    updateBranchDto.image = await get(branchNew.image)
    return updateBranchDto
  }

  async destroy(id: number): Promise<void> {
    let branch = await this.branchRepository.findOne(id)
    if (branch.image) await _delete(branch.image)
    if(!branch){
      throw new HttpException("No branch for this id", HttpStatus.BAD_REQUEST)
    }
    await this.branchRepository.delete(id);
  }
}

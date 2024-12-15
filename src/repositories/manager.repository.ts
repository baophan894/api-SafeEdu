import { Manager } from '@modules/Manager/entities/Manager.entity';
import { ManagerRepositoryInterface } from '@modules/Manager/interfaces/Manager.interface';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';


@Injectable()
export class ManagerRepository implements ManagerRepositoryInterface {
	constructor(
		@InjectModel(Manager.name) private readonly ManagerModel: Model<Manager>,
	) {}
	async findOne(condition: FilterQuery<Manager>): Promise<Manager | null> {
		return await this.ManagerModel.findOne(condition).exec(); 
	  }
	async create(data: Partial<Manager>): Promise<Manager> {
		console.log('data:', JSON.stringify(data, null, 2));
		
		try {
			const newManager = new this.ManagerModel(data);
			const savedManager = await newManager.save();
			return savedManager;
		  } catch (error) {
			console.error('Error saving new Manager:', error.message);
		  
			// Tùy chỉnh lỗi phản hồi
			throw new BadRequestException('Failed to create Manager. Please try again.');
		  }
	}
	async findAll() {
		const Managers = await this.ManagerModel
		  .find()
		  .exec(); 
	  
		const total = await this.ManagerModel.countDocuments().exec();
		return { items: Managers, total };
	  }
	  
	  

	async getManagerWithRole(ManagerId: string): Promise<Manager | null> {
		return await this.ManagerModel.findById(ManagerId).populate('role').exec();
	}

	async update(id: string, data: Partial<Manager>): Promise<Manager | null> {
		return await this.ManagerModel.findByIdAndUpdate(id, data, { new: true }).exec();
	}

	async remove(id: string): Promise<boolean> {
		const result = await this.ManagerModel.findByIdAndDelete(id).exec();
		return !!result;
	}

	async findById(id: string): Promise<Manager | null> {
		return await this.ManagerModel.findById(id).exec(); // Using Mongoose's findById method
	  }
}

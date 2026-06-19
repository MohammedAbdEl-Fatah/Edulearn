import { Document, Model, QueryOptions, RootFilterQuery, ProjectionType, UpdateQuery, MongooseUpdateQueryOptions, MongooseBaseQueryOptions } from "mongoose";

export abstract class DatabaseRepository<T> {
    constructor(protected readonly model: Model<T>) { }



    async create(item: T): Promise<T & Document> {
        const doc = new this.model(item);
        return await doc.save() as unknown as Promise<T & Document>;
    }
    //read 
    async getOne({
        filter,
        projection,
        options
    }: {
        filter: RootFilterQuery<T>,
        projection?: ProjectionType<T>,
        options?: QueryOptions<T>
    }): Promise<T | null> {
        return await this.model.findOne(filter, projection, options);
    }
    async getAll({
        filter,
        projection,
        options
    }: {
        filter: RootFilterQuery<T>,
        projection?: ProjectionType<T>,
        options?: QueryOptions<T>
    }): Promise<T[]> {
        return await this.model.find(filter, projection, options);
    }
    //update write
    async updateOne({
        filter,
        projection,
        options
    }: {
        filter: RootFilterQuery<T>,
        projection: UpdateQuery<T>,
        options?: MongooseUpdateQueryOptions<T>
    }): Promise<any> {
        return await this.model.updateOne(filter, projection, options);
    }
    async updateMany({
        filter,
        projection,
        options
    }: {
        filter: RootFilterQuery<T>,
        projection: UpdateQuery<T>,
        options?: MongooseUpdateQueryOptions<T>
    }): Promise<any> {
        return await this.model.updateMany(filter, projection, options);
    }

    //delete
    async deleteOne({ filter, options }: { filter: RootFilterQuery<T>, options?: MongooseBaseQueryOptions<T> }): Promise<any> {
        return await this.model.deleteOne(filter, options);
    }
    async deleteMany({ filter, options }: { filter: RootFilterQuery<T>, options?: MongooseBaseQueryOptions<T> }): Promise<any> {
        return await this.model.deleteMany(filter, options);
    }
}


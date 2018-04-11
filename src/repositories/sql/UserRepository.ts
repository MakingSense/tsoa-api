import { ProvideSingleton, inject } from '../../ioc';
import { BaseRepository } from './BaseRepository';
import { IUserModel, UserFormatter } from '../../models';
import { UserEntity } from './entities';

@ProvideSingleton(UserRepository)
export class UserRepository extends BaseRepository<IUserModel> {
    protected formatter: any = UserFormatter;

    constructor(@inject(UserEntity) protected entityModel: UserEntity) {
        super();
    }

    /** for aditional logic (maybe nested entities) */
    public async create(model: IUserModel, include = this.saveInclude): Promise<IUserModel> {
        return super.create(model, include);
    }

    /** for aditional logic (maybe nested entities) */
    public async update(_id: string, model: IUserModel): Promise<void> {
        return super.update(_id, model);
    }
}

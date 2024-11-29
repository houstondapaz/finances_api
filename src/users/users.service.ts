import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserAlreadyExistsException } from './exceptions/user-already-exists.exception';
import { getOrder, getWhere } from 'src/shared/filterable/typeorm.helper';
import { Pagination } from 'src/shared/filterable/pagination.decorator';
import { Sorting } from 'src/shared/filterable/sorting.decorator';
import { Filtering } from 'src/shared/filterable/filter.decorator';
import { PaginatedResource } from 'src/shared/filterable/paginated-resource';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    if (
      await this.usersRepository.existsBy({
        email: createUserDto.email,
      })
    ) {
      throw new UserAlreadyExistsException(createUserDto.email);
    }

    const entity = this.usersRepository.create({
      email: createUserDto.email,
      name: createUserDto.name,
      thumbURL: createUserDto.thumbURL,
    });

    await this.usersRepository.save(entity);

    return entity;
  }

  async findAll(
    pagination: Pagination,
    sort?: Sorting,
    filter?: Filtering,
  ): Promise<PaginatedResource<User>> {
    const where = getWhere(filter);
    const order = getOrder(sort);

    const [users, total] = await this.usersRepository.findAndCount({
      where,
      order,
      take: pagination.limit,
      skip: pagination.offset,
    });

    return {
      items: users,
      total: total,
      page: pagination.page,
      size: pagination.size,
    };
  }

  findOne(id: string) {
    return this.usersRepository.findOne({ where: { id } });
  }

  async findByEmail(email: string) {
    const user = await this.usersRepository.findOne({
      where: {
        email: email,
      },
    });
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.usersRepository.findOne({
      where: {
        id,
      },
    });

    if (updateUserDto.name) {
      user.name = updateUserDto.name;
    }

    if (updateUserDto.email) {
      user.name = updateUserDto.email;
    }

    if (updateUserDto.thumbURL) {
      user.thumbURL = updateUserDto.thumbURL;
    }

    await this.usersRepository.update(
      {
        id,
      },
      user,
    );
  }

  remove(id: string) {
    return this.usersRepository.softDelete(id);
  }
}

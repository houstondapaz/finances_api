import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserAlreadyExistsException } from './exceptions/user-already-exists.exception';
import { getOrder, getWhere } from 'src/shared/filterable/typeorm.helper';
import { PaginatedResource } from 'src/shared/filterable/paginated-resource';
import { PaginationOptions } from 'src/shared/filterable/pagination-options';

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
    pagination: PaginationOptions,
  ): Promise<PaginatedResource<User>> {
    const where = getWhere(pagination.filters);
    const order = getOrder(pagination.sort);

    const [users, total] = await this.usersRepository.findAndCount({
      where,
      order,
      take: pagination.limit,
      skip: pagination.skip,
    });

    return {
      items: users,
      total: total,
      page: pagination.page,
      pageSize: pagination.limit,
      totalPages: Math.ceil(total / pagination.limit) || 1,
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

import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  private readonly safeUserSelect = {
    id: true,
    name: true,
    createdAt: true,
    updatedAt: true,
  };

  hashPassword(pin: string) {
    return bcrypt.hash(pin, 10);
  }

  pinMatchesHash(pin: string, hash: string) {
    return bcrypt.compare(pin, hash);
  }

  async create(payload: CreateUserDto) {
    const pinHash = await this.hashPassword(payload.pin);

    const existingUser = await this.prisma.user.findFirst({
      where: { name: payload.name },
    });

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const user = await this.prisma.user.create({
      data: {
        name: payload.name,
        pinHash,
      },
      select: this.safeUserSelect,
    });

    return user;
  }

  async findAll() {
    return this.prisma.user.findMany({
      select: this.safeUserSelect,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: this.safeUserSelect,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findByFullNameWithPin(name: string) {
    return this.prisma.user.findFirst({
      where: { name },
      select: {
        id: true,
        name: true,
        pinHash: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.findOne(id);

    const data: {
      name?: string;
      pinHash?: string;
    } = {};

    if (updateUserDto.name) {
      data.name = updateUserDto.name;
    }

    if (updateUserDto.pin) {
      data.pinHash = await bcrypt.hash(updateUserDto.pin, 10);
    }

    return this.prisma.user.update({
      where: { id },
      data,
      select: this.safeUserSelect,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.user.delete({
      where: { id },
    });

    return {
      message: 'User deleted successfully',
    };
  }
}

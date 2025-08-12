import { Injectable } from '@nestjs/common';
import { CreatePostDto, CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  //create one
  async create(createUserDto: CreateUserDto) {
    const lastUser = await this.prisma.user.findFirst({
      orderBy: { id: 'desc' },
    });
    let nextIdNumber = 1;

    if (lastUser?.user_id) {
      const lastIdNumber = parseInt(lastUser.user_id.split('-')[1], 10);
      if (!isNaN(lastIdNumber)) {
        nextIdNumber = lastIdNumber + 1;
      }
    }
    const user_id = `user-${String(nextIdNumber).padStart(2, '0')}`;
    return this.prisma.user.create({
      data: {
        ...createUserDto,
        user_id,
        posts: {},
      },
    });
  }

  async addRoles(role: { name: string }[]) {
    return this.prisma.role.createMany({
      data: role,
    });
  }

  //create relation
  async createRelation(createUserDto: CreateUserDto) {
    const lastUser = await this.prisma.user.findFirst({
      orderBy: { id: 'desc' },
      select: { user_id: true },
    });

    let nextIdNumber = 1;

    if (lastUser?.user_id) {
      const match = lastUser.user_id.match(/^user-(\d+)$/);
      if (match && !isNaN(Number(match[1]))) {
        nextIdNumber = Number(match[1]) + 1;
      }
    }

    const user_id = `user-${String(nextIdNumber).padStart(2, '0')}`;

    const { name, email, age, profile, posts, roleIds } = createUserDto;

    let validRoles: { id: number }[] = [];
    if (roleIds?.length) {
      const foundRoles = await this.prisma.role.findMany({
        where: {
          id: { in: roleIds },
        },
        select: { id: true },
      });

      validRoles = foundRoles.map((r) => ({ id: r.id }));
    }

    const createdUser = await this.prisma.user.create({
      data: {
        name,
        email,
        age,
        user_id,
        Profile: profile?.bio
          ? {
              create: {
                bio: profile.bio,
              },
            }
          : undefined,
        posts: posts?.length
          ? {
              create: posts.map((post) => ({
                title: post.title,
                content: post.content,
              })),
            }
          : undefined,
        roles: validRoles.length
          ? {
              connect: validRoles,
            }
          : undefined,
      },
      include: {
        Profile: true,
        posts: true,
        roles: true,
      },
    });

    return createdUser;
  }

  //create many
  async createMany(users: CreateUserDto[]) {
    const lastUser = await this.prisma.user.findFirst({
      orderBy: { id: 'desc' },
    });

    let nextIdNumber = 1;
    if (lastUser?.user_id) {
      const lastIdNumber = parseInt(lastUser.user_id.split('_')[1], 10);
      nextIdNumber = lastIdNumber + 1;
    }
    const usersWithIds = users.map((user) => {
      const user_id = `user-${String(nextIdNumber).padStart(2, '0')}`;
      nextIdNumber++;

      return {
        ...user,
        user_id,
      };
    });
    const result = await this.prisma.user.createMany({
      data: usersWithIds,
      skipDuplicates: true,
    });

    return result;
  }

  //find all
  async findAll() {
    return await this.prisma.user.findMany();
  }

  //find one
  async findOne(email) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    return user;
  }

  //update
  async update(email: string, updateUserDto: UpdateUserDto) {
    const { age, name } = updateUserDto;
    return await this.prisma.user.update({
      where: { email },
      data: { age, name },
    });
  }

  // delete
  async remove(email: string) {
    const user = await this.prisma.user.findFirst({
      where: { email },
      select: { id: true },
    });

    if (!user) {
      throw new Error(`User with email ${email} not found`);
    }

    const userId = user.id;

    await this.prisma.post.deleteMany({
      where: { authorId: userId },
    });

    await this.prisma.profile.deleteMany({
      where: { userId },
    });

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        roles: {
          set: [],
        },
      },
    });

    return await this.prisma.user.delete({
      where: { id: userId },
    });
  }

  async deleteMany(user_ids: string[]) {
    return await this.prisma.user.deleteMany({
      where: {
        user_id: {
          in: user_ids,
        },
      },
    });
  }
}

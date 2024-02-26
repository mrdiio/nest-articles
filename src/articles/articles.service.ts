import { Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class ArticlesService {
  constructor(private readonly db: PrismaService) {}

  create(createArticleDto: CreateArticleDto) {
    return this.db.article.create({
      data: createArticleDto,
    });
  }

  findAll() {
    return this.db.article.findMany();
  }

  findOne(id: string) {
    return this.db.article.findUniqueOrThrow({
      where: { id },
    });
  }

  update(id: string, updateArticleDto: UpdateArticleDto) {
    return this.db.article.update({
      where: { id },
      data: updateArticleDto,
    });
  }

  remove(id: number) {
    return `This action removes a #${id} article`;
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/createComment.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CommentService {
    constructor(private readonly prismaService: PrismaService){}
    
    async getAll() {
        return this.prismaService.comment.findMany({
            include:{
                user :{
                    select:{
                        username: true
                    }
                },
                post:{
                    select :{
                        title:true
                    }
                }

            }
        })
    }

    async create(userId: any, createCommentDto: CreateCommentDto) {
        const {postId, content} = createCommentDto
        const post = this.prismaService.post.findUnique({where: {postId}})
        if(!post) throw new NotFoundException("le Post est trouvable")

        await this.prismaService.comment.create({data: {userId, content, postId}})

        return {data: "Un commentaire été ajouter"}
    }
}

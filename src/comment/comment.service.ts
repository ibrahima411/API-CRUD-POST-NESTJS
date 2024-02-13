import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/createComment.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateCommentDto } from './dto/updateComment.dto';

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

    async delete(commentId: number, userId: any) {
        const comment = await this.prismaService.comment.findUnique({where: {commentId}})
        if(!comment) throw new NotFoundException('commentiare invtrouvable')

        if(comment.userId !== userId) throw new ForbiddenException("vous avez pas le droit de supprimer de cette comment")

        await this.prismaService.comment.delete({where : {commentId}})
        return {data: "le commentaire a été supprimer"}
    }

    async update(userId: any, commentId: number, updateCommentDto: UpdateCommentDto) {
        const {content} = updateCommentDto
        const comment = await this.prismaService.comment.findUnique({where: {commentId}})
        if(!comment) throw new NotFoundException('commentiare invtrouvable')

        if(comment.userId !== userId) throw new ForbiddenException("vous avez pas le droit de supprimer de cette comment")

        await this.prismaService.comment.update({where:{commentId}, data:{content}})

        return {data: "le cemmentaire a été modifier avce success"}
    }
}

import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/createPost.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdatePostDto } from './dto/updatePost.dto';

@Injectable()
export class PostService {
    constructor(private readonly prismaService: PrismaService){}

    async getAll() {
        return await this.prismaService.post.findMany({
            include: {
                user: {
                    select :{
                        username:true,
                        email: true,
                        password: false
                    }
                },
                comment :true
            }
        })
    }
    async create(createPostDto: CreatePostDto, userId: any) {
        const {title, body} = createPostDto
        await this.prismaService.post.create({data : {body, title, userId}})

        return {data: "post creer avec success"}
    }

    async delete(postId: number, userId: number) {
        //verifier dabord si le post existe
        const post = await this.prismaService.post.findUnique({where: {postId}})
        if(!post) throw new NotFoundException('post introuvable')

        //verfier si l'utilisateur qui supprimer le post l'avait creer
        if(post.userId !== userId) throw new ForbiddenException('le post que vous supprimer ne vous appartient pas')

        await this.prismaService.post.delete({where : {postId}})

        return {data: 'le post a été supprimer avec success'}
    }
    async update(postId: number, userId: any, updatePostDto: UpdatePostDto) {
        const {title, body} = updatePostDto
        //verifier dabord si le post existe
        const post = await this.prismaService.post.findUnique({where: {postId}})
        if(!post) throw new NotFoundException('post introuvable')

         //verfier si l'utilisateur qui supprimer le post l'avait creer
         if(post.userId !== userId) throw new ForbiddenException('le post que vous supprimer ne vous appartient pas')

         await this.prismaService.post.update({where: {postId},data: {...updatePostDto}})

         return {data: "Le post a été modifier avec success"}
    }
}

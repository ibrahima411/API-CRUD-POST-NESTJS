import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, Req, UseGuards } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/createPost.dto';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { UpdatePostDto } from './dto/updatePost.dto';

@Controller('posts')
export class PostController {
    constructor(readonly postService: PostService){}

    @UseGuards(AuthGuard('jwt'))
    @Get()
    getAll(){
        return this.postService.getAll()
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('create')
    create(@Body() createPostDto: CreatePostDto, @Req() request: Request){
        const userId = request.user["userId"]
        return this.postService.create(createPostDto, userId)
    }
    @UseGuards(AuthGuard('jwt'))
    @Delete('delete/:id')
    deletepost(@Param('id', ParseIntPipe) postId: number,@Req() request: Request){
        const userId = request.user['userId']
        return this.postService.delete(postId, userId)
    }

    //Update
    @UseGuards(AuthGuard('jwt'))
    @Put('update/:id')
    updatepost(@Param('id', ParseIntPipe) postId: number,@Body() updatePostDto: UpdatePostDto, @Req() request: Request){
        const userId = request.user['userId']
        return this.postService.update(postId, userId, updatePostDto)
    }
}

import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/createComment.dto';
import {Request} from 'express'
import { AuthGuard } from '@nestjs/passport';

@Controller('comments')
export class CommentController {
    constructor(private readonly commentService: CommentService){}

    @UseGuards(AuthGuard('jwt'))
    @Get()
    getAll(){
        return this.commentService.getAll()
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('create')
    create(@Body() createCommentDto: CreateCommentDto, @Req() request: Request){
        const userId = request.user['userId']

        return this.commentService.create(userId, createCommentDto)

    }
}

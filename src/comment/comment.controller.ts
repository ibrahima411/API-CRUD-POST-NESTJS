import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Req, UseGuards } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/createComment.dto';
import { Request } from 'express'
import { AuthGuard } from '@nestjs/passport';
import { UpdateCommentDto } from './dto/updateComment.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Comment')
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
    @UseGuards(AuthGuard('jwt'))
    @Delete('delete/:id')
    deleteComment(@Param('id', ParseIntPipe) commentId: number,@Req() request: Request){
        const userId = request.user['userId']
        return this.commentService.delete(commentId, userId)
    }

    @UseGuards(AuthGuard('jwt'))
    @Put('update/:id')
    updateComment(@Param('id', ParseIntPipe) commentId: number, @Body() updateCommentDto: UpdateCommentDto, @Req() request:Request){
        const userId = request.user['userId']
        return this.commentService.update(userId, commentId, updateCommentDto)
    }
}

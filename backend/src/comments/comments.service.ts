import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, postId: string, dto: CreateCommentDto) {
    // Verify post exists
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    // If parentId is provided, verify parent comment exists and belongs to same post
    if (dto.parentId) {
      const parentComment = await this.prisma.comment.findUnique({
        where: { id: dto.parentId },
        include: { post: true },
      });

      if (!parentComment) {
        throw new NotFoundException('Parent comment not found');
      }

      if (parentComment.postId !== postId) {
        throw new ForbiddenException(
          'Parent comment does not belong to this post',
        );
      }
    }

    // Create the comment
    const comment = await this.prisma.comment.create({
      data: {
        content: dto.content,
        authorId: userId,
        postId: postId,
        parentId: dto.parentId || null,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
        _count: {
          select: {
            votes: true,
            replies: true,
          },
        },
      },
    });

    return comment;
  }
  async findByPost(postId: string) {
    // Verify post exists
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const topLevelComments = await this.prisma.comment.findMany({
      where: {
        postId: postId,
        parentId: null, // Only top-level comments
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
          },
        },
        _count: {
          select: {
            votes: true,
            replies: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    // For each top-level comment, get its replies recursively
    const commentsWithReplies = await Promise.all(
      topLevelComments.map((comment) => this.getCommentWithReplies(comment.id)),
    );
    return commentsWithReplies;
  }

  private async getCommentWithReplies(commentId: string) {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
      include: {
        author: {
          select: {
            id: true,
            username: true,
          },
        },
        _count: {
          select: {
            votes: true,
            replies: true,
          },
        },
      },
    });

    if (!comment) {
      return null;
    }
    // Get direct replies
    const replies = await this.prisma.comment.findMany({
      where: { parentId: commentId },
      include: {
        author: {
          select: {
            id: true,
            username: true,
          },
        },
        _count: {
          select: {
            votes: true,
            replies: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Recursively get replies for each reply
    const repliesWithNested = await Promise.all(
      replies.map((reply) => this.getCommentWithReplies(reply.id)),
    );
    return {
      ...comment,
      replies: repliesWithNested.filter(Boolean), //remove null
    };
  }
}

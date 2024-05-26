import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments-repository'
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comments'
import { InMemoryStudentsRepository } from './in-memory-students-repository'
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author'

export class InMemoryAnswerCommentsRepository
  implements AnswerCommentsRepository
{
  public answerComments: AnswerComment[] = []

  constructor(private studentsRepository: InMemoryStudentsRepository) {}

  async findById(id: string) {
    const answerComment = this.answerComments.find(
      (comment) => comment.id.toString() === id,
    )

    if (!answerComment) return null

    return answerComment
  }

  async findManyByAnswerId(answerId: string, { page }: PaginationParams) {
    const answerComment = this.answerComments
      .filter((answerComment) => answerComment.answerId.toString() === answerId)
      .slice((page - 1) * 20, page * 20)

    return answerComment
  }

  async findManyByAnswerIdWithAuthor(
    answerId: string,
    { page }: PaginationParams,
  ) {
    const answerComments = this.answerComments
      .filter((item) => item.answerId.toString() === answerId)
      .slice((page - 1) * 20, page * 20)
      .map((comment) => {
        const author = this.studentsRepository.items.find((student) => {
          return student.id.equals(comment.authorId)
        })

        if (!author) {
          throw new Error(
            `Author with ID "${comment.authorId.toString()} does not exist"`,
          )
        }

        return CommentWithAuthor.create({
          commentId: comment.id,
          content: comment.content,
          createdAt: comment.createdAt,
          updatedAt: comment.updatedAt,
          authorId: comment.authorId,
          author: author.name,
        })
      })

    return answerComments
  }

  async create(answerComment: AnswerComment) {
    this.answerComments.push(answerComment)
  }

  async delete(answerComment: AnswerComment) {
    const itemIndex = this.answerComments.findIndex(
      (comment) => comment.id === answerComment.id,
    )

    this.answerComments.splice(itemIndex, 1)
  }
}

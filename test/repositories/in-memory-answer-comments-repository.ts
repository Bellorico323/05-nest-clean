import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments-repository'
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comments'

export class InMemoryAnswerCommentsRepository
  implements AnswerCommentsRepository
{
  public answerComments: AnswerComment[] = []

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

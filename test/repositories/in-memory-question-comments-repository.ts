import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository'
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comments'

export class InMemoryQuestionCommentsRepository
  implements QuestionCommentsRepository
{
  public questionComments: QuestionComment[] = []

  async findById(id: string) {
    const questionComment = this.questionComments.find(
      (comment) => comment.id.toString() === id,
    )

    if (!questionComment) return null

    return questionComment
  }

  async findManyByQuestionId(questionId: string, { page }: PaginationParams) {
    const questionComment = this.questionComments
      .filter(
        (questionComment) =>
          questionComment.questionId.toString() === questionId,
      )
      .slice((page - 1) * 20, page * 20)

    return questionComment
  }

  async create(questionComment: QuestionComment) {
    this.questionComments.push(questionComment)
  }

  async delete(questionComment: QuestionComment) {
    const itemIndex = this.questionComments.findIndex(
      (comment) => comment.id === questionComment.id,
    )

    this.questionComments.splice(itemIndex, 1)
  }
}

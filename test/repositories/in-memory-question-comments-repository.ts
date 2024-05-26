import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository'
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comments'
import { InMemoryStudentsRepository } from './in-memory-students-repository'
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author'

export class InMemoryQuestionCommentsRepository
  implements QuestionCommentsRepository
{
  public questionComments: QuestionComment[] = []

  constructor(private studentsRepository: InMemoryStudentsRepository) {}

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

  async findManyByQuestionIdWithAuthor(
    questionId: string,
    { page }: PaginationParams,
  ) {
    const questionComment = this.questionComments
      .filter(
        (questionComment) =>
          questionComment.questionId.toString() === questionId,
      )
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

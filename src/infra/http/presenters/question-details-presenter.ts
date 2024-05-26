import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects/question-details'
import { AttachmentPresenter } from './attachment-presenter'

export class QuestionDetailsPresenter {
  static toHTTP(questiondetails: QuestionDetails) {
    return {
      questionId: questiondetails.questionId.toString(),
      authorId: questiondetails.authorId.toString(),
      author: questiondetails.author,
      title: questiondetails.title,
      content: questiondetails.content,
      slug: questiondetails.slug.value,
      bestAnswerId: questiondetails.bestAnswerId,
      attachments: questiondetails.attachments.map(AttachmentPresenter.toHTTP),
      createdAt: questiondetails.createdAt,
      updatedAt: questiondetails.updatedAt,
    }
  }
}

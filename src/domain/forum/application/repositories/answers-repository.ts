import { PaginationParams } from '@/core/repositories/pagination-params'
import { Answer } from '@/domain/forum/enterprise/entities/answer'

export interface AnswersRepository {
  findById(id: string): Promise<Answer | null>
  findManyByQuestionId(
    params: PaginationParams,
    questionId: string,
  ): Promise<Answer[]>
  save(answer: Answer): Promise<void>
  create(answer: Answer): Promise<void>
  delete(answer: Answer): Promise<void>
}

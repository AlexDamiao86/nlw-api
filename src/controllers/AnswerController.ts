import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { AppError } from '../errors/AppError';
import { SurveysUsersRepository } from '../repositories/SurveysUsersRepository';

class AnswerController {
  async execute(request: Request, response: Response) {
    const { value } = request.params;
    const { u } = request.query;

    const surveysUsersRespository = getCustomRepository(SurveysUsersRepository);
    const surveyUserExists = await surveysUsersRespository.findOne({
      id: String(u)
    })

    if(!surveyUserExists) throw new AppError("Survey User does not exist")

    surveyUserExists.value = Number(value);
    await surveysUsersRespository.save(surveyUserExists);

    return response.json(surveyUserExists);
  }
}

export { AnswerController };

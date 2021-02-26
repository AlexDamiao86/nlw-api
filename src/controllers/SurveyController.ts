import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { AppError } from '../errors/AppError';
import SurveysRepository from '../repositories/SurveysRepository';

class SurveyController {
  async create(request: Request, response: Response) {
    const { title, description } = request.body;

    const surveysRepository = getCustomRepository(SurveysRepository);

    const titleAlreadyExists = await surveysRepository.findOne({
      title
    });

    if (titleAlreadyExists) throw new AppError("Title already exists!");

    const survey = surveysRepository.create({
      title, description
    })
    await surveysRepository.save(survey);

    return response.status(201).json(survey);
  }

  async show(request: Request, response: Response) {
    const surveysRepository = getCustomRepository(SurveysRepository);

    const allSurveys = await surveysRepository.find();

    return response.json(allSurveys);
  }
}

export { SurveyController };

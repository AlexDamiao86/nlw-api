import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import SurveysRepository from '../repositories/SurveysRepository';

class SurveyController {
  async create(request: Request, response: Response) {
    const { title, description } = request.body;

    const surveysRepository = getCustomRepository(SurveysRepository);

    const titleAlreadyExists = await surveysRepository.findOne({
      title
    });

    if (titleAlreadyExists) {
      return response.status(400).json({
        error: "Title already exists!"
      });
    }

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

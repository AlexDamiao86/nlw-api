import { getCustomRepository } from "typeorm";
import SurveysRepository from "../repositories/SurveysRepository";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";
import UsersRepository from "../repositories/UsersRepository";
import { Request, Response } from 'express';
import SendMailService from "../services/SendMailService";
import { resolve } from 'path';
import { AppError } from "../errors/AppError";

class SendMailController {
  async execute(request: Request, response: Response) {
    const { email, survey_id } = request.body;

    const usersRepository = getCustomRepository(UsersRepository);
    const surveysRepository = getCustomRepository(SurveysRepository);
    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

    const user = await usersRepository.findOne({ email });

    if(!user) throw new AppError("User does not exist");

    const survey = await surveysRepository.findOne({ id: survey_id });

    if(!survey) throw new AppError("Survey does not exist");

    const surveyUserAlreadyExists = await surveysUsersRepository.findOne({
      where: [{
        user_id: user.id,
        survey_id,
        value: null
      }],
      relations: ["user", "survey"]
    });

    const npsPath = resolve(__dirname, "..", "views", "emails", "npsMail.hbs");

    const variables = {
      name: user.name,
      title: survey.title,
      description: survey.description,
      surveyUser_id: null,
      link: process.env.URL_MAIL
    }

    //Caso já exista, envia a pesquisa existente
    if (surveyUserAlreadyExists) {
      variables.surveyUser_id = surveyUserAlreadyExists.id;
      await SendMailService.execute(email, survey.title, variables, npsPath);
      return response.json(surveyUserAlreadyExists)
    }
    //Cria uma pesquisa
    const surveyUserCreated = surveysUsersRepository.create({
      user_id: user.id,
      survey_id
    })
    await surveysUsersRepository.save(surveyUserCreated);
    //Enviar o e-mail para o usuário
    variables.surveyUser_id = surveyUserCreated.id;
    await SendMailService.execute(email, survey.title, variables, npsPath);
    return response.json(surveyUserCreated);
  }
}

export { SendMailController }

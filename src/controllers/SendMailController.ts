import { getCustomRepository } from "typeorm";
import SurveysRepository from "../repositories/SurveysRepository";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";
import UsersRepository from "../repositories/UsersRepository";
import { Request, Response } from 'express';
import SendMailService from "../services/SendMailService";
import { resolve } from 'path';


class SendMailController {
  async execute(request: Request, response: Response) {
    const { email, survey_id } = request.body;

    const usersRepository = getCustomRepository(UsersRepository);
    const surveysRepository = getCustomRepository(SurveysRepository);
    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

    const user = await usersRepository.findOne({ email });

    if(!user) {
      return response.status(400).json({
        error: "User does not exist",
      });
    }

    const survey = await surveysRepository.findOne({ id: survey_id })
    if(!survey) {
      return response.status(400).json({
        error: "Survey does not exist"
      })
    }

    const surveyUserAlreadyExists = await surveysUsersRepository.findOne({
      where: [
        { user_id: user.id },
        { value: null}
      ],
      relations: ["user", "survey"]
    });

    const npsPath = resolve(__dirname, "..", "views", "emails", "npsMail.hbs");

    const variables = {
      name: user.name,
      title: survey.title,
      description: survey.description,
      user_id: user.id,
      link: process.env.URL_MAIL
    }

    if (surveyUserAlreadyExists) {
      await SendMailService.execute(email, survey.title, variables, npsPath);
      return response.json(surveyUserAlreadyExists)
    } else {
      //Cria uma resposta para aquela pesquisa
      const surveyUser = surveysUsersRepository.create({
        user_id: user.id,
        survey_id
      })
      await surveysUsersRepository.save(surveyUser);
      //Enviar o e-mail para o usuário
      await SendMailService.execute(email, survey.title, variables, npsPath);
      return response.json(surveyUser);
    }
  }
}

export { SendMailController }

import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { SurveyController } from '../controllers/SurveyController';
import { SendMailController } from '../controllers/SendMailController';
import { AnswerController } from '../controllers/AnswerController';
import { NpsController } from '../controllers/NpsController';

const routes = Router();

routes.get('/health', (_, response) => response.json({
  message: 'UP',
}));

const userController = new UserController();
const surveyController = new SurveyController();
const sendMailController = new SendMailController();
const answerController = new AnswerController();
const npsController = new NpsController();

routes.get("/answers/:value", answerController.execute);

routes.get("/nps/:survey_id", npsController.execute);

routes.post('/sendMail', sendMailController.execute);

routes.get('/surveys', surveyController.show);
routes.post('/surveys', surveyController.create);

routes.post('/users', userController.create);

export default routes;

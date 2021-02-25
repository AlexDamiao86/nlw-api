import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { SurveyController } from '../controllers/SurveyController';
import { SendMailController } from '../controllers/SendMailController';

const routes = Router();

routes.get('/health', (_, response) => response.json({
  message: 'UP',
}));

const userController = new UserController();
const surveyController = new SurveyController();
const sendMailController = new SendMailController();

routes.post('/sendMail', sendMailController.execute);

routes.get('/surveys', surveyController.show);
routes.post('/surveys', surveyController.create);

routes.post('/users', userController.create);

export default routes;

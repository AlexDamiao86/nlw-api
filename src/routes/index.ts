import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { SurveyController } from '../controllers/SurveyController';

const routes = Router();

const userController = new UserController();
const surveyController = new SurveyController();

routes.post('/users', userController.create);
routes.post('/surveys', surveyController.create);

routes.get('/health', (_, response) => response.json({
  message: 'UP',
}));
routes.get('/surveys', surveyController.show);

export default routes;

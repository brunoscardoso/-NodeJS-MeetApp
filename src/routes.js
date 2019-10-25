import { Router } from 'express';

import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import MeetupController from './app/controllers/MeetupController';
import OrganizingController from './app/controllers/OrganizingController';
import SessionController from './app/controllers/SessionController';
import SubscriptionController from './app/controllers/SubscriptionController';
import FileController from './app/controllers/FileController';

import {
  validateMeetupStore,
  validateMeetupUpdate,
} from './app/validators/Meetup';

import { validateUserStore, validateUserUpdate } from './app/validators/User';
import { validateSessionStore } from './app/validators/Session';

import authMiddware from './app/middwares/auth';

const routes = new Router();
const upload = multer(multerConfig);

routes.get('/', (_, res) => res.send('MeetApp'));
routes.post('/session', validateSessionStore, SessionController.store);
routes.post('/users', validateUserStore, UserController.store);

routes.use(authMiddware);

routes.put('/users', validateUserUpdate, UserController.update);
routes.post('/files', upload.single('file'), FileController.store);

routes
  .route('/meetups')
  .get(MeetupController.index)
  .post(validateMeetupStore, MeetupController.store);

routes
  .route('/meetups/:id')
  .put(validateMeetupUpdate, MeetupController.update)
  .delete(MeetupController.delete);

routes.get('/organizing', OrganizingController.index);
routes.get('/subscriptions', SubscriptionController.index);

routes
  .route('/meetups/:meetupId/subscribe')
  .post(SubscriptionController.store)
  .delete(SubscriptionController.delete);

export default routes;

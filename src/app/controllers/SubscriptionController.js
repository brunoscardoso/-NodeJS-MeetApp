import { Op } from 'sequelize';

import File from '../models/File';
import Meetup from '../models/Meetup';
import Subscription from '../models/Subscription';

import CreateSubscriptionService from '../services/CreateSubscriptionService';
import User from '../models/User';

class SubscriptionController {
  async index(req, res) {
    const { page = 1 } = req.query;
    const subcriptions = await Subscription.findAll({
      where: { user_id: req.userId },
      limit: 2,
      offset: (page - 1) * 2,
      attributes: ['id'],
      include: [
        {
          model: Meetup,
          required: true,
          where: {
            date: { [Op.gt]: new Date() },
          },
          include: [
            {
              model: File,
              as: 'file',
              attributes: ['id', 'path', 'url'],
            },
            {
              model: User,
              as: 'owner',
              attributes: ['id', 'name', 'email'],
            },
          ],
        },
      ],
      order: [[Meetup, 'date']],
    });

    return res.json(subcriptions);
  }

  async store(req, res) {
    const subscription = await CreateSubscriptionService.run({
      user_id: req.userId,
      meetup_id: req.params.meetupId,
    });
    return res.json(subscription);
  }

  async delete(req, res) {
    const subscription = await Subscription.findOne({
      where: {
        user_id: req.userId,
        meetup_id: req.params.meetupId,
      },
    });

    if (subscription) subscription.destroy();
    return res.json();
  }
}

export default new SubscriptionController();

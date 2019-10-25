import { isBefore } from 'date-fns';

import User from '../models/User';
import File from '../models/File';
import Meetup from '../models/Meetup';
import Subscription from '../models/Subscription';

import SubscriptionMail from '../jobs/SubscriptionMail';
import Queue from '../../lib/Queue';

class SubscriptionError extends Error {
  constructor(status, ...args) {
    super(...args);
    this.status = status;
  }
}

class CreateSubscriptionService {
  async run({ user_id, meetup_id }) {
    const meetup = await Meetup.findByPk(meetup_id, {
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
    });

    if (!meetup) {
      throw new SubscriptionError(400, 'Meetup not found');
    }

    if (meetup.user_id === user_id) {
      throw new SubscriptionError(400, "You can't subscribe in your meetups");
    }

    if (isBefore(meetup.date, new Date())) {
      throw new SubscriptionError(400, "You can't subscribe to past meetups");
    }

    const checkDate = await Subscription.findOne({
      where: { user_id },
      include: {
        model: Meetup,
        where: { date: meetup.date },
        required: true,
      },
    });

    if (checkDate) {
      throw new SubscriptionError(
        400,
        "You can't subscribe in two meetings at the same time"
      );
    }

    const isSubscribler = await Subscription.findOne({
      where: {
        user_id,
        meetup_id: meetup.id,
      },
    });

    if (isSubscribler) {
      throw new SubscriptionError(400, 'You are already subscribe');
    }

    await Subscription.create({
      user_id,
      meetup_id: meetup.id,
    });

    await Queue.add(SubscriptionMail.key, { meetup });

    return meetup;
  }
}

export default new CreateSubscriptionService();

import Mail from '../../lib/Mail';

class SubscriptionMail {
  get key() {
    return 'SubscriptionMail';
  }

  async handle({ data }) {
    const { User } = data.meetup;
    await Mail.sendMail({
      to: `${User.name} <${User.email}>`,
      subject: 'Successfully Subscription',
      template: 'subscription',
      context: {
        name: User.name,
        title: data.meetup.title,
      },
    });
  }
}

export default new SubscriptionMail();

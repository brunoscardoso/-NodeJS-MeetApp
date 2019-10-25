import * as Yup from 'yup';

import validator from './validator';

export const validateSessionStore = (req, res, next) => {
  const schema = Yup.object().shape({
    email: Yup.string()
      .email()
      .required(),
    password: Yup.string().required(),
  });

  return validator(req, res, next, schema);
};

export default validateSessionStore;

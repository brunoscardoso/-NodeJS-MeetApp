import * as Yup from 'yup';

import validator from './validator';

export const validateMeetupStore = (req, res, next) => {
  const schema = Yup.object().shape({
    title: Yup.string().required(),
    file_id: Yup.number().required(),
    description: Yup.string().required(),
    location: Yup.string().required(),
    date: Yup.date().required(),
  });

  return validator(req, res, next, schema);
};

export const validateMeetupUpdate = (req, res, next) => {
  const schema = Yup.object().shape({
    title: Yup.string(),
    file_id: Yup.number(),
    description: Yup.string(),
    location: Yup.string(),
    date: Yup.date(),
  });

  return validator(req, res, next, schema);
};

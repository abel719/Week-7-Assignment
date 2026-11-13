const Joi = require('joi');

const validateTodoUpdate = (req, res, next) => {
  const schema = Joi.object({
    task: Joi.string().min(3).max(100),
    completed: Joi.boolean(),
  }).min(1);

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  next();
};

module.exports = validateTodoUpdate;
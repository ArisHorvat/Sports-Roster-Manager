import { body } from "express-validator";

const validPositions = ["QB", "RB", "WR", "TE", "OL", "DL", "LB", "DB", "ST"]

export const playerValidationRules = [
  body('name')
  .isString().withMessage('Name must be a string.')
  .notEmpty().withMessage('Name is required.'),
  
  body('number')
    .isInt({ min: 0, max: 99 }).withMessage('Number must be between 0 and 99.'),

  body('position')
    .isIn(validPositions).withMessage(`Position must be one of: ${validPositions.join(', ')}`),

  body('age')
    .isInt({ min: 18, max: 50 }).withMessage('Age must be between 18 and 50.'),

  body('experience')
    .isInt({ min: 0 }).withMessage('Experience must be a non-negative integer.')
    .custom((value, { req }) => {
      if (req.body.age && value > req.body.age) {
        throw new Error('Experience cannot exceed age.');
      }
      return true;
    }),

  body('height')
    .isFloat({ min: 0 }).withMessage('Height must be a positive number.'),

  body('weight')
    .isFloat({ min: 0 }).withMessage('Weight must be a positive number.'),
];


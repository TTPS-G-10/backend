import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator/src/validation-result";

const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  } else {
    next();
  }
};

export default validate;

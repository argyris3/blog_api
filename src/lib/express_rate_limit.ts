import { rateLimit } from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 60000, //1-minute time window for request limiting
  limit: 60, //allow a maximum of 60 requests per window per IP
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: {
    error: 'Polles requests,try again later',
  },
});

export default limiter;

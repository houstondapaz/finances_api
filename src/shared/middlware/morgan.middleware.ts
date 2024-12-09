import * as morgan from 'morgan';

export function MorganMiddleware() {
  return morgan('tiny');
}

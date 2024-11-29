import { createParamDecorator, ExecutionContext } from '@nestjs/common';

const getCurrentUserByContext = (context: ExecutionContext): LoggedUser =>
  context.switchToHttp().getRequest().user as LoggedUser;

export interface LoggedUser {
  id: string;
  email?: string;
  name?: string;
  thumbURL?: string;
}

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) =>
    getCurrentUserByContext(context),
);

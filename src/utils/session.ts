import { ISessionUser } from 'src/types';

export const setSession = (
  request: Express.Request,
  key: string,
  value: string,
) => {
  if (!request?.session) {
    request['session'] = { [key]: value } as any;
  } else {
    request.session[key] = value;
  }
};

export const getSession = (request: Express.Request, key: string) => {
  return request?.session ? request.session[key] : null;
};

export const setSessionUser = (
  request: Express.Request,
  value: ISessionUser,
) => {
  if (!request?.session) {
    request['session'] = { user: JSON.stringify(value) } as any;
  } else {
    request.session['user'] = JSON.stringify(value);
  }
};

export const getSessionUser = (request: Express.Request) => {
  const data = request?.session ? request.session['user'] : null;
  return data ? JSON.parse(data) : null;
};

import {  USER_NOT_FOUND } from '../../res/Errors';

export class LoginError extends Error {
  constructor() {
    super();
    this.message = USER_NOT_FOUND;
  }
}
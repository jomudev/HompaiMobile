import {  USER_NOT_FOUND } from '../../res/Errors';

export class LoginError extends Error {
  constructor() {
    this.name = USER_NOT_FOUND;
  }
}
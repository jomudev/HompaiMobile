import {  AI_NETWORK_ERROR } from '../../res/Errors';

export class AINetworkError extends Error {
  constructor() {
    super();
    this.message = AI_NETWORK_ERROR;
  }
}
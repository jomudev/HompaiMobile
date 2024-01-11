import React from 'react';
import Storage from '../../modules/Storage';
const storage = Storage.getInstance();

const RemindersAPI = {
  async getReminders () {
    const reminders = await storage.get('reminders') || [];
    return reminders;
  },

  async setReminders (reminders) {
    await storage.store('reminders', reminders);
  },
};

export default RemindersAPI;
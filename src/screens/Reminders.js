import React, { useState, useEffect } from 'react';
import {
  View,
} from '../components/UI';
import RemindersAPI from '../apis/Reminders';
import { RemindersList } from '../components/RemindersComponents';

const useReminders = () => {
  const [reminders, setReminders] = useState([]);

  useEffect(() => {
    RemindersAPI.getReminders().then(setReminders);
  }, []);

  const clearReminders = () => setReminders([]);

  const handleSetReminders = (reminders) => {
    setReminders(reminders);
    RemindersAPI.setReminders(reminders);
  }

  const addReminder = (reminder) => {
    const prevReminders = reminders;
    const newReminders = prevReminders.push(reminder);
    handleSetReminders(newReminders);
  }

  const removeReminder = (reminderId) => {
    const prevReminders = reminders;
    const newReminders = prevReminders.filter((reminder) => reminder.id !== reminderId);
    handleSetReminders(newReminders);
  }

  const modifyReminder = (modifiedReminder) => {
    const prevReminders = reminders;
    const newReminders = prevReminders
      .map((reminder) => 
        reminder.id === modifiedReminder.id 
        ? modifiedReminder 
        : reminder
      );
    handleSetReminders(newReminders);
  }

  return {
    reminders,
    addReminder, 
    removeReminder,
    modifyReminder,
    clearReminders,
  }

}

export default function Reminders() {
  const { reminders, addReminder, removeReminder, clearReminders } = useReminders();
  return (
    <View>
      <RemindersList 
        reminders={[{ id: Math.random().toString(12).substring(0), title: 'Título del reminder', description: 'Sunt mollit ex anim exercitation sunt do ut. Anim sit labore eiusmod anim officia ad. Nostrud ea commodo incididunt sunt qui. Mollit minim quis esse duis eu labore incididunt culpa ea commodo non excepteur adipisicing. Mollit laboris ipsum culpa officia elit ea mollit ut dolore commodo ullamco. \nMagna enim pariatur et reprehenderit amet aliquip culpa mollit amet et. Irure non cupidatat anim Lorem tempor velit. Sint magna duis fugiat commodo occaecat labore veniam eiusmod officia. Sit id anim magna elit enim. Esse cillum sint tempor duis. Incididunt aliquip fugiat esse veniam tempor consectetur ut sint aliqua. Cupidatat ad veniam do officia aliqua laboris occaecat pariatur aute elit elit.' }]}
        actions={[
          {
            value: '➕ Añadir',
            action: addReminder,
          },
          {
            value: '🧹 Vaciar',
            action: clearReminders,
          }
        ]}
      />
    </View>
  )
}
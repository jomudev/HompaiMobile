import { Reminder } from "../RemindersComponents"


export const RemindersList = ({ 
  reminders,
  removeReminder,
  modifyReminder,
  actions,
}) => {
return (
  <FAB 
    actions={actions}
    data={reminders}
    initialNumToRender={5}
    renderItem={({ item }) => 
      <Reminder 
        title={item.title} 
        description={item.description} 
        leftPress={() => {modifyReminder}} 
        rightPress={() => {} } 
        />}
  />
)
}
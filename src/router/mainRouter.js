import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HOME, REMINDERS } from '../constants/screens';
import Home from '../screens/Home';
import Reminders from '../screens/Reminders';
import { StyleSheet } from 'react-native';

const Stack = createNativeStackNavigator();

export default function MainRouter () {
  const styles = StyleSheet.create({
    headerStyle: {
      paddingTop: 24,
    },
  });

  return (
    <Stack.Navigator>
      <Stack.Screen 
        name={HOME} 
        options={{
          headerStyle: styles.headerStyle,
          title: "📝 Crear Lista",
        }}
        component={Home} 
      />
      <Stack.Screen
        name={REMINDERS}
        options={{
          headerStyle: styles.headerStyle,
          title: "🔔 Recordatorios",
        }}
        component={Reminders}  
        />
    </Stack.Navigator>
  );
}
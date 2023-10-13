import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HOME } from '../constants/screens';
import Home from '../screens/Home';

const Stack = createNativeStackNavigator();

export default function MainRouter () {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name={HOME} 
        options={{
          headerStyle: {
            paddingTop: 24,
          },
          title: "Crear Lista",
        }}
        component={Home} 
        />
    </Stack.Navigator>
  );
}
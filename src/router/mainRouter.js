import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../screens/Home';

const Stack = createNativeStackNavigator();

export default function MainRouter () {
  return (
    <Stack.Navigator>
      <Stack.Screen name="List" component={Home} />
    </Stack.Navigator>
  );
}
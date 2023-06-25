import { createNativeStackNavigator } from '@react-navigation/native-stack';
import screens from '../../res/screens';
import Home from '../screens/Home';
import Articles from '../screens/Articles';
import Pantries from '../screens/Pantries';
import Pantry from '../screens/Pantry';
import Batch from '../screens/Batch';

const Stack = createNativeStackNavigator();

export default function MainRouter () {
  return (
    <Stack.Navigator>
      <Stack.Screen name={screens.HOME} component={Home} />
      <Stack.Screen name={screens.ARTICLES} component={Articles} />
      <Stack.Screen name={screens.PANTRIES} component={Pantries} />
      <Stack.Screen name={screens.PANTRY} component={Pantry} />
      <Stack.Screen name={screens.BATCH} component={Batch} />
    </Stack.Navigator>
  );
}
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import screens from '../../res/screens';
import Home from '../screens/Home';
import Articles from '../screens/Articles';
import Pantries from '../screens/Pantries';
import Pantry from '../screens/Pantry';
import Batch from '../screens/Batch';
import Logout from '../screens/Logout';
import { HeaderRight, HeaderLeft } from '../components/HomeHeader';

const Stack = createNativeStackNavigator();

export default function MainRouter () {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name={screens.HOME} 
        options={{
          headerStyle: {
            paddingTop: 24,
          },
          title: "Crear Lista",
        }}
        component={Home} 
        />
      <Stack.Screen 
        name={screens.ARTICLES} 
        component={Articles} 
        />
      <Stack.Screen name={screens.PANTRIES} options={{ title: "Despensas" }} component={Pantries} />
      <Stack.Screen name={screens.PANTRY} component={Pantry} />
      <Stack.Screen name={screens.BATCH} component={Batch} />
      <Stack.Screen name={screens.LOGOUT} component={Logout} />
    </Stack.Navigator>
  );
}
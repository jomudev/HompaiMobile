import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Image, View } from 'react-native';
import { PressableLink, Text } from '../components/UI';
import screens from '../../res/screens';
import Home from '../screens/Home';
import Articles from '../screens/Articles';
import Pantries from '../screens/Pantries';
import Pantry from '../screens/Pantry';
import Batch from '../screens/Batch';
import Logout from '../screens/Logout';
import Auth from '../../modules/Auth/';
const auth = Auth.getInstance();

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
          headerLeft: () => (
            <PressableLink to={{ screen: screens.LOGOUT }} style={{ marginRight: 16 }}>
                <Image source={{ uri: auth.currentUser.photoURL }} width={32} height={32} />
            </PressableLink>
          ),
          headerRight: () => (
            <>
            <PressableLink to={{ screen: screens.PANTRIES }}>
              <Text size="l">🍚</Text>
            </PressableLink>
            </>
          )
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
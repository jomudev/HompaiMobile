import { Image } from 'react-native';
import screens from '../../res/screens';
import { PressableLink, Text } from '../components/UI';
import Auth from '../../modules/Auth';
const auth = Auth.getInstance();

export const HeaderRight = () => (
  <PressableLink to={{ screen: screens.PANTRIES }}>
    <Text size="l">🍚</Text>
  </PressableLink>
);

export const HeaderLeft = () => (
  <PressableLink to={{ screen: screens.LOGOUT }} style={{ marginRight: 16 }}>
      <Image source={{ uri: auth.currentUser.photoURL }} width={32} height={32} />
  </PressableLink>
);
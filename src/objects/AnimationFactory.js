import { Animated } from 'react-native';

export const AnimationFactory = {
  SimpleAnimation: (initialValue) => new Animated.Value(initialValue || 0),
}
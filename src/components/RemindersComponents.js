import {
  Text,
  Col,
  Heading,
  SwipeableListItem,
  ListFAB
} from './UI';
import { StyleSheet } from 'react-native';
import sizes from '../../res/sizes';
import colors from '../../res/colors';

export const Reminder = ({ title, description, leftPress, rightPress }) => {

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.background,
      padding: sizes.m,
      borderBottomWidth: 1,
      borderBottomColor: colors.card,
    },
    content: {
      textAlign: 'justify',
      width: '100%',
    }
  });

  return (
    <SwipeableListItem 
      style={styles.container} 
      leftPress={leftPress} 
      leftColor={colors.card}
      rightPress={rightPress}
      rightColor={colors.danger}
      >
      <Col>
        <Heading size="l">{ title }</Heading>
        <Text style={styles.content} >{ description }</Text>
      </Col>
    </SwipeableListItem>
  )
};

export const RemindersList = ({ 
    reminders,
    removeReminder,
    modifyReminder,
    actions,
  }) => {
  return (
    <ListFAB
      actions={actions}
      data={reminders}
      renderItem={({ item }) => <Text size="xl">{item.title}</Text>}
    />
  )
}
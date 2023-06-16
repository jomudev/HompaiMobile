import { forwardRef, useRef, useState, useImperativeHandle } from 'react';
import { 
  View as RNView, 
  Text as RNText, 
  Pressable, 
  StyleSheet, 
  TextInput, 
  FlatList, 
  KeyboardAvoidingView,
  ActivityIndicator,
 } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import colors from '../../res/colors';
import { ListItem } from '@rneui/themed';

export const SwipeableButton = (props) => {
  return (
    <Pressable {...props} style={{...styles.swipeableButton, backgroundColor: props.color, borderRadius: 16 }}>
      { props.children }
    </Pressable>
  );
}

export const LazyLoading = (props) => {
  return (
    <View style={styles.lazyLoadingContainer}>
      <ActivityIndicator color={colors.danger} size={props.size}  />
    </View>
  )
}

export const SwipeableListItem = (props) => {
  return (
    <ListItem.Swipeable
      style={{height: 60, ...props.style}}
      containerStyle={{padding: 0, alignItems: 'center', justifyContent: 'center', height: '100%'}}
      rightContent={(reset) => <SwipeableButton color={props.rightColor} onPress={() => {
          reset();
          props?.rightPress();
        }}>
          {props.rightContent}
        </SwipeableButton>
      }
      leftContent={(reset) => <SwipeableButton color={props.leftColor} onPress={() => {
          reset();
          props?.leftPress();
        }}>
          {props.leftContent}
        </SwipeableButton>
      }>
      <ListItem.Content>
        { props.children }
      </ListItem.Content>
    </ListItem.Swipeable>
  );
}

export const View = (props) => {
  const alignments =  {
      true: { 
        alignItems: 'center', 
        justifyContent: 'center' 
      }, 
      vertical: { 
        justifyContent: 'center' 
      },
      horizontal: {
        alignItems: 'center'
      },
      false: {},
    }
    const Component = (elementProps) => props.isPressable ? 
      <Pressable {...elementProps}>{elementProps.children}</Pressable> :
      <RNView {...elementProps}>{elementProps.children}</RNView>
  
  return (
    <Component {...props} style={{
      ...props.style,
      ...alignments[props.centered],
      }}>
      { props.children }
    </Component>
    )
}

export const Layout = (props) => {
  return (
    <View style={{...styles.layoutView }} centered={props.centered}>
      <StatusBar style='auto' />
      { props.children }
    </View>
  );
};

export const Row = (props) => {
  return (
    <View centered={props.centeredAll || "horizontal"} style={{ flexDirection: 'row', ...props.style, ...props.flex && { flex: props.flex } }}>
      { props.children }
    </View>
  );
}

export const Col = (props) => {
  return (
    <View centered={props.centeredAll || "vertical"} style={{ flexDirection: 'column', ...props.style, ...props.flex && { flex: props.flex }  }}>
      { props.children }
    </View>
  );
}

export const Container = (props)  => {
  return (
    <View style={{
      ...props.fluid ? styles.containerFluid : styles.container, 
      ...props.style, 
      ...props.flex && { flex: props.flex }
      }} centered={props.centered}>
      { props.children }
    </View>
  );
}

export const Button = (props) => {
  return (
    <Pressable style={{...styles.button}} onPress={props.onPress} >
      <Text style={{...styles.buttonText, ...props.textStyle}} color={props.textColor}>
        { props.children }
      </Text>
    </Pressable>
  );
}

export const textSizes = (size) => {
  const headingSizes = {
    xs: 8,
    s: 12,
    m: 16,
    l: 18,
    xl: 24,
  };

  return headingSizes[size] || 12;
}

export const Text = (props) => {
  return (
    <RNText style={{ 
      ...props.centered ? { textAlign: 'center' } : {},
      ...props.centeredVertical ? { textAlignVertical: 'center' } : {},
        color: props.muted ? colors.textMuted : (colors[props.color] || props.color) || colors.text, 
      ...props.bold ? { fontWeight: 'bold' } : {},
        }} 
      {...props} >
      { props.children }
    </RNText>
  );
}

export const Heading = (props) => {
  return (
    <Text style={{...styles.heading, fontSize: textSizes(props.size) || textSizes("xl") }} {...props} >
      { props.children }
    </Text>
  );
}

export const TextBox = forwardRef((props, ref) => {
  const [value, setValue] = useState("");
  let inputRef = useRef(null);

  useImperativeHandle(ref, () => ({
    getValue: () => {
      let float = fixed(value);
      float = isNaN(float) ? fixed(0) : float;
      let int = parseInt(value, 10);
      int = isNaN(int) ? parseInt(0, 10) : int;
      let resultTypes = {
        int,
        float,
      }
      return resultTypes[props.valueType] || value;
    },
    clear: () => inputRef.current.clear(),
    focus: () => inputRef.current.focus(),
  }));

  return (
    <KeyboardAvoidingView style={styles.inputTextContainer}>
      <TextInput
        {...props}
        onChangeText={setValue}
        ref={inputRef}
        defaultValue={props.defaultValue}
        value={value}
        style={{...styles.inputText, fontSize: props.textSize || 12}}
        />
    </KeyboardAvoidingView>
  )
})

export const DataList = (props) => {
  return <FlatList 
    data={props.data}
    style={styles.flatList}
    contentContainerStyle={styles.flatListContainer}
    keyExtractor={(item) => item.id}
    renderItem={props.render}
    ListFooterComponent={props.footer}
  />
}

export const styles = StyleSheet.create({
  layoutView: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  heading: {
    fontWeight: 'bold',
  },
  container: {
    width: '100%',
    paddingVertical: 24,
  },
  containerFluid: {
    flex: 1,
  },
  button: {
    paddingVertical: 18,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    elevation: 16,
    borderRadius: 16,
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 14,
    color: colors.text,
  },
  inputTextContainer: {
    borderRadius: 16,
    backgroundColor: colors.secondary,
  },
  inputText: {
    width: '90%',
    textAlign: 'center',
    paddingVertical: 16,
  },
  flatList: {
    width: '100%',
  },
  flatListContainer: {
    width: '100%',
    gap: 16,
  },
  swipeableButton: {
    bordeRadius: 16,
    alignItems:'center',
    justifyContent: 'center',
    minHeight: '100%',
  },
  lazyLoadingContainer: {
    padding: 18,
    borderRadius: 16,
    elevation: 16,
    margin: 24,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  }
});
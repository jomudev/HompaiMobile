import { forwardRef, useRef, useState, useImperativeHandle, useEffect } from 'react';
import { 
  View as RNView, 
  Text as RNText, 
  Pressable, 
  StyleSheet,
  TextInput, 
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  Animated,
  SectionList,
  VirtualizedList,
 } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import colors from '../../res/colors';
import { ListItem } from '@rneui/themed';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import {Picker} from '@react-native-picker/picker';
import { useLinkProps } from '@react-navigation/native';
import sizes from '../../res/sizes';
import { Dimensions } from 'react-native';
import { AnimationFactory } from '../objects/AnimationFactory';
import { getScrollDirection } from '../../res/utils';

const { width, height } = Dimensions.get("window");
const windowWidth = width;

export const ListPicker = forwardRef((props, ref) => {
  const [selectedValue, setSelectedValue] = useState(props.data[0]);
  const pickerRef = useRef();

  useImperativeHandle(ref, () => ({
    open: () => pickerRef.current.focus(),
    close: () => pickerRef.current.blur(),
  }));

  return (
    <Row isPressable style={{width: '100%', ...props.style, gap: 16 }} onPress={ () => pickerRef.current.focus() } >
      <Picker
        ref={pickerRef}
        style={{ flex: 1 }}
        selectedValue={selectedValue}
        onValueChange={(value) => {
          props?.onChange(value);
          setSelectedValue(value);
        }}
      >
        {
          props.data.map( (item) => <Picker.Item key={JSON.stringify(item)} label={item} value={item} /> )
        }
      </Picker>
      {
        <View flex={1}>{props.children}</View>
      }
    </Row>)
});

export const DateTimePicker = forwardRef((props, ref) => {
  const [date, setDate] = useState(null);
  function onChange(event, selectedDate) {
    setDate(selectedDate);
    props?.onChange(selectedDate);
  }

  function showMode(mode) {
    DateTimePickerAndroid.open({
      mode,
      onChange,
      minimumDate: mode === "date" ? new Date(Date.now()) : null,
      value: new Date(Date.now() + 1000 * 60 * 60 * 24 ),
    });
  }

  useImperativeHandle(ref, () => ({
    getValue: () => date,
  }));


  return (
    <Pressable style={{...styles.button, ...props.style}} onPress={() => showMode(props.mode)}>
      <Text>{ props.label && props.label + ": " } { 
        props.initialValue 
        ? localeDate(props.initialValue).dateString
        : date 
          ? localeDate(date).dateString 
          : "no asignada"
         }</Text>
    </Pressable>
  )
})

export const SwipeableButton = (props) => {
  return (
    <Pressable {...props} style={{...styles.swipeableButton, backgroundColor: props.color}}>
      { props.children }
    </Pressable>
  );
}

export const LazyLoading = (props) => {
  return <ActivityIndicator color={colors.danger} size="small"  />
}

export const PressableLink = ({to, action, children, ...rest}) => {
  const { onPress, ...props} = useLinkProps({ to, action });

  return (
    <Pressable {...props} {...rest} onPress={onPress}>
      { children }
    </Pressable>
  )
}

export const SwipeableListItem = ({ 
  style, 
  containerStyle, 
  rightPress, 
  rightContent,
  rightColor,
  leftPress, 
  leftContent, 
  leftColor,
  ...props }) => {
  const styles = StyleSheet.create({
    main: { },
    container: {
      padding: 0,
      alignItems: 'center',
      justifyContent: 'center', 
      height: 80,
    }
  });
  return (
    <ListItem.Swipeable
      {...{
        style:[styles.main, style],
        containerStyle: [ styles.container, containerStyle],
        ...props
      }}
      rightContent={(reset) => <SwipeableButton color={rightColor} onPress={() => {
          reset();
          rightPress();
        }}>
          { rightContent }
        </SwipeableButton>
      }
      leftContent={(reset) => <SwipeableButton color={leftColor} onPress={() => {
          reset();
          leftPress();
        }}>
          { leftContent }
        </SwipeableButton>
      }>
      <ListItem.Content style={{flex:1}}>
        { props.children }
      </ListItem.Content>
    </ListItem.Swipeable>
  );
}

export const View = ({style, isPressable, scrollable, ...props}) => {
  const alignments =  {
      true: {
        alignItems: 'center',
        justifyContent: 'center' 
      }, 
      vertical: { 
        alignItems: 'center'
      },
      horizontal: {
        justifyContent: 'center'
      },
      false: {},
    }
    var Component = RNView;
    if (isPressable) {
      Component = Pressable;
    } 
    if (scrollable) {
      Component = ScrollView;
    }
  return (
    <Component {...props} style={[
        {
          overflow: 'visible', 
          width: '100%'
        }, 
        !props.scrollable && alignments[props.centered],
        style,
        ]}>
      { props.children }
    </Component>
    )
}

export const Layout = (props) => {
  const styles = StyleSheet.create({
    layoutView: {
      height: '100%',
      width: '100%',
      flex: 1,
      justifyContent: 'center',
      backgroundColor: colors.background,
    },

  });
  return (
    <View style={styles.layoutView} centered={props.centered}>
      <StatusBar style='dark' />
      { props.children }
    </View>
  );
};

export const MinimalTextBox = forwardRef((props, ref) => <TextInput {...props} style={styles.minimalTextBox} ref={ref} />)

export const Row = ({ flex, style, centeredAll, onPress, isPressable, gap, ...props}) => {
  const styles = StyleSheet.create({
    row: {
      flexDirection: 'row',
      gap,
      flex,
    }
  });
  return (
    <View {
      ...{
        isPressable,
        onPress,
        centered: centeredAll || "horizontal",
        style: [ styles.row, style ],
      }
    }>
      { props.children }
    </View>
  );
}

export const Col = ({
  style, 
  isPressable, 
  onPress, 
  flex, 
  centeredAll,
  ...props}) => {
    const styles = StyleSheet.create({
      container: {
        flexDirection: 'column',
        flex,
      }
    });
  return (
    <View {
      ...{
        isPressable, 
        onPress, 
        centered: centeredAll || "vertical",
        style: [styles.container, style],
        }
      }>
      { props.children }
    </View>
  );
}

export const Container = (props)  => {
  return (
    <View scrollable={props.scrollable} style={{
      ...props.fluid ? styles.containerFluid : styles.container, 
      ...props.style, 
      ...props.flex && { flex: props.flex }
      }} centered={props.centered}>
      { props.children }
    </View>
  );
}

export const Button = ({onPress, ...props}) => {
  return (
    <Pressable style={{
      ...styles.button, 
      ...props.style,
      ...props.muted && { backgroundColor: 'none' },
      ...props.width && { width: props.width }, 
      }} onPress={onPress} >
      <Text {...props.textProps} style={{...styles.buttonText, ...props.textProps?.style}} color={props.textColor}>
        { props.children }
      </Text>
    </Pressable>
  );
}

export const LazyButton = ({ onPress, textStyle, textColor, children, style}) => {
  const [loading, setLoading] = useState(false);

  const handlePress = async () => {
    setLoading(true);
    await onPress()
    setLoading(false);
  }

  return (
    <Pressable style={{...styles.button, ...style}} onPress={handlePress}>
      {
        loading ? 
          <LazyLoading />
          : (
            <Text style={{...styles.buttonText, ...textStyle}} color={textColor}>
              { children }
            </Text>
          )
      }
    </Pressable>
  )
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

export const Text = ({ muted, align, style, color, numberOfLines = 1, centered, centeredVertical, bold, size, ...props }) => {
  const styles = StyleSheet.create({
    main: {
      textAlign: align || (centered && 'center'),
      textAlignVertical: centeredVertical && 'center',
      color: muted ? colors.textMuted : (colors[color] || color) || colors.text,
      fontWeight: bold && 'bold',
      fontSize: textSizes(size),
    }
  });
  return (
    <RNText
      {...{
        style: [styles.main, style], 
        numberOfLines,
        ...props
      }}
       >
      { props.children }
    </RNText>
  );
}

export const Heading = ({ centered, style, flex, size , ...props}) => {
  return (
    <Text 
      style={[ 
        centered ? { textAlign: 'center'} : null, 
        style,
        styles.heading,
        flex && { flex },
        { fontSize: textSizes(size) || textSizes("xl") },
        ]} 
        {...props}
         >
      { props.children }
    </Text>
  );
}

export const TextBox = forwardRef(function TextBox({
  placeholder,
  selectTextOnFocus,
  onChangeText,
  keyboardType,
  onSubmitEditing,
  defaultValue,
  ...props
}, ref) {
  const value = useRef(props.value);
  const inputRef = useRef();
  const createHandle = () => ({
    getValue: () => value.current,
    focus: () => inputRef.current.focus(),
    clear: () => inputRef.current.clear(),
    setValue: (value) => (inputRef.current.value = value),
  });
  useImperativeHandle(ref, createHandle, []);
  
  function handleOnChangeText(text) {
    onChangeText && onChangeText(text); 
    value.current = text;
  }

  const styles = StyleSheet.create({
    main: {
      borderColor: colors.card,
      backgroundColor: colors.secondary,
      padding: sizes.m,
      fontSize: 12,
      width: '100%',
      borderRadius: sizes.s
    }
  });

  return (
    <TextInput 
      selectTextOnFocus={selectTextOnFocus}
      ref={inputRef} 
      placeholderTextColor={colors.textMuted}
      defaultValue={defaultValue}
      placeholder={placeholder}
      keyboardType={keyboardType}
      onSubmitEditing={onSubmitEditing}
      onChangeText={handleOnChangeText} 
      style={[styles.main, props.style]} 
      />
    )
});

export const SectionsList = (props) => {
  return (
    <FlatList 
      style={{ paddingTop: sizes.m }}
      ListHeaderComponent={props?.header}
      data={props.sections}
      renderItem={({item, index}) => <View key={index} style={{width: '100%'}}>{item}</View>}
      ListFooterComponent={props?.footer}
    />
    )
}

const toggleFAB = (ref) => {
  let prevVertical = null;
  return (e) => {
    const dir = getScrollDirection(e.nativeEvent);
    if (prevVertical === dir.vertical) {
      return;
    }
    dir.vertical === 'up' && ref.current.show();
    dir.vertical === 'down' && ref.current.hide();
    prevVertical = dir.vertical;
  };
}

export const ListFAB = ({
  actions,
  data,
  renderItem,
  ...props
}) => {
  const FABref = useRef();
  return (
    <>
      <VirtualizedList 
        {...{
          data,
          renderItem,
          keyExtractor: (item) => item.id + data.length + Math.random().toString(12).substring(0),
          initialNumToRender: 5,
          getItemCount: (data) => data.length,
          getItem: (data, index) => data,
        }}
        removeClippedSubviews
        style={styles.FAB}
        onScroll={toggleFAB(FABref)}
      />
      <FABactions ref={FABref} actions={actions} />
    </>
  );
}

export const SectionedFAB = ({ 
  actions,
  sections, 
  data,
  initialNumToRender, 
  keyExtractor, 
  renderItem, 
  renderSectionHeader,
  ...props }) => {
    let FABref = useRef();

    const styles = StyleSheet.create({
      FABContentContainer: {
        overflow: 'visible',
        flex: 1,
      }
    });

    return (
      <View style={styles.FABContentContainer}> 
        <SectionList
          {...{
            sections,
            renderItem,
            initialNumToRender,
            keyExtractor,
            renderSectionHeader,
            ...props,
          }}
          removeClippedSubviews
          style={styles.FAB}
          onScroll={toggleFAB(FABref)}
          />
          <FABactions ref={FABref} actions={actions} />
      </View>
    )
}

export const FABactions = forwardRef( function FABactions({actions}, ref) {
  return (
    <FABContainer ref={ref} >
      { actions.map(({ value, action }) => <FABButton key={value} action={action} value={value} />) }
    </FABContainer>
  )
});

useAnimation = (effect, { toValue = 500, duration = 300, ...effectOptions }) => {
  const animation = useRef(AnimationFactory.SimpleAnimation()).current;

  const animateTo = (newValue) => {
    Animated[effect](animation, {
      toValue: newValue,
      duration: duration,
      useNativeDriver: true,
    }).start();
  }

  useEffect(() => {
    Animated[effect](animation, {
      toValue,
      duration,
      useNativeDriver: true,
      ...effectOptions
    });
  }, [animation]);
  return { animationValue: animation, animateTo };
};

export const FABContainer = forwardRef(({ children }, ref) => {
  const { animationValue, animateTo } = useAnimation("timing", { toValue: 300 });
  
  useImperativeHandle(ref, () => ({
    show: () => { animateTo(0) },
    hide: () => { animateTo(300) },
  }));

  return (
    <Animated.View style={[styles.FABContainer, { transform: [{ translateY: animationValue }]}]}>
      { children }
    </Animated.View>
  )
});

export const FABButton = ({action, value}) => {
  return (
    <Pressable onPress={action} style={styles.FABButton}>
      <Text>{ value }</Text>
    </Pressable>
  )
}

export const DataList = (props) => {
  return (
    <FlatList 
      initialNumToRender={10}
      ListHeaderComponent={props?.header}
      data={props.data}
      renderItem={({item, index}) => (
         <View style={{ width: '100%', paddingVertical: sizes.s, borderRadius: sizes.m }} key={Math.random() * 1e9}>
          { props.render({ item, index }) }
        </View>)}
      ListFooterComponent={props?.footer}
      />
  )
}

export const styles = StyleSheet.create({
  heading: {
    width: '100%',
    fontWeight: 'bold',
  },
  container: {
    width: '100%',
    paddingHorizontal: sizes.m,
    paddingVertical: sizes.xl,
  },
  containerFluid: {
    flex: 1,
  },
  FAB: {
    flex: 1,
  },
  FABContainer: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    maxWidth: windowWidth / 2,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    padding: sizes.s,
    justifyContent: 'center',
  },
  FABButton: {
    height: 60,
    paddingHorizontal: sizes.s,
    paddingVertical: sizes.m,
    borderRadius: sizes.m,
    elevation: sizes.s,
    backgroundColor: colors.primary,
    alignItems: 'center',
    marginVertical: sizes.s,
    justifyContent: 'center',
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    shadowOpacity: 0.01,
    borderRadius: sizes.m,
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 14,
    color: colors.text,
  },
  minimalTextBox: {
    height: '100%',
    maxHeight: 100,
    width: '100%',
    borderRadius: sizes.m,
    textAlign: 'center',
    backgroundColor: colors.secondary,
  },
  flatList: {
    width: '100%',
    borderRadius: sizes.m,
  },
  flatListContainer: {
    flex: 1,
    paddingHorizontal: sizes.m,
    paddingTop: sizes.m,
    borderRadius: sizes.m,
    gap: sizes.m,
  },
  swipeableButton: {
    alignItems:'center',
    justifyContent: 'center',
    minHeight: '100%',
  },
});
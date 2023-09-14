import { forwardRef, memo, useRef, useState, useImperativeHandle } from 'react';
import { 
  View as RNView, 
  Text as RNText, 
  Pressable, 
  StyleSheet,
  TextInput, 
  FlatList,
  ActivityIndicator,
  ScrollView,
 } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import colors from '../../res/colors';
import { ListItem } from '@rneui/themed';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import {Picker} from '@react-native-picker/picker';
import { useLinkProps } from '@react-navigation/native';
import sizes from '../../res/sizes';

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

export const SwipeableListItem = (props) => {
  return (
    <ListItem.Swipeable
      {...props}
      style={{borderRadius: sizes.m, ...props.style}}
      containerStyle={{padding: 0, alignItems: 'center', borderRadius: sizes.m, justifyContent: 'center', height: '100%', ...props.containerStyle}}
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
      <ListItem.Content style={{flex:1}}>
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
        alignItems: 'center'
      },
      horizontal: {
        justifyContent: 'center'
      },
      false: {},
    }
    var Component = RNView;
    if (props.isPressable) {
      Component = Pressable;
    } 
    if (props.scrollable) {
      Component = ScrollView;
    }
  return (
    <Component {...props} style={{
      overflow: 'visible',
      ...props.style,
      width: "100%",
      ...!props.scrollable && alignments[props.centered],
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

export const MinimalTextBox = forwardRef((props, ref) => <TextInput {...props} style={styles.minimalTextBox} ref={ref} />)

export const Row = (props) => {
  return (
    <View 
      isPressable={props.isPressable} 
      onPress={props.onPress} 
      centered={props.centeredAll || "horizontal"} 
      style={{ 
        flexDirection: 'row', 
        ...props.style, 
        ...props.flex && { flex: props.flex },
        ...props.gap && { gap: props.gap },
        }}>
      { props.children }
    </View>
  );
}

export const Col = (props) => {
  return (
    <View isPressable={props.isPressable} onPress={props.onPress} centered={props.centeredAll || "vertical"} style={{ flexDirection: 'column', ...props.style, ...props.flex && { flex: props.flex }  }}>
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

export const Button = (props) => {
  return (
    <Pressable style={{
      ...styles.button, 
      ...props.style,
      ...props.muted && { backgroundColor: 'none', elevation: 0 },
      ...props.width && { width: props.width }, 
      }} onPress={props.onPress} >
      <Text {...props.textProps} style={{...styles.buttonText, ...props.textProps?.style}} color={props.textColor}>
        { props.children }
      </Text>
    </Pressable>
  );
}

export const LazyButton = (props) => {
  const [loading, setLoading] = useState(false);

  const handlePress = async () => {
    setLoading(true);
    await props.onPress()
    setLoading(false);
  }

  return (
    <Pressable style={{...styles.button, ...props.style}} onPress={handlePress}>
      {
        loading ? 
          <LazyLoading />
          : (
            <Text style={{...styles.buttonText, ...props.textStyle}} color={props.textColor}>
              { props.children }
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

export const Text = (props) => {
  return (
    <RNText
      style={{ 
      ...props.centered ? { textAlign: 'center' } : null,
      ...props.centeredVertical ? { textAlignVertical: 'center' } : null,
        color: props.muted ? colors.textMuted : (colors[props.color] || props.color) || colors.text, 
      ...props.bold ? { fontWeight: 'bold' } : null,
      ...props.size && { fontSize: textSizes(props.size) }
        }} 
      {...props}
      numberOfLines={ props.numberOfLines || 1 }
       >
      { props.children }
    </RNText>
  );
}

export const Heading = (props) => {
  return (
    <Text 
      style={{
        ...props.centered ? { textAlign: 'center'} : null,
        ...styles.heading, 
        fontSize: textSizes(props.size) || textSizes("xl"), 
        ...props.style}} 
        {...props}
         >
      { props.children }
    </Text>
  );
}

export const TextBox = forwardRef((props, ref) => {
  const [value, setValue] = useState(undefined);
  let inputRef = useRef(null);
  useImperativeHandle(ref, () => {
    return ({
      getValue: () => value,
      clear: () => setValue(""),
      focus: () => inputRef.current.focus(),
      setValue: (value) => setValue(value),
  })});

  return (
      <TextInput
        {...props}
        defaultValue={props.defaultValue}
        onChangeText={setValue}
        ref={inputRef}
        value={value}
        style={{...styles.minimalTextBox, fontSize: props.textSize || 12, width: '100%'}}
        />
  )
})

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

export const FloatingMenu = (props) => {
  return (
    <View style={styles.floatingMenu}>{ props.children }</View>
  );
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
  layoutView: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
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
  floatingMenu: {
    backgroundColor: 'transparent',
    position: "absolute",
    alignItems: 'center',
    justifyContent: 'center',
    bottom: sizes.l,
    left: sizes.l,
  },
  floatingButton: {
    paddingVertical: sizes.l,
    paddingHorizontal: sizes.s,
    elevation: sizes.m,
    backgroundColor: colors.primary,
  },  
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    elevation: sizes.xl,
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
    borderRadius: sizes.m,
    alignItems:'center',
    justifyContent: 'center',
    minHeight: '100%',
  },
});
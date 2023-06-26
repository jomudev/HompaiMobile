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
  KeyboardAvoidingView,
 } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import colors from '../../res/colors';
import { ListItem } from '@rneui/themed';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import {Picker} from '@react-native-picker/picker';
import { useLinkProps } from '@react-navigation/native';
import sizes from '../../res/sizes';

export const ListPicker = forwardRef((props, ref) => {
  const [selectedValue, setSelectedValue] = useState();
  const pickerRef = useRef();

  useImperativeHandle(ref, () => ({
    getValue: () => selectedValue,
    open: () => pickerRef.current.focus(),
    close: () => pickerRef.current.blur(),
  }));

  return (
    <Row isPressable style={{width: '100%', ...props.style, gap: 16 }} onPress={ () => pickerRef.current.focus() } >
      <Picker
        ref={pickerRef}
        style={{ flex: 1 }}
        selectedValue={selectedValue}
        onValueChange={ (value) => {
          setSelectedValue(value);
          props?.onChange(value);
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
        justifyContent: 'center' 
      },
      horizontal: {
        alignItems: 'center'
      },
      false: {},
    }
    const Component = (elementProps) => props.isPressable ? 
      <Pressable {...elementProps}>{elementProps.children}</Pressable> 
      : <RNView {...elementProps}>{elementProps.children}</RNView>
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
    <Pressable style={{...styles.button, ...props.style}} onPress={props.onPress} >
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
      ...props.centered ? { textAlign: 'center' } : {},
      ...props.centeredVertical ? { textAlignVertical: 'center' } : {},
        color: props.muted ? colors.textMuted : (colors[props.color] || props.color) || colors.text, 
      ...props.bold ? { fontWeight: 'bold' } : {},
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
    <Text style={{...styles.heading, fontSize: textSizes(props.size) || textSizes("xl") }} {...props} >
      { props.children }
    </Text>
  );
}

export const TextBox = forwardRef((props, ref) => {
  const [value, setValue] = useState("");
  let inputRef = useRef(null);
  useImperativeHandle(ref, () => {
    return ({
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
  })});

  return (
      <TextInput
        {...props}
        onChangeText={setValue}
        ref={inputRef}
        value={value}
        style={{...styles.minimalTextBox, fontSize: props.textSize || 12}}
        />
  )
})

export const DataList = (props) => {

  return <View centered style={{ flex: 1, flexDirection: 'column', width: '100%' }}>
          <View>
            { props?.header }
          </View>
          <ScrollView contentContainerStyle={{ flex: 1, alignItems: 'center' }} style={{ width: '100%' }}>
            { props.data.map((item, index) => (
              <View style={{ width: '90%', paddingVertical: sizes.s, borderRadius: sizes.m }} key={item.id}>
                { props.render({ item, index }) }
              </View>
              ))}
          </ScrollView>
          <View>
            { props?.footer }
          </View>
        </View>

  return <FlatList 
    {...props}
    data={props.data}
    style={styles.flatList}
    contentContainerStyle={styles.flatListContainer}
    renderItem={props.render}
    ListHeaderComponent={props.header}
    ListFooterComponent={props.footer}
  />
}

export const styles = StyleSheet.create({
  layoutView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  heading: {
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
  button: {
    paddingVertical: 8,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    elevation: sizes.xl,
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
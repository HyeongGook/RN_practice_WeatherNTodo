import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { theme } from './colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Fontisto, MaterialCommunityIcons } from '@expo/vector-icons';

const ToDoScreen = () => {
  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const [toDos, setToDos] = useState({});
  const travel = () => setWorking(false); //travel 이면 working 값이 false
  const work = () => setWorking(true); //work 이면 working 값이 true
  const onChangeText = (payload) => setText(payload);
  
  const STORAGE_KEY = "@toDos";

  const saveToDos = async (toSave) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  };

  const loadToDos = async () => {
    const s = await AsyncStorage.getItem(STORAGE_KEY);
    s !== null ? setToDos(JSON.parse(s)) : null;
  };

  useEffect(() => {
    loadToDos();
  }, []);

  const addToDo = async () => {
    if(text === "") {
      return
    }
    const newToDos = {...toDos, [Date.now()]: {text, working}};
    setToDos(newToDos);
    await saveToDos(newToDos);
    setText("");
  };

  const changeToDo = async (key) => {
    const newToDos = {...toDos};
    if(newToDos[key].done){
      newToDos[key].done = false;
    }
    else {
      newToDos[key].done = true;
    }
    setToDos(newToDos);
    await saveToDos(newToDos);
  }

  const deleteToDo = (key) => {
    Alert.alert("Delete To Do", "Really?", [
      {text: "Cancel"}, 
      {text: "Sure", style: "destructive", 
        onPress : async () => {
        const newToDos = {...toDos};
        delete newToDos[key];
        setToDos(newToDos);
        await saveToDos(newToDos);
      }}
    ]);
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <TouchableOpacity activeOpacity={0.1} onPress={work}>
          <Text style={{...styles.btnText, color: working ? "white" : theme.gray}}>Work</Text>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.1} onPress={travel}>
          <Text style={{...styles.btnText, color: working ? theme.gray : "white"}}>Travel</Text>
        </TouchableOpacity>
      </View>
        <TextInput
          onSubmitEditing={addToDo}
          onChangeText={onChangeText}
          value={text}
          returnKeyType='done'
          placeholder={working ? "Add a To Do" : "Where do you want to go?"} 
          style={styles.input} />
        <ScrollView>
          {Object.keys(toDos).map((key) => (
            toDos[key].working === working ? (
            <View style={styles.toDo} key={key}>
              <View style={{flexDirection: "row", alignItems: "center"}}>
               <TouchableOpacity onPress={() => changeToDo(key)}>
                  {toDos[key].done === true ? (
                    <MaterialCommunityIcons style={{marginRight: 5}} name="checkbox-marked" size={22} color="gray" />
                    ) : (
                    <MaterialCommunityIcons style={{marginRight: 5}} name="checkbox-blank-outline" size={22} color="white" />
                  )}
                </TouchableOpacity>
                <Text style={{...styles.toDoText, 
                  textDecorationLine: toDos[key].done === true ? "line-through" : "none",
                  color: toDos[key].done === true ? "gray" : "white"}}>{toDos[key].text}</Text>
              </View>
              <TouchableOpacity onPress={() => deleteToDo(key)}>
                <Fontisto name="close-a" size={13} color={theme.gray} />
              </TouchableOpacity>
            </View> 
            ) : null
          ))}
        </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
   
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    paddingHorizontal: 20,
  },
  btnText: {
    //color: "white",
    fontSize: 45,
    fontWeight: "500",
  },
  input: {
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 30,
    marginVertical: 20,
    marginHorizontal: 15,
    fontSize: 17 
  },
  toDo: {
    backgroundColor: theme.toDoBg,
    marginBottom: 10,
    marginHorizontal: 15,
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius:  10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

  },
  toDoText: {
    fontSize: 15,
    fontWeight: "500",
  }
});


export default ToDoScreen
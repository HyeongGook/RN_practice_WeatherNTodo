import * as React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';

import WeatherScreen from './Screens/Home';
import ToDoScreen from './Screens/Setting';

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="WEATHER">
        <Drawer.Screen 
          name="WEATHER" 
          component={WeatherScreen}
          options={{
            headerStyle: {
              backgroundColor: '#ece6cc',
            },
            headerTitleStyle: {
              color: "black",
              fontWeight: 'bold',
            },
          }}
        />
        <Drawer.Screen 
          name="TO DO" 
          component={ToDoScreen} 
          options={{
            headerStyle: {
              backgroundColor: 'black',
            },
            headerTitleStyle: {
              color: "white",
              fontWeight: 'bold',
            },
          }}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
import * as Location from "expo-location";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { Fontisto } from '@expo/vector-icons';

const { width:SCREEN_WIDTH } = Dimensions.get("window");

const icons = {
  "Clouds": "cloudy",
  "Rain": "rain",
  "Clear": "day-sunny",
  "Snow": "snow",
}

const WeatherScreen = () => {
  const [region, setRegion] = useState();
  const [city, setCity] = useState("Loading...");
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);

  const API_KEY = "949f75dc28796b490136e03e5f682278";
  
  const getWeather = async() => {
    const {granted} = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setOk(false);
    }
    const {coords:{latitude, longitude}} = await Location.getCurrentPositionAsync({accuracy:5});
    const location = await Location.reverseGeocodeAsync({latitude, longitude}, {useGoogleMaps:false});
    setRegion(location[0].region);
    setCity(location[0].city);
    const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric`);
    const json = await response.json();

    setDays(json.daily);
  }

  useEffect(() => {
    getWeather();
  }, [])

  return (
    <View style={styles.container}>
      <StatusBar style="light"></StatusBar>
      <View style={styles.city}>
        <Text style={styles.regionName}>{region}</Text>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView 
        horizontal 
        pagingEnabled
        showsHorizontalScrollIndicator="false" 
        contentContainerStyle={styles.weather}
      >
        {days.length === 0 ? (
          <View style={styles.day}>
            <ActivityIndicator color="white" size="large"/>
          </View>
        ) : (
          days.map((day, index) =>
          <View key={index} style={styles.day}>
            <Text style={styles.date}>{new Date(day.dt * 1000).toString().substring(0,10)}</Text>
            <Text style={styles.temp}>{parseFloat(day.temp.day).toFixed(0)}º</Text>
            <Text style={styles.main}>{day.weather[0].main}</Text>
            <Text style={styles.description}>{day.weather[0].description}</Text>
            <View style={styles.weatherIcon}>
              <Fontisto name={icons[day.weather[0].main]} size={120} color="white" />
            </View>
  
          </View>)
          )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ece6cc',
    
  },
  city: {
    flex: 1.5,
    justifyContent: "center",
    alignItems: "center",
    //borderBottomColor: 'black',
    //borderBottomWidth: 2,
  },
  weather: {
   
    
  },
  cityName: {
    marginTop: 2,
    color: "black",
    fontSize: 65,
    fontWeight: "600",
  },
  regionName: {
    color: "black",
    fontSize: 30,
    fontWeight: "300",
    marginTop: -70
  },
  day: {
    width: SCREEN_WIDTH,
    //alignItems: "center",
  },
  temp: {
    marginLeft: 30,
    marginTop: 50,
    fontSize: 178,
  },
  main: {
    marginLeft: 30,
    marginTop: -30,
    fontSize: 50,
  },
  description : {
    marginLeft: 32,
    marginTop: -10,
    fontSize: 20,
    color : 'gray'
  },
  date : {
    textAlign: "right",
    marginTop: 10,
    marginRight: 25,
    marginBottom: -50,
    fontSize: 25,
  },
  weatherIcon : {
    marginTop: 10,
    marginRight: 30,
    alignItems: "flex-end",
  }
});

export default WeatherScreen;
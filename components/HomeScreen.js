 import React, { useEffect, useState } from 'react'
 import {
   ImageBackground,
   FlatList,
   Text,
   View,
   StyleSheet,
   ScrollView,
 } from 'react-native'
 import LottieView from 'lottie-react-native'
 import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
 import Geolocation from '@react-native-community/geolocation'
 import { weatherConditions } from '../utils/weatherConditions'
 
 
 const api = {
   key: '76e007b261a013187a4c891d8c98c440',
   base: 'https://api.openweathermap.org/data/2.5/'
 }
 
 const HomeScreen = ({ navigation }) => {
   const [latitude, setLatitude] = useState(null)
   const [longitude, setLongitude] = useState(null)
 
   const [isLoading, setLoading] = useState(true)
   const [weatherDetails, setWeatherDetails] = useState({
     temp: 0,
     wea: 'NIL',
     city: 'NIL',
     country: 'NIL'
   })
   useEffect(() => {
     getPosition()
   }, [])
   const [forecast, setForecast] = useState([
     { key: '1', temp: 0, wea: 'NIL' },
     { key: '2', temp: 0, wea: 'NIL' },
     { key: '3', temp: 0, wea: 'NIL' },
     { key: '4', temp: 0, wea: 'NIL' },
     { key: '5', temp: 0, wea: 'NIL' }
   ])
   let offset = 1
   const Item = ({ title }) => {
     return (
       <View style={styles.item}>
         <Text style={styles.day}>{dayBuilder(new Date(), offset++)}</Text>
         <Text style={styles.title}>{title} °C</Text>
       </View>
     )
   }
 
   const getPosition = () => {
     let lat, lon
     Geolocation.getCurrentPosition(
       position => {
         lat = Math.round(position.coords.latitude)
         lon = Math.round(position.coords.longitude)
         setLatitude(lat);
         setLongitude(lon)
         search(lat, lon)
       },
       error => {
         console.log(error.code, error.message)
       },
       {
         enableHighAccuracy: true,
         timeout: 100000,
         maximumAge: 100000
       }
     )
   }
 
   const search = (lat = null, lon = null) => {
     setLoading(true)
     fetch(
       `${api.base}weather?lat=${lat}&lon=${lon}&units=metric&APPID=${api.key}`
     )
       .then(res => {
         return res.json()
       })
       .then(result => {
         if (result.name !== null) {
           setWeatherDetails({
             temp: Math.round(result.main.temp),
             wea: result.weather[0].main,
             city: result.name,
             country: result.sys.country
           })
         } else {
           this.props.navigation.navigate('Home')
         }
       })
     fetch(
       `${api.base}forecast?lat=${lat}&lon=${lon}&units=metric&APPID=${api.key}`
     )
       .then(res => {
         return res.json()
       })
       .then(result => {
         setLoading(false)
         let forecast_ = []
         for (let index = 7, k = 1; index < result.cnt; index += 8, k++) {
           let data = {
             key: k,
             temp: Math.round(result.list[index].main.temp),
             wea: result.list[index].weather[0].main
           }
           forecast_.push(data)
         }
         setForecast(forecast_)
       })
   }
   const dayBuilder = (d, offset) => {
     let days = [
       'Sunday',
       'Monday',
       'Tuesday',
       'Wednesday',
       'Thursday',
       'Friday',
       'Saturday'
     ]
 
     let day = days[(d.getDay() + offset) % 7]
     return `${day}`
   }
   const dateBuilder = d => {
     let months = [
       'January',
       'February',
       'March',
       'April',
       'May',
       'June',
       'July',
       'August',
       'September',
       'October',
       'November',
       'December'
     ]
     let days = [
       'Sunday',
       'Monday',
       'Tuesday',
       'Wednesday',
       'Thursday',
       'Friday',
       'Saturday'
     ]
 
     let day = days[d.getDay()]
     let date = d.getDate()
     let month = months[d.getMonth()]
     return `${day}, ${month} ${date}`
   }
   const renderItem = ({ item }) => {
     return (
       <Item title={item.temp} />
     )}
   if (isLoading) {
     return (
       <View style={styles.container}>
         <LottieView
           source={require('./anim/loader_animation.json')}
           autoPlay
           loop
         />
       </View>
     )
   } else {
     return (
       <ScrollView>
       <View style={styles.container}>
         <ImageBackground
         style={[
           styles.background,
           {backgroundColor: weatherConditions[weatherDetails.wea].color},
         ]}>
         
           <Text style={styles.date}>{dateBuilder(new Date())}</Text>
           <Icon
             style={styles.icon}
             name={
               weatherDetails.wea === undefined
                 ? 'circle-off-outline'
                 : weatherConditions[weatherDetails.wea].icon
             }
             size={80}
             color={'white'}
           />
           <Text style={styles.temperature}>{weatherDetails.temp}°C</Text>
           <Text style={styles.location}>
             {weatherDetails.city}, {weatherDetails.country}
           </Text>
           <Text style={styles.weatherType}>{weatherDetails.wea}</Text>
           <FlatList
             style={styles.flatList}
             data={forecast}
             renderItem={renderItem}
             keyExtractor={item => item.key}
           />
         </ImageBackground>
         </View>
         </ScrollView>
     )
   }
 }
 
 const styles = StyleSheet.create({
   container: {
     flex: 1,
     backgroundColor: '#fff',
     justifyContent: 'center',
     alignContent: 'center'
   },
   date: {
     marginTop: 50,
     fontSize: 30,
     fontWeight: '300',
     marginBottom: 10
   },
   icon: {
     marginTop: 10
   },
   button: {
     width: '50%',
     height: 50,
     marginBottom: 50,
     backgroundColor: 'gold',
     justifyContent: 'center',
     alignItems: 'center',
     borderRadius: 10,
     marginTop: 20,
     shadowColor: 'black'
   },
   buttonText: {
     fontSize: 18,
     fontWeight: '300',
     color: 'black'
   },
   temperature: {
     fontSize: 62,
     fontWeight: '100',
     margin: 5,
     marginTop: 20
   },
   location: {
     fontSize: 16,
     fontWeight: '200',
     marginBottom: 10
   },
   weatherType: {
     fontSize: 34,
     fontWeight: '500'
   },
   flatList: {
     width: "100%",
     marginTop: 10,
   },
   item: {
     backgroundColor: 'white',
     opacity: 0.9,
     padding: 18,
     marginVertical: 7,
     marginHorizontal: 16,
     borderRadius: 10,
     flexDirection: 'row',
     alignItems: 'baseline',
     justifyContent: 'space-between'
   },
   title: {
     fontSize: 20
   },
   day: {
     fontSize: 20,
     fontFamily: 'Arial',
     marginRight: '0%',
     fontWeight: '200'
   },
   input: {
     borderWidth: 1,
     borderColor: '#666',
     height: 40,
     marginVertical: 20,
     marginHorizontal: 20,
     paddingHorizontal: 10,
     borderRadius: 5
   },
   background: {
     flex: 1,
     justifyContent: 'flex-start',
     alignItems: 'center',
   },
   searchButton: {
     width: '100%',
     height: 50,
     marginBottom: 200,
     backgroundColor: '#fcf'
   },
   searchBar:{
     height: 40,
   }
 })
 
 export default HomeScreen
 
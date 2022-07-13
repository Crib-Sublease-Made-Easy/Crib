import React, {useState, useEffect, useRef, useMemo, useCallback} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Dimensions,
  Button,
  Keyboard,
  TextInput,
  TouchableWithoutFeedback,
  Pressable,
  TouchableOpacity,
  Animated,
  Image,
  ActivityIndicator
  
} from 'react-native';

import { HEIGHT, WIDTH, PRIMARYCOLOR, LIGHTGREY, MEDIUMGREY, TEXTINPUTBORDERCOLOR } from '../../../sharedUtils';


const PRIMARYGREY = '#5e5d5d'
const TEXTGREY = '#969696'


import FontAwesome from 'react-native-vector-icons/FontAwesome';
FontAwesome.loadFont()
import Ionicons from 'react-native-vector-icons/Ionicons';
Ionicons.loadFont()

import { SearchContainer,  SearchInput, Container, ModalSearchContainer, ModalContainer, Subheading, SearchResultContainer,
    CancelGoBackText, LocationMainText, LocationSecondaryText, LogoText, PressableContainer, SearchInputContainerText,
    PlaceholderLogoTextContainer, Header, AutocompleteLocationContainer, PreviewTopContainer, PreviewBottomContainer,
    PreviewTopLeftContaier,PreviewTopRightContaier, PreviewNameText, PreviewPriceText, PreviewLocationText, FilterPressable } from './discoverStyle';

import { SearchInputCancelIconContainer } from './discoverStyle';

import { FlatList, GestureHandlerRootView} from 'react-native-gesture-handler';

import DiscoverFilterScreen from './Filter/discoverFilter';

//Components 
import PropertyCard from './propertyCard';

//React Native Map
import MapView , { Marker }from 'react-native-maps';
import Easing from 'react-native/Libraries/Animated/Easing';

var axios = require('axios');

export default function DiscoverScreen({navigation, route}){
    //Reference to the MapView
    const mapRef = useRef(null)
    //This is to control the height of the input view container
    const translation = useRef(new Animated.Value(HEIGHT*0.075)).current;
    const opacityTranslation = useRef(new Animated.Value(0)).current;
    //The location in [lat,long] of the user input. It is set as SF in the beginning
    const [currentLocation, setCurrentLocation] = useState([37.78825,-122.4324])
    //The location of the user input in string
    const [locationQuery, setlocationQuery] = useState('')
    //The data of the pins to acess a field its pinsData.item.field
    const [pinsData, setPinsData] = useState([])
    //The array to store all predictions of the user input
    const [autocompleteLocation, setautocompleteLocation] = useState([])
    //To indicate if user is searching or not
    const [searching, setSearching] = useState(false)
    //If user press view map in each card container, this stores the data of the property selected 
    //Access the fields by selectedPin.item.name
    const [selectedPin, setSelectedPin] = useState([])

    const [propertiesData, setPropertiesData] = useState([]);

    const [propertyPage, setPropertyPage] = useState(0);

    const [filterModal, setFilterModal] = useState(false)

    const [filteredProperties, setFilteredProperties] = useState([])

    const [propertyPreviewCard, setPropertyPreviewCard] = useState(false)
    const [markerClickIndex, setMarkerClickIndex] = useState()    

    const [flatlistRefreshing, setFlatlistRefreshing] = useState(false)

    const [filterType, setfilterType] = useState('')
    const [filterSort, setfilterSort] = useState('')
    const [filterDistance, setfilterDistance] = useState('')
    const [filterBedroom, setfilterBedroom] = useState(1);
    const [filterBathroom, setfilterBathroom] = useState(1);
    const [filterPriceLower, setfilterPriceLower] = useState(0);
    const [filterPriceHigher, setfilterPriceHigher] = useState(5000);
    const [filterAmenities, setfilterAmenities] = useState([])

    useEffect(()=>{
     
        console.log("Refreshing again!")

        loadProperty()
        
        moveMap()
       
        retrieveAllPins();
        setPropertyPreviewCard(false)
        setSelectedPin([])
        setTimeout(() => {
            setFlatlistRefreshing(false)
        }, 2000);
        
        
    },[currentLocation])

    //Move the header to adjust the size according if searching is true or false
    function openHeader(){
        Animated.timing(translation,{
        toValue: HEIGHT*0.5 ,
        duration: 300,
        easing: Easing.out(Easing.ease),
        delay:100,
        useNativeDriver:false,
        }).start()
       
    }
    function closeHeader(){
        Animated.spring(translation,{
        toValue: HEIGHT*0.075 ,
        bounciness:0,
        speed: 6,
        useNativeDriver:false,
        }).start()
    }

    function openPreviewCard(){
        Animated.spring(opacityTranslation,{
        toValue: 1 ,
        duration:300,
        bounciness:0,
        speed: 5,
        useNativeDriver:false,
        }).start()
        setPropertyPreviewCard(true)
    }
    function closePreviewCard(){
        Animated.spring(opacityTranslation,{
        toValue: 0,
        duration:300,
        bounciness:0,
        speed: 5,
        useNativeDriver:false,
        }).start()
        setPropertyPreviewCard(false)
    }
   
    //Show all the predictions according to the input string 
    //Input: The user input 
    function autocomplete(query){
        if(query == ""){
            setautocompleteLocation([])
        }
        setlocationQuery(query);
        
        var config = {
            method: 'get',
            url: `https://maps.googleapis.com/maps/api/place/queryautocomplete/json?input=${query}&country:us&types=address&location=37.76999%2C-122.44696&radius=4000&strictbounds=true&key=AIzaSyBLCfWwROY3Bfvq_TOnDjX90wn2nCJF2nA`,
        };
        axios(config)
        .then(function (response) {
            setautocompleteLocation([]);
            let JSONdata = response.data
            
            for( let name of JSONdata.predictions){
                setautocompleteLocation(prevArray => [...prevArray,name])   
            }        
        })
        .catch(function (error) {
            console.log(error);
        });
    } 

    //Load initial properties
    function loadProperty() {
        // console.log("Loading Data...")
        // fetch('https://sublease-app.herokuapp.com/properties/query?page=' + propertyPage, {
        // method: 'GET',
        // headers: {
        // Accept: 'application/json',
        // 'Content-Type': 'application/json'
        // }
        // }) 
        // .then(res => res.json()).then( properties =>{
        //     setPropertiesData([...propertiesData,...properties])
        // })
        // .catch(e=>{
        //     alert(e)
        // })
        let s = "";
        if(filterType != ""){
            s = s + "&type=" + filterType;
        }
        // if(filterSort != ""){
        //     s = s + "&type=" + filterSort;
        // }
        if(filterDistance != ""){
            s = s + "&maxDistance=" + parseInt(filterDistance);
        }
        if(filterDistance != ""){
            s = s + "&bed=" + filterBedroom;
        }
        if(filterDistance != ""){
            s = s + "&bath=" + filterBathroom;
        }
        for(let amen of filterAmenities){
            s = s + "&" + amen + "=true";
        }
        s = s + `&latitude=${currentLocation[0]}`
        s = s + `&longitude=${currentLocation[1]}`
        s = s + "&maxDistance=1000"
        s = s + `&priceHigh=${filterPriceHigher}`
        s = s + '&priceLow=0'

        // console.log(s);
    
        fetch('https://sublease-app.herokuapp.com/properties/query?page=0' + s, {
            method: 'GET',
            headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
            }
            }) 
            .then(res => res.json()).then(properties =>{
                // console.log("filtered properties is:")
                // console.log(properties)
                setFilteredProperties(properties)
                setFlatlistRefreshing(true)
                
            })
            .catch(e=>{
                alert(e)
        })
    }

    const loadMoreProperties = async() => {
        setPropertyPage(propertyPage+1);
        await fetch('https://sublease-app.herokuapp.com/properties/query?page=' + propertyPage, {
        method: 'GET',
        headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
        }
        }) 
        .then(res => res.json()).then(properties =>{
            setPropertiesData([...propertiesData,...properties])
        })
        .catch(e=>{
            alert(e)
        })      
    }

    // Retrieve all the pins according to currentLocation 
    const retrieveAllPins =useCallback(() =>{
        // console.log("Retrieving pins ")
    fetch(`https://sublease-app.herokuapp.com/properties/pins?latitude=${currentLocation[0]}&longitude=${currentLocation[1]}&maxDistance=1000`, {
        method: 'GET',
        headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
        }
        }) 
        .then(res => res.json()).then( pins =>{
            console.log("Loading PinsData")

            setPinsData(pins)                  
        })
        .catch(e=>{
            alert(e)
        })
    },[currentLocation])


    //Move to the center the view property location 
    //Input is an array [lat, long]
    //If only currentLocation is vlaid data, then center the mapview to current location
    //If both the currentLocation and the pinLocation is valid, then use delta to adjust mapview
    function moveMap(){
       
        let latDelta = -1;
        let longDelta = -1
        
        if(currentLocation != ""){
            // console.log("Only Location")
            mapRef.current?.animateToRegion({
                latitude: currentLocation[0],
                longitude: currentLocation[1],
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
            })
        }
        // else if(selectedPin != ""){
        //     // console.log("Only Pin")
        //     mapRef.current?.animateToRegion({
        //         latitude: selectedPin.loc.coordinates[1],
        //         longitude:  selectedPin.loc.coordinates[0],
        //         latitudeDelta: 0.05,
        //         longitudeDelta: 0.05,
        //     })
        // }
    }

    //Move to the center of the selected location from search input
    //Set currentLocation 
    //Move the map to the current location 
    //Empty the autocomplete locations 
    //setSearching to false so to shrink the header
    //Dismiss keyboard
    async function selectCurrentLocation(data){
        setautocompleteLocation("")
        setlocationQuery(data)
        setSearching(false)
        Keyboard.dismiss()
        // console.log("name is :")
        // console.log(data)
        locationStringToLatLong(data)
    }

    //Function to set the current location in variable currentLocation 
    //Input: name of the address 
    //Output: NONE
    function locationStringToLatLong(name){
        let lat;
        let long;
        let spacelessLocation = name.replaceAll(" ", "+");
        var config = {
            method: 'get',
            url: `https://maps.googleapis.com/maps/api/geocode/json?address=${spacelessLocation}&key=AIzaSyBLCfWwROY3Bfvq_TOnDjX90wn2nCJF2nA`,
        };
        axios(config)
        .then(function (response) {           
            lat = response.data.results[0].geometry.location.lat;
            long = response.data.results[0].geometry.location.lng
            setCurrentLocation([lat,long])
            // moveMap([lat,long])
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    function onMarkerClick(id){
        fetch(`https://sublease-app.herokuapp.com/properties/${id}`, {
        method: 'GET',
        headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
        }
        }) 
        .then(res => res.json()).then( pinInfo =>{
            console.log("pinInfo")
            setSelectedPin(pinInfo)
            openPreviewCard()
            mapRef.current?.animateToRegion({
                latitude: pinInfo.propertyInfo.loc.coordinates[1] - 0.005,
                longitude: pinInfo.propertyInfo.loc.coordinates[0],
                latitudeDelta: 0.02,
                longitudeDelta: 0.02,
            })
        })
        .catch(e=>{
            alert(e)
        })
    }


    return(
        <GestureHandlerRootView>
        <View style={{width:WIDTH,height:HEIGHT,position:'absolute', top:0,}}>

            <MapView
                ref={mapRef}
                style={{flex:1, position:'relative'}}
                initialRegion={{
                latitude: 37.78825, 
                longitude: -122.4324,
                latitudeDelta: 0.0001,
                longitudeDelta: 0,
                }}
            >
            
                <Marker
                coordinate={{latitude:currentLocation[0], longitude: currentLocation[1] }}
                title={"Current Location"}
                onPress={()=>console.log("hi")}
                />
            
                {pinsData.length != 0 && pinsData.map((value,index)=>(
                    <Marker
                    key={value._id}
                    pinColor= { selectedPin != "" && selectedPin?.propertyInfo._id == value._id ? 'green' : 'blue'}
                    coordinate={{latitude:value.loc.coordinates[1], longitude: value.loc.coordinates[0] }}
                    title={"$" + value.price.toString()}    
                    onPress={()=>onMarkerClick(value._id)}
                    
                    />
                ))} 
            </MapView>
            <Animated.View style={{position:'absolute', backgroundColor:'rgba(255,255,255,0.95)', width:WIDTH, height:HEIGHT,top:0,
            opacity: translation.interpolate({
                inputRange: [0, HEIGHT*0.5],
                outputRange: [0, 1]
            }), display: searching ? 'flex' : 'none' }}/>

            
            <Animated.View 
            style={{width:WIDTH*0.9, height: HEIGHT*0.25,backgroundColor:'white', borderRadius:25,
            position:'absolute', bottom: HEIGHT*0.17, alignSelf:'center',shadowColor: 'black', shadowRadius: 5,
            shadowOpacity: 0.4, elevation: 5, display: propertyPreviewCard ? 'flex' : 'none',
            opacity: opacityTranslation.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1]
            })}}>
                {selectedPin != undefined && selectedPin != "" &&
                <View>
                    <PreviewTopContainer>
                        <Image source={{uri:selectedPin.propertyInfo.imgList[0]}} style={{width:WIDTH*0.9, height: '100%',borderTopLeftRadius:25, 
                        borderTopRightRadius:25, backgroundColor: LIGHTGREY, }}/>
                    </PreviewTopContainer>

                    <PreviewBottomContainer onPress={()=>navigation.naviFmagate("PropertyDetail", {data : {item: selectedPin.propertyInfo}})}>
                        
                        <PreviewLocationText>{selectedPin.propertyInfo.location}</PreviewLocationText>
                       
                        <PreviewTopRightContaier>
                            <PreviewPriceText>${selectedPin.propertyInfo.price}</PreviewPriceText>
                            <PreviewPriceText>{selectedPin.propertyInfo.availableFrom} - {selectedPin.propertyInfo.availableTo}</PreviewPriceText>
                        </PreviewTopRightContaier>
                    </ PreviewBottomContainer> 
                </View>
                }
            
                <FontAwesome onPress={()=>closePreviewCard()} name="times-circle" size={30}  color='white' style={{position: 'absolute', right:WIDTH*0.025,
                top: HEIGHT*0.015}}/>
           
            </Animated.View>

        </View>
        

        <Header>
            <Animated.View style={ { height: translation, width: WIDTH*0.9, 
            borderWidth: 1, borderColor: '#E0E0E0',  shadowColor: 'black', shadowRadius: 13, shadowOpacity: 0.2, backgroundColor:'#F8F8F8',
            elevation: 5, borderRadius: 20, shadowOffset: {width: 0, height: 0}}} >
                    <SearchInputCancelIconContainer >
                        <Ionicons name='search-outline' size={25}  color={TEXTINPUTBORDERCOLOR} />
                        <PlaceholderLogoTextContainer placeholderTextColor={TEXTINPUTBORDERCOLOR} placeholderTextWeight='500'
                        placeholder="Looking at ..." value={locationQuery}  onChangeText={(value)=>autocomplete(value)} 
                        onEndEditing={()=>{closeHeader(), setSearching(false), setautocompleteLocation([]), Keyboard.dismiss()}} onFocus={()=> {openHeader(),setSearching(true), setPropertyPreviewCard(false)}}/>
                        <Pressable onPress={()=>setlocationQuery("")}>
                            <FontAwesome name="times-circle" size={25}  color={TEXTGREY} style={{width: WIDTH*0.1, display: searching ? 'flex' : 'none',}}/>
                        </Pressable>
                        <Pressable onPress={()=> setFilterModal(true)} style={{display: (!searching && locationQuery != "") ? 'flex' : 'none', justifyContent:'center', alignItems: 'center'}} >
                            {/* <FontAwesome name="sort" size={25}  color={TEXTGREY} style={{width: WIDTH*0.1, display: (!searching && locationQuery != "") ? 'flex' : 'none',}}/> */}
                            <Ionicons name="filter" size={25} color={TEXTINPUTBORDERCOLOR}/>
                        </Pressable>
                    </SearchInputCancelIconContainer>
                    {autocompleteLocation.length != 0 &&
                            
                        autocompleteLocation.map((value, index)=>(
                            <AutocompleteLocationContainer key={"autocomplete" + value.description + index} onPress={()=>{selectCurrentLocation(value.description),loadProperty}}>
                                <FontAwesome name="map-pin" size={25} color= {PRIMARYCOLOR} style={{width: WIDTH*0.075}}/>
                                <View>
                                <LocationMainText key={value.structured_formatting.main_text}>{value.structured_formatting.main_text}</LocationMainText>
                                <LocationSecondaryText key={value.structured_formatting.secondary_text} >{value.structured_formatting.secondary_text}</LocationSecondaryText>
                                </View>
                            </AutocompleteLocationContainer>
                        ))
                    
                    }
            </Animated.View>
        </Header>
      
        {/* Property Cards and the search bar */}              
        <PropertyCard index={0} navigation={navigation} 
        propertiesData={propertiesData} loadMoreProperties={loadMoreProperties} filteredPropertiesData={filteredProperties} markerClickIndex={markerClickIndex}
        flatlistRefreshing={flatlistRefreshing} mapRef={mapRef} onMarkerClick={onMarkerClick} currentLocation={currentLocation}/>

        <DiscoverFilterScreen open={filterModal} close={()=>setFilterModal(false)} currentLocation={currentLocation} setFilteredProperties={setFilteredProperties} />
        
        {/* <View style={{backgroundColor:'red', height:HEIGHT*0.3, width: WIDTH*0.9,  alignSelf:'center', position:'absolute', bottom:0}}>

        </View> */}
        </GestureHandlerRootView>
        
    )
}


 
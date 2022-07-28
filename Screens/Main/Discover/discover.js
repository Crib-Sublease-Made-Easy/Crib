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
  Animated,
  Image,
  ActivityIndicator
  
} from 'react-native';

import { HEIGHT, WIDTH, PRIMARYCOLOR, LIGHTGREY, MEDIUMGREY, TEXTINPUTBORDERCOLOR, DARKGREY } from '../../../sharedUtils';

const TEXTGREY = '#969696'


import FontAwesome from 'react-native-vector-icons/FontAwesome';
FontAwesome.loadFont()
import Ionicons from 'react-native-vector-icons/Ionicons';
Ionicons.loadFont()

import {LocationMainText, LocationSecondaryText, LogoText, PressableContainer, SearchInputContainerText,
    PlaceholderLogoTextContainer, Header, AutocompleteLocationContainer, PreviewTopContainer, PreviewBottomContainer,
    PreviewTopLeftContaier,PreviewTopRightContaier, PreviewNameText, PreviewPriceText, PreviewLocationText, 
    SeachIconContainer, DeleteIconContainer, CustomMarker,  SearchHerePressable } from './discoverStyle';

import { SearchInputCancelIconContainer } from './discoverStyle';

import {GestureHandlerRootView} from 'react-native-gesture-handler';

import DiscoverFilterScreen from './Filter/discoverFilter';

//Components 
import PropertyCard from './propertyCard';

//React Native Map
import MapView , { Marker }from 'react-native-maps';
import Pressable from 'react-native/Libraries/Components/Pressable/Pressable';

var axios = require('axios');

export default function DiscoverScreen({navigation, route}){
    //Reference to the MapView
    const mapRef = useRef(null)
    //This is to control the height of the input view container
    const translation = useRef(new Animated.Value(HEIGHT*0.065)).current;
    const widthtranslation = useRef(new Animated.Value(WIDTH*0.9)).current;
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

    const [propertyPage, setPropertyPage] = useState(1);

    const [filterModal, setFilterModal] = useState(false)

    const [filteredProperties, setFilteredProperties] = useState([])

    const [propertyPreviewCard, setPropertyPreviewCard] = useState(false)
    const [markerClickIndex, setMarkerClickIndex] = useState()    

    const [flatlistRefreshing, setFlatlistRefreshing] = useState(false)

    const [mapCenterLocation, setMapCenterLocation] = useState([])

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

        //This loads the property in the flatlist 
        loadProperty()
           
        retrieveAllPins(currentLocation[0], currentLocation[1]);
        setPropertyPreviewCard(false)
        setSelectedPin([])
        setTimeout(() => {
            setFlatlistRefreshing(false)
        }, 2000);
        
    },[currentLocation])

    //Open The search bar container to displya all autocomplete results according to if searching is true 
    function openHeader(){
        Animated.parallel([
            Animated.spring(widthtranslation,{
            toValue: WIDTH*0.9 ,
            bounciness:0,
                speed: 6,
                useNativeDriver:false,
            }),
            Animated.spring(translation,{
                toValue: HEIGHT*0.5 ,
                bounciness:0,
                speed: 6,
                useNativeDriver:false,
            }),
        ]).start()
       
    }

    //Close The search bar container to displya all autocomplete results according to if searching is true 
    function closeHeader(){
        Animated.parallel([
            Animated.spring(translation,{
                toValue: HEIGHT*0.065 ,
                bounciness:0,
                speed: 6,
                useNativeDriver:false,
            }),
            Animated.spring(widthtranslation,{
                toValue: WIDTH*0.9,
                bounciness:0,
                speed: 6,
                useNativeDriver:false,
            })
        ]).start()
    }

    //Open the preview card when the map button on the propertycard in flatlsit is pressed 
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
    //Close the preview card when the map button on the propertycard in flatlsit is pressed 
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
            url: `https://sublease-app.herokuapp.com/autocomplete/places/${query}`,
        };
        axios(config)
        .then(function (response) {
            setautocompleteLocation([]);            
            for( let name of response){
                setautocompleteLocation(prevArray => [...prevArray,name])   
            }        
        })
        .catch(function (error) {
            console.log(error);
        });
    } 

    //Load initial properties
    const loadProperty = useCallback(()=> {
        
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
                console.log("Filtered properties is:")
                console.log("==========================================================")
                // console.log(properties)
                setFilteredProperties(properties)
                setFlatlistRefreshing(true)
                
            })
            .catch(e=>{
                alert(e)
        })
    },[currentLocation])

    const loadMoreProperties = async() => {
        console.log("Inside load more data")
        setPropertyPage(propertyPage+1);
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

        await fetch('https://sublease-app.herokuapp.com/properties/query?page=' + propertyPage + s, {
        method: 'GET',
        headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
        }
        }) 
        .then(res => res.json()).then(properties =>{
            // setPropertiesData([...propertiesData,...properties])
          
            setFilteredProperties([...filteredProperties,...properties])
        })
        .catch(e=>{
            alert(e)
        })      
    }

    // Retrieve all the pins according to currentLocation, this is need to display all the properties with a max distance of 1000km
    const retrieveAllPins = (lat, long) =>{
        console.log("Retrieving pins ")
        console.log(lat + " " + long)
        fetch(`https://sublease-app.herokuapp.com/properties/pins?latitude=${lat}&longitude=${long}&maxDistance=1000`, {
        method: 'GET',
        headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
        }
        }) 
        .then(res => res.json()).then( pins =>{
            console.log("Loading PinsData")
         
            console.log(pins)
            console.log("==========================================================")
            setPinsData(pins)             
            
        })
        .catch(e=>{
            alert(e)
        })
    }


    //Move to the center the view property location 
    //Input is an array [lat, long]
    //If only currentLocation is vlaid data, then center the mapview to current location
    //If both the currentLocation and the pinLocation is valid, then use delta to adjust mapview
    function moveMap(lat,long){
       
        let latDelta = -1;
        let longDelta = -1
        
        if(currentLocation != ""){
            // console.log("Only Location")
            mapRef.current?.animateToRegion({
                latitude: lat,
                longitude: long,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
            })
        }
    }

    //Move to the center of the selected location from search input
    //Set currentLocation 
    //Move the map to the current location 
    //Empty the autocomplete locations 
    //setSearching to false so to shrink the header
    //Dismiss keyboard
    function selectCurrentLocation(locationQueryName){
        console.log("The locationQueryName is :")
        // console.log(locationQueryName)
        setautocompleteLocation("")
        setlocationQuery(locationQueryName)
        setSearching(false)
        Keyboard.dismiss()
        let spacelessLocation = locationQueryName.replaceAll(" ", "+");
        var config = {
            method: 'get',
            url: `https://maps.googleapis.com/maps/api/geocode/json?address=${spacelessLocation}&key=AIzaSyBLCfWwROY3Bfvq_TOnDjX90wn2nCJF2nA`,
        };
        axios(config)
        .then(async (response)=> {           
            // console.log(data)
            lat = response.data.results[0].geometry.location.lat;
            long = response.data.results[0].geometry.location.lng
            setCurrentLocation([lat,long])
            moveMap(lat, long)
        })
        .catch(function (error) {
            console.log(error);
        });
       
       

    }

    //Function to set the current location in variable currentLocation 
    //Input: name of the address 
    //Output: NONE
    async function locationStringToLatLong(name){
        var lat;
        let spacelessLocation = name.replaceAll(" ", "+");
        var config = {
            method: 'get',
            url: `https://maps.googleapis.com/maps/api/geocode/json?address=${spacelessLocation}&key=AIzaSyBLCfWwROY3Bfvq_TOnDjX90wn2nCJF2nA`,
        };
        axios(config)
        .then(async (data)=> {           
            // console.log(data)
            // lat = response.data.results[0].geometry.location.lat;
            // long = response.data.results[0].geometry.location.lng
            // setCurrentLocation([lat,long])
           
            // console.log(data.data.results[0].geometry.location.lng)
            lat = data.data.results[0].geometry.location.lat
            return lat
        })
        .catch(function (error) {
            console.log(error);
        });
      
    }

    function onMarkerClick(id){
       
    }


    return(
        <GestureHandlerRootView style={{display:'flex'}}>
        <View style={{width:WIDTH,height:HEIGHT,position:'absolute', top:0,}}>

            <MapView
            
                onRegionChange={(Region)=> setMapCenterLocation([Region.latitude,Region.longitude])}
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
                >
                    <Ionicons name="location" size={30} color='red'/>
                </Marker>
            
                {pinsData != undefined && pinsData.map((value,index)=>(
                    <Marker
                    key={value._id}
                    coordinate={{latitude:value.loc.coordinates[1], longitude: value.loc.coordinates[0] }}
                    onPress={()=> alert("HELLO")}
                   >
                    <CustomMarker>
                        <Text style={{color:'white'}}>${value.price}</Text>

                    </CustomMarker>
                   </Marker>
                ))} 
            </MapView>
            <Animated.View style={{position:'absolute', backgroundColor:'rgba(255,255,255,0.95)', width:WIDTH, height:HEIGHT,top:0,
            opacity: translation.interpolate({
                inputRange: [0, HEIGHT*0.5],
                outputRange: [0, 1]
            }), display: searching ? 'flex' : 'none' }}/>

            < SearchHerePressable onPress={()=>{setCurrentLocation(mapCenterLocation), retrieveAllPins(mapCenterLocation[0], mapCenterLocation[1])}}>
                <Ionicons name="search-outline" size={25} />
            </ SearchHerePressable>
            <Animated.View 
            style={{width:WIDTH*0.9, height: HEIGHT*0.275,backgroundColor:'white', borderRadius:25,
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
                        
                        <PreviewLocationText>{selectedPin.propertyInfo.loc.streetAddr}</PreviewLocationText>
                       
                        <PreviewTopRightContaier>
                            <PreviewPriceText>${selectedPin.propertyInfo.price}</PreviewPriceText>
                            <PreviewPriceText>{new Date(selectedPin.propertyInfo.availableFrom).toDateString()}</PreviewPriceText>
                            <PreviewPriceText>{new Date(selectedPin.propertyInfo.availableTo).toDateString()}</PreviewPriceText>

                        </PreviewTopRightContaier>
                    </ PreviewBottomContainer> 
                </View>
                }
            
                <FontAwesome onPress={()=>closePreviewCard()} name="times-circle" size={30}  color='white' style={{position: 'absolute', right:WIDTH*0.025,
                top: HEIGHT*0.015}}/>
           
            </Animated.View>

        </View>
        

        <Header>
            
            {/* This sets the container of the search input */}
            <Animated.View style={ { height: translation, width: widthtranslation, marginLeft: WIDTH*0.05,
             shadowColor: 'black', shadowRadius: 13, shadowOpacity: 0.2, backgroundColor:'white',
            elevation: 5, borderRadius: 25, shadowOffset: {width: 0, height: 0}}} >
                    <SearchInputCancelIconContainer>
                        <SeachIconContainer>
                            <Ionicons name='search-outline' size={25}  color={TEXTINPUTBORDERCOLOR} />
                        </SeachIconContainer>
                        <PlaceholderLogoTextContainer placeholderTextColor={TEXTINPUTBORDERCOLOR} placeholderTextWeight='500'
                        placeholder="Looking at ..." value={locationQuery}  onChangeText={(value)=>autocomplete(value)} 
                        onEndEditing={()=>{closeHeader(), setSearching(false), setautocompleteLocation([]), Keyboard.dismiss()}} onFocus={()=> {openHeader(),setSearching(true), setPropertyPreviewCard(false)}}/>
                        <DeleteIconContainer onPress={()=>setlocationQuery("")} style={{ display: searching ? 'flex' : 'none',}}>
                            <FontAwesome name="times-circle" size={25}  color={TEXTGREY} />
                        </DeleteIconContainer>
                        <DeleteIconContainer onPress={()=> setFilterModal(true)} style={{display: (!searching && locationQuery != "") ? 'flex' : 'none'}} >
                            <Ionicons name="list-outline" size={25}  color={TEXTGREY}/>
                        </DeleteIconContainer> 
                    </SearchInputCancelIconContainer>
                    {autocompleteLocation.length != 0 &&
                            
                        autocompleteLocation.map((value, index)=>(
                            <AutocompleteLocationContainer key={"autocomplete" + value.description + index} onPress={()=>{selectCurrentLocation(value.description), setFilteredProperties([])}}>
                                <FontAwesome name="map-pin" size={25} color= {PRIMARYCOLOR} style={{width: WIDTH*0.075}}/>
                                <View>
                                <LocationMainText key={value.structured_formatting.main_text}>{value.structured_formatting.main_text}</LocationMainText>
                                <LocationSecondaryText key={value.structured_formatting.secondary_text} >{value.structured_formatting.secondary_text}</LocationSecondaryText>
                                </View>
                            </AutocompleteLocationContainer>
                        ))
                    
                    }
            </Animated.View>
            {/* <Pressable onPress={()=> setFilterModal(true)}
            style={{width: HEIGHT*0.06, height: HEIGHT*0.06, borderRadius: HEIGHT*0.03, backgroundColor:'white', marginLeft: WIDTH*0.05, justifyContent:'center', alignItems:'center',shadowRadius: 13, shadowOpacity: 0.2, 
            elevation: 5, borderRadius: 25, shadowOffset: {width: 0, height: 0}}}>
                    <Ionicons name="filter" size={20} color={DARKGREY}/>
            </Pressable> */}
        </Header>
      
        {/* Property Cards and the search bar */}       
        
        <PropertyCard index={0} navigation={navigation} length={filteredProperties.length}
        propertiesData={propertiesData} loadMoreProperties={loadMoreProperties} filteredPropertiesData={filteredProperties} markerClickIndex={markerClickIndex}
        flatlistRefreshing={flatlistRefreshing} mapRef={mapRef} onMarkerClick={onMarkerClick} currentLocation={currentLocation} moveMap={moveMap}
        setSelectedPin={setSelectedPin} openPreviewCard={openPreviewCard} />

        <DiscoverFilterScreen open={filterModal} close={()=>setFilterModal(false)} currentLocation={currentLocation} setFilteredProperties={setFilteredProperties} />
        
        {/* <View style={{backgroundColor:'red', height:HEIGHT*0.3, width: WIDTH*0.9,  alignSelf:'center', position:'absolute', bottom:0}}>

        </View> */}
        </GestureHandlerRootView>
        
    )
}

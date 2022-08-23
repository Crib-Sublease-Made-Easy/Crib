import React, {useState, useEffect, useRef, useMemo, useCallback, useContext} from 'react';
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
  ActivityIndicator,
  TouchableOpacity,
  Modal
  
} from 'react-native';
import SecureStorage, { ACCESS_CONTROL, ACCESSIBLE, AUTHENTICATION_TYPE } from 'react-native-secure-storage'
import { HEIGHT, WIDTH, PRIMARYCOLOR, LIGHTGREY, MEDIUMGREY, TEXTINPUTBORDERCOLOR, DARKGREY } from '../../../sharedUtils';
import OneSignal from 'react-native-onesignal';


const TEXTGREY = '#969696'

import DiscoverSearchScreen from './discoverSearch'


import FontAwesome from 'react-native-vector-icons/FontAwesome';
FontAwesome.loadFont()
import Ionicons from 'react-native-vector-icons/Ionicons';
Ionicons.loadFont()

import {LocationMainText, LocationSecondaryText, LogoText, PressableContainer, SearchInputContainerText,
    PlaceholderLogoTextContainer, Header, AutocompleteLocationContainer, PreviewTopContainer, PreviewBottomContainer,
    PreviewTopLeftContaier,PreviewTopRightContaier, PreviewNameText, PreviewPriceText, PreviewLocationText, 
    SeachIconContainer, DeleteIconContainer, CustomMarker,  SearchHerePressable, SearchHereText } from './discoverStyle';

import { SearchInputCancelIconContainer } from './discoverStyle';

import {GestureHandlerRootView} from 'react-native-gesture-handler';

import DiscoverFilterScreen from './Filter/discoverFilter';

//Components 
import PropertyCard from './propertyCard';



//React Native Map
import MapView , { Marker }from 'react-native-maps';
import Pressable from 'react-native/Libraries/Components/Pressable/Pressable';

import { UserContext } from '../../../UserContext';

var axios = require('axios');

export default function DiscoverScreen({navigation, route}){


    const {sb, USERID, userInitialLocation} = useContext(UserContext);
      //Method for handling notifications received while app in foreground
      OneSignal.setNotificationOpenedHandler(notification => {
        // console.log("OneSignal: notification opened:", notification);
            navigation.navigate("Message")
        
      });
    //Reference to the MapView
    const mapRef = useRef(null)
    //This is to control the height of the input view container
    const translation = useRef(new Animated.Value(HEIGHT*0.065)).current;
    const widthtranslation = useRef(new Animated.Value(WIDTH*0.9)).current;
    const opacityTranslation = useRef(new Animated.Value(0)).current;
    //The location in [lat,long] of the user input. It is set as SF in the beginning
    const [currentLocation, setCurrentLocation] = useState((userInitialLocation == null? [37.7749,-122.4194] :  userInitialLocation) )
    //The location of the user input in string
    const [locationQuery, setlocationQuery] = useState("")
    //The data of the pins to acess a field its pinsData.item.field
    const [pinsData, setPinsData] = useState([])
    //Toggle to retrieve more properties
    const [retrieveMore, setRetrieveMore] = useState(true)
    //The array to store all predictions of the user input
    const [autocompleteLocation, setautocompleteLocation] = useState([])
    //To indicate if user is searching or not
    const [searching, setSearching] = useState(false)
    //If user press view map in each card container, this stores the data of the property selected 
    //Access the fields by selectedPin.item.name
    const [selectedPin, setSelectedPin] = useState(null)
    
    const [propertiesData, setPropertiesData] = useState([]);

    const [propertyPage, setPropertyPage] = useState(1);

    const [filterModal, setFilterModal] = useState(false)

    const [filteredProperties, setFilteredProperties] = useState([])

    const [propertyPreviewCard, setPropertyPreviewCard] = useState(false)
    const [markerClickIndex, setMarkerClickIndex] = useState()    

    const [flatlistRefreshing, setFlatlistRefreshing] = useState(false)

    const [mapCenterLocation, setMapCenterLocation] = useState(currentLocation)

    const [filterType, setfilterType] = useState('')
    const [filterSort, setfilterSort] = useState('')
    const [filterDistance, setfilterDistance] = useState(150)
    const [filterBedroom, setfilterBedroom] = useState("");
    const [filterBathroom, setfilterBathroom] = useState("");
    const [filterPriceLower, setfilterPriceLower] = useState(0);
    const [filterPriceHigher, setfilterPriceHigher] = useState(10000);
    const [filterAvailableFrom, setfilterAvailableFrom] = useState(new Date())
    const [filterAvailableTo, setfilterAvailableTo] = useState(new Date(1759190400000))

    const [filterPreviewValue, setfilterPreviewValue] = useState(10000)
    const [filterPreviewDistanceValue, setfilterPreviewDistanceValue] = useState(150)
    const [filterAmenities, setfilterAmenities] = useState([])

    const [loading, setLoading] = useState(false)
    const [userId, setUserId] = useState(null)
    const [mapViewing, setMapViewing] = useState(true)

    const [discoverSearchVisible, setDiscoverSearchVisible] = useState(false)
    useEffect(()=>{
        setFlatlistRefreshing(true)
        console.log("USEFFECT")

        
        //This loads the property in the flatlist 
        loadProperty()
       
        retrieveAllPins(currentLocation[0], currentLocation[1], filterDistance, filterPriceHigher, filterBedroom, filterBathroom, filterType, filterAmenities, filterAvailableFrom, filterAvailableTo )
        setPropertyPreviewCard(false)
        setSelectedPin([])
       
            let timer1 = setTimeout(() => setFlatlistRefreshing(false), 2000);
      
            // this will clear Timeout
            // when component unmount like in willComponentUnmount
            // and show will not change to true
            return () => {
              clearTimeout(timer1);
            };
        
        
        
    },[currentLocation])


    function dateCompare(date1, date2){
        let d1 = date1
        let d2 = date2
        d1.setHours(0, 0, 0, 0);
        d2.setHours(0, 0, 0, 0);
        
        if(d1.valueOf() == d2.valueOf()){ 
            return true;
        } else {
            return false;
        }
    }
    //Open The search bar container to displya all autocomplete results according to if searching is true 
    function openHeader(){
        if(!searching){
            Animated.spring(translation,{
                toValue: HEIGHT*0.445 ,
                bounciness:0,
                speed: 6,
                useNativeDriver:false,
            }).start()
        }
    }



    //Close The search bar container to displya all autocomplete results according to if searching is true 
    function closeHeader(){
       
        Animated.spring(translation,{
            toValue: HEIGHT*0.065 ,
            bounciness:0,
            speed: 6,
            useNativeDriver:false,
        }).start()
      
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
        .then(response => {
            setautocompleteLocation([]);           
            for( let name of response.data){
                setautocompleteLocation(prevArray => [...prevArray,name])   
            }        
        })
        .catch(function (error) {
            console.log(error);
        });
    } 

    //Load initial properties
    const loadProperty = useCallback(()=> {
        console.log("Load properties")
        setPropertyPage(1)
        setRetrieveMore(true)
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
        if(filterBedroom != ""){
            s = s + "&bed=" + filterBedroom;
        }
        if(filterBathroom != ""){
            s = s + "&bath=" + filterBathroom;
        }
        for(let amen of filterAmenities){
            s = s + "&" + amen + "=true";
        }
        s = s + `&latitude=${currentLocation[0]}`
        s = s + `&longitude=${currentLocation[1]}`

        s = s + `&priceHigh=${filterPriceHigher}`
        s = s + '&priceLow=0'
            fetch('https://sublease-app.herokuapp.com/properties/query?page=0' + s, {
            method: 'GET',
            headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
            }
            }) 
            .then(res => res.json()).then(properties =>{
                
                setFilteredProperties(properties)
                
                
            })
            .catch(e=>{
                alert(e)
        })
    },[currentLocation])

    const loadMoreProperties = async() => {
        if(retrieveMore){
            setPropertyPage(propertyPage+1);
        }
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
        if(filterBedroom != ""){
            s = s + "&bed=" + filterBedroom;
        }
        if(filterBathroom != ""){
            s = s + "&bath=" + filterBathroom;
        }
        for(let amen of filterAmenities){
            s = s + "&" + amen + "=true";
        }
        s = s + `&latitude=${currentLocation[0]}`
        s = s + `&longitude=${currentLocation[1]}`
        s = s + `&priceHigh=${filterPriceHigher}`
        s = s + '&priceLow=0'
        // s = s +`&availableFrom=${filterAvailableFrom}`
        // s = s +`&availableTo=${filterAvailableTo}`


        if(propertyPage != 0){
            await fetch('https://sublease-app.herokuapp.com/properties/query?page=' + propertyPage + s, {
            method: 'GET',
            headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
            }
            }) 
            .then(res => res.json()).then(properties =>{
                // setPropertiesData([...propertiesData,...properties])
            //   console.log("PROPERTIES", properties)
            if(properties.length == 0){
                setRetrieveMore(false)
            }
                setFilteredProperties([...filteredProperties,...properties])
            })
            .catch(e=>{
                alert(e)
            })   
        }   
    }

    function retrieveAllPins(lat, long, distance, price, bed, bath, type, amens, from, to ){
        setPropertyPreviewCard(false)
        let s = "";
        if(type != ""){
            s = s + "&type=" + type;
        }
        if(distance != ""){
            s = s + "&maxDistance=" + parseInt(distance);
        }
        if(bed != ""){
            s = s + "&bed=" + bed;
        }
        if(bath != ""){
            s = s + "&bath=" + bath;
        }
        if(amens != undefined){
            for(let amen of amens){
                s = s + "&" + amen + "=true";
            }
        
         }
        s = s + `&latitude=${lat}`
        s = s + `&longitude=${long}`
        s = s + `&priceHigh=${price}`
        s = s + `&priceLow=0`
        s = s +`&availableFrom=${from}`
        s = s +`&availableTo=${to}`
        // console.log("Retrieving pins ")
        fetch(`https://sublease-app.herokuapp.com/properties/pins?${s}` , {
        method: 'GET',
        headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
        }
        }) 
        .then(res => res.json()).then( pins =>{
           
            if(pins.length == 0){
                console.log("PINS DATA IS EMPTY")
                setPinsData([])
            }
            else{
                setPinsData(pins) 
            }
        
            
        })
        .catch(e=>{
            alert(e)
        })
        
    }


    //Move to the center the view property  
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
        if (locationQueryName != "" && autocompleteLocation.length != 0){
            setautocompleteLocation([])
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
                // console.log(response)
                let lat = response.data.results[0].geometry.location.lat;
                let long = response.data.results[0].geometry.location.lng
                setCurrentLocation([lat,long])
                moveMap(lat - 0.015, long)
            })
            .catch(function (error) {
                
                console.log(error);
            });
        
        
        }
    }

    function getDistanceFromLatLonInMiles(lat1,lon1,lat2,lon2) {
        var R = 6371; // Radius of the earth in km
        var dLat = deg2rad(lat2-lat1);  // deg2rad below
        var dLon = deg2rad(lon2-lon1); 
        var a = 
          Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
          Math.sin(dLon/2) * Math.sin(dLon/2)
          ; 
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        var d = R * c; // Distance in km
        return d * 0.621371; //km to miles
    }

    function deg2rad(deg) {
        return deg * (Math.PI/180)
    }

    async function onMarkerClick(item){
        setLoading(true)
       
        await fetch('https://sublease-app.herokuapp.com/properties/' + item._id, {
        method: 'POST',
        headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            viewCount: "false"
        })
        }) 
        .then(res => res.json()).then(property =>{
            console.log("PROPERTY", property.propertyInfo._id)
            setSelectedPin(property)
            moveMap(item.loc.coordinates[1] - 0.015, item.loc.coordinates[0])
        })
        .catch(e=>{
            alert(e)
        })
        
        
        setPropertyPreviewCard(true)
        openPreviewCard()
        setLoading(false)
    }


    async function updateQueryString (loc){
        var config = {
            method: 'get',
            url: `https://sublease-app.herokuapp.com/autocomplete/reversegeocoding?lat=${loc[0]}&long=${loc[1]}`,
        };
        await axios(config)
        .then(async (response)=> {           
            setlocationQuery(response.data.formatted_address)
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    return(
        <GestureHandlerRootView style={{flex: 1}}>
            
            
        <SafeAreaView>
        <View style={{width:WIDTH,height:HEIGHT,position:'absolute', top:0, flex: 1}}>
                <MapView
                    onRegionChange={(Region)=> setMapCenterLocation([Region.latitude,Region.longitude])}
                    scrollEnabled={mapViewing}
                    ref={mapRef}
                    style={{flex:1, position:'relative'}}
                    initialRegion={{
                    latitude: currentLocation[0], 
                    longitude: currentLocation[1],
                    latitudeDelta: 0.02,
                    longitudeDelta: 0.02,
                    }}
                >
                    <Marker
                        key={"currentlocationmarker"}
                        coordinate={{ latitude:currentLocation[0], longitude:currentLocation[1] }}
                        style={{zIndex:1}}
                    ></Marker>
                    

                    {pinsData.length != 0 && pinsData.map((value,index)=>(
                        <Marker
                        key={value._id}
                        coordinate={{ latitude:value.loc.coordinates[1], longitude: value.loc.coordinates[0] }}
                        onPress={()=>onMarkerClick(value)}
                       
                    >
                        <CustomMarker style={{backgroundColor: value._id == selectedPin?._id ? PRIMARYCOLOR : 'green', zIndex: value._id == selectedPin._id ? 2 : 1}}>
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

                < SearchHerePressable onPress={()=>{setCurrentLocation(mapCenterLocation), updateQueryString(mapCenterLocation),
                retrieveAllPins(currentLocation[0], currentLocation[1], filterDistance, filterPriceHigher, filterBedroom, filterBathroom, filterType, filterAmenities, filterAvailableFrom.getTime(), filterAvailableTo.getTime() )
                }}>
                    <SearchHereText>Search Here</SearchHereText>
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
                    <Pressable disabled={loading} onPress={()=>{ navigation.navigate("PropertyDetail", {data: selectedPin, uid: USERID, distance: Math.round(getDistanceFromLatLonInMiles(currentLocation[0],currentLocation[1],selectedPin.propertyInfo.loc.coordinates[1], selectedPin.propertyInfo.loc.coordinates[0]))})}}>
                        <PreviewTopContainer>
                            <Image source={{uri:selectedPin.propertyInfo.imgList[0]}} style={{width:WIDTH*0.9, height: '100%',borderTopLeftRadius:25, 
                            borderTopRightRadius:25, backgroundColor: LIGHTGREY, }}/>
                        </PreviewTopContainer>

                        <PreviewBottomContainer >
                            <PreviewLocationText>{selectedPin.propertyInfo.loc.secondaryTxt}</PreviewLocationText>
                            <PreviewPriceText>{new Date(selectedPin.propertyInfo.availableFrom).getDate() + " " +
                                    new Date(selectedPin.propertyInfo.availableFrom).toLocaleString('default', { month: 'short' }) 
                                    }  -  {new Date(selectedPin.propertyInfo.availableTo).getDate() + " " +
                                    new Date(selectedPin.propertyInfo.availableTo).toLocaleString('default', { month: 'short' })}</PreviewPriceText>
                            
                            <PreviewPriceText>${selectedPin.propertyInfo.price}</PreviewPriceText>

                            
                        </ PreviewBottomContainer> 
                    </Pressable>
                    }

                    <FontAwesome onPress={()=>closePreviewCard()} name="times-circle" size={30}  color='white' style={{position: 'absolute', right:WIDTH*0.025,
                    top: HEIGHT*0.015}}/>

                </Animated.View>
            </View>
            
        
            <Header>
                {/* This sets the container of the search input */}
                <Animated.View style={ { height: translation, width: widthtranslation, marginLeft: WIDTH*0.05,
                shadowColor: 'black', shadowRadius: 13, shadowOpacity: 0.32, backgroundColor:'white',
                elevation: 7, borderRadius: 25, shadowOffset: {width: 0, height: 0}}} 
                >
                        <SearchInputCancelIconContainer>

                            {/* The search icon on the search outlien */}
                            <SeachIconContainer>
                                <Ionicons name='search-outline' size={25}  color={TEXTINPUTBORDERCOLOR} />
                            </SeachIconContainer>
                            {/* This is the actual search input when user press on search bar  */}
                            {/* <PlaceholderLogoTextContainer 
                            placeholderTextColor={TEXTINPUTBORDERCOLOR}
                            placeholder="Search Location" value={locationQuery}  onChangeText={(value)=>autocomplete(value)} onSubmitEditing={({nativeEvent: { text, eventCount, target }})=>{autocompleteLocation.length != 0 && selectCurrentLocation(autocompleteLocation[0].description) }}
                            onEndEditing={()=>{closeHeader(), setSearching(false), Keyboard.dismiss()}}  onFocus={()=> {openHeader(), setSearching(true), setPropertyPreviewCard(false)}}/> */}
                            <PlaceholderLogoTextContainer 
                            placeholderTextColor={TEXTINPUTBORDERCOLOR}
                            placeholder="Search Location" value={locationQuery}  onChangeText={(value)=>autocomplete(value)} onSubmitEditing={({nativeEvent: { text, eventCount, target }})=>{autocompleteLocation.length != 0 && selectCurrentLocation(autocompleteLocation[0].description) }}
                            onEndEditing={()=>{closeHeader(), setSearching(false), Keyboard.dismiss()}}  onFocus={()=>setDiscoverSearchVisible(true)}/>
                            <DeleteIconContainer onPress={()=>setlocationQuery("")} style={{ display: searching ? 'flex' : 'none',}}>
                                <FontAwesome name="times-circle" size={25}  color={TEXTGREY} />
                            </DeleteIconContainer>
                            <DeleteIconContainer onPress={()=> setFilterModal(true)} style={{display: (!searching && locationQuery != "") ? 'flex' : 'none', }} >
                                {(filterType != ''  || filterDistance != 150 || filterBedroom !=="" || filterBathroom != "" || filterPriceLower != 0 || filterPriceHigher != 10000 || filterAmenities.length != 0) || !(dateCompare(new Date(1759190400000), new Date(filterAvailableTo))) || !(dateCompare(new Date(), new Date(filterAvailableFrom)))?
                                <View style={{borderWidth:2, padding: 7, borderRadius: 50, borderColor: '#8559E3' }}>
                                <Ionicons name="options-sharp" size={20} />
                                </View>
                                :
                                <View style={{borderWidth:1, padding: 7, borderRadius: 50, borderColor: '#D3D3D3'}}>
                                <Ionicons name="options-sharp" size={20} />
                                </View>                        
                                }
                            </DeleteIconContainer> 

                        </SearchInputCancelIconContainer>
                        {autocompleteLocation.length != 0 &&
                                
                            autocompleteLocation.map((value, index)=>(
                                <AutocompleteLocationContainer searching={searching} key={"autocomplete" + value.description + index} onPress={()=>{selectCurrentLocation(value.description), setFilteredProperties([])}}>
                                    <Ionicons name="navigate-circle-outline" size={23} color= {PRIMARYCOLOR} style={{width: WIDTH*0.07}}/>
                                    <View>
                                    <LocationMainText key={value.structured_formatting.main_text}>{value.structured_formatting.main_text}</LocationMainText>
                                    <LocationSecondaryText key={value.structured_formatting.secondary_text} >{value.structured_formatting.secondary_text}</LocationSecondaryText>
                                    </View>
                                </AutocompleteLocationContainer>
                            ))
                        
                        }
                </Animated.View>
            </Header>
        <View style={{width:WIDTH, height:HEIGHT*0.05, }}>

        </View>
        {/* Property Cards and the search bar */}       
        
        <PropertyCard index={0} navigation={navigation} length={pinsData.length} userId={userId}
        propertiesData={propertiesData} loadMoreProperties={loadMoreProperties} filteredPropertiesData={filteredProperties} markerClickIndex={markerClickIndex}
        flatlistRefreshing={flatlistRefreshing} mapRef={mapRef} onMarkerClick={onMarkerClick} currentLocation={currentLocation} moveMap={moveMap}
        setSelectedPin={setSelectedPin} openPreviewCard={openPreviewCard} locationQuery={locationQuery} searching={searching}/>

        <DiscoverFilterScreen open={filterModal} close={()=>setFilterModal(false)} retrieveAllPins={retrieveAllPins}
        currentLocation={currentLocation} setFilteredProperties={setFilteredProperties} setPropertyPage={setPropertyPage} setRetrieveMore={setRetrieveMore}
        filterType={filterType} setfilterType={setfilterType} filterSort={filterSort} setfilterSort={setfilterSort} filterDistance={filterDistance}
        setfilterDistance={setfilterDistance} filterBedroom={filterBedroom} setfilterBedroom={setfilterBedroom} filterBathroom={filterBathroom}
        setfilterBathroom={setfilterBathroom} filterPriceLower={filterPriceLower} setfilterPriceLower={setfilterPriceLower}
        filterPriceHigher={filterPriceHigher} setfilterPriceHigher={setfilterPriceHigher} filterAmenities={filterAmenities}
        setfilterAmenities={setfilterAmenities} filterPreviewValue={filterPreviewValue} setfilterPreviewValue={setfilterPreviewValue}
        filterPreviewDistanceValue={filterPreviewDistanceValue} setfilterPreviewDistanceValue={setfilterPreviewDistanceValue}
        filterAvailableFrom={filterAvailableFrom} setfilterAvailableFrom={setfilterAvailableFrom}
        filterAvailableTo={filterAvailableTo} setfilterAvailableTo={setfilterAvailableTo} openMapViewing={()=> setMapViewing(true)} closeMapViewing={()=> setMapViewing(false)}
        loadProperty={loadProperty}
        />

        <DiscoverSearchScreen open={discoverSearchVisible} close={()=> setDiscoverSearchVisible(false)}/>
        
        </SafeAreaView>
        

            
        </GestureHandlerRootView>
    )
}

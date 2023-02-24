import React, {useState, useEffect, useRef, useCallback, useContext} from 'react';
import {
  SafeAreaView,
  Text,
  View,
  Animated as RNAnimated,
  Image,
  Pressable
} from 'react-native';

var axios = require('axios');

//Global variables that is shared among pages, initialized in App.js
import { UserContext } from '../../../UserContext';

//Notification Service
import OneSignal from 'react-native-onesignal';

//Screen Components
import DiscoverSearchScreen from './discoverSearch' //onPress Search Bar

import DiscoverFilterScreen from './Filter/discoverFilter'; //onPress Search Filter Icon

import PropertyCard from './propertyCard';  //The slide up screen that shows all properties

import EncryptedStorage from 'react-native-encrypted-storage';
//Icons
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Modal from "react-native-modal";



//Style components 
import { HEIGHT, WIDTH, PRIMARYCOLOR, LIGHTGREY} from '../../../sharedUtils';

//Custom components
import {
    SearchContainer, 
    SearchContainerPlaceholderText, 
    MapContainer, 
    PreviewTopContainer, 
    PreviewBottomContainer,
    PreviewPriceText, 
    PreviewLocationText, 
    SeachIconContainer,
    DeleteIconContainer, 
    CustomMarker,  
    SearchHerePressable, 
    SearchHereText,
    FilterAppliedIconBackground,
    NoFilterAppliedIconBackground,
    PreviewdetailsText,
    DatePriceContainer
} from './discoverStyle';

//Gesture Handler to control propertycard
import {GestureHandlerRootView, TouchableWithoutFeedback} from 'react-native-gesture-handler';

//React Native Map
import MapView , { Marker }from 'react-native-maps';
import NotificationModal from './notificaitonModal';


export default function DiscoverScreen({navigation, route, initialParams}){

    const {sb, USERID, preloadProperties} = useContext(UserContext);

    //Method for handling notifications received while app in foreground
    OneSignal.setNotificationOpenedHandler(async notification => {
    // console.log("OneSignal: notification opened:", notification);
        await connectSendbird()
        navigation.navigate("Message")
    });
    const connectSendbird = async () => {
        try{
            const UID = await EncryptedStorage.getItem("userId");
            if (UID != undefined) {
            try {
                // console.log("connecting to sendbird")
                await sb.connect(UID, function (user, error) {
                if (error) {
                    // Handle error.
                    console.log("sendbird error")
                    console.log(error)
                }
                else {
                    
                    console.log("sendbird connected")
                }
                // The user is connected to Sendbird server.
                });
                // The user is connected to the Sendbird server.
            } catch (err) {
                // Handle error.
                console.log("SENDBIRD ERROR",err)
            }
            }
        }
        catch{
            console.log("ERROR --- DISCOVER --- CONNECTSENDBIRD")
        }
      }
     
    //   30.267153,-97.7430608
    //Reference to the MapView
    const mapRef = useRef(null)
    //This controls preview modal open opacity when the location icon in propertycard is pressed
    const opacityTranslation = useRef(new RNAnimated.Value(0)).current;
    //The location in [lat,long] of the user input. It is set as SF in the beginning
    let lastLocationCoor = route?.params?.LastSearched;
    let LastSearchedLocation = route?.params?.LastSearchedLocation;
    const [currentLocation, setCurrentLocation] = useState(lastLocationCoor == undefined ? [43.0747,-89.3840] : [lastLocationCoor[0], lastLocationCoor[1]])
    // const [currentLocation, setCurrentLocation] = useState([route.params.LastSearched.split[0],route.params.LastSearched.split[1]])

    // const [currentLocation, setCurrentLocation] = useState()

    //The location of the user input in string
    const [locationQuery, setlocationQuery] = useState(LastSearchedLocation == undefined ? "Search Location ..." : LastSearchedLocation)
    //The data of the pins to acess a field its pinsData.item.field
    const [pinsData, setPinsData] = useState([])
    //Toggle to retrieve more properties
    const [retrieveMore, setRetrieveMore] = useState(true)
    //To indicate if user is searching or not
    const [searching, setSearching] = useState(false)
    //Access the fields by selectedPin.item.name
    const [selectedPin, setSelectedPin] = useState([])
    //Page number of properties shown, it is called in load more properties, hence initial 1 
    const [propertyPage, setPropertyPage] = useState(1);
    //Controls the filter modal page
    const [filterModal, setFilterModal] = useState(false)
    //Array of properties shawn in loadProperties
    const [filteredProperties, setFilteredProperties] = useState(preloadProperties)
    //A modal that shows when location icon is pressed in property card
    const [propertyPreviewCard, setPropertyPreviewCard] = useState(false)
    //Loading indicator appears when true, signal new search result, so loadproperties is called
    const [flatlistRefreshing, setFlatlistRefreshing] = useState(false)
    //This is an array of [x,y], changes when user map around map
    const [mapCenterLocation, setMapCenterLocation] = useState(currentLocation)

    //Default filter vales 
    const [filterType, setfilterType] = useState('')
    const [filterSort, setfilterSort] = useState('')
    const [filterDistance, setfilterDistance] = useState(150)
    const [filterBedroom, setfilterBedroom] = useState("");
    const [filterBathroom, setfilterBathroom] = useState("");
    const [filterPriceLower, setfilterPriceLower] = useState(0);
    const [filterPriceHigher, setfilterPriceHigher] = useState(10000);
    const [filterAvailableFrom, setfilterAvailableFrom] = useState(new Date())
    const [filterAvailableTo, setfilterAvailableTo] = useState(new Date(1759190400000))
    const [filterAmenities, setfilterAmenities] = useState([])
    //Another useState var for price to improve performance because the slider is laggy
    const [filterPreviewValue, setfilterPreviewValue] = useState(10000)
    //Another usestate var for distance to improve performance because the slider is laggy
    const [filterPreviewDistanceValue, setfilterPreviewDistanceValue] = useState(150)
    //Toggles between true and false before and after a function call
    const [loading, setLoading] = useState(false)
    //Toggle the screen when searchbar is onPress
    const [discoverSearchVisible, setDiscoverSearchVisible] = useState(false)

    const [notifModalVisible, setNotifModalVisible] = useState(false)

    useEffect(()=>{

        setFlatlistRefreshing(true)
        //Loading initial batch of properties
        loadProperty()
        // Loading the pins on the map with default values
        retrieveAllPins(currentLocation[0], currentLocation[1], filterDistance, filterPriceHigher, filterBedroom, filterBathroom, filterType, filterAmenities, filterAvailableFrom, filterAvailableTo)
        //Reset selected pin and preview card visibility
        setPropertyPreviewCard(false)
        setSelectedPin([])
        // clearData()
        //Disable loading indicator
        let timer1 = setTimeout(() => setFlatlistRefreshing(false), 2000);
        // this will clear Timeout
        // when component unmount like in willComponentUnmount
        // and show will not change to true

        // clearData()
        return () => {
            clearTimeout(timer1);
        };
    },[currentLocation])

    async function clearData (){
        await EncryptedStorage.removeItem("lastSearchedLocation")
        await EncryptedStorage.removeItem("lastSearchedCoor")
    }



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

    //Open the preview card when the map button on the propertycard in flatlsit is pressed 
    function openPreviewCard(){
        RNAnimated.spring(opacityTranslation,{
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
        RNAnimated.spring(opacityTranslation,{
            toValue: 0,
            duration:300,
            bounciness:0,
            speed: 5,
            useNativeDriver:false,
        }).start()
        setPropertyPreviewCard(false)
    }

    //Load initial properties
    const loadProperty = useCallback(async ()=> {
        setPropertyPage(1)
        setRetrieveMore(true)
        setLoading(true)
        let s = "";
        if(filterType != ""){
            s = s + "&type=" + filterType;
        }
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

        await fetch('https://crib-llc.herokuapp.com/properties/query?page=0' + s, {
            method: 'GET',
            headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
            }
        }) 
        .then(async res =>{
            //Continue only with good status
            if(res.status == 200 || res.status == 201){
                properties = await res.json()
                properties.forEach(async propData => {
                    let imgList = propData.propertyInfo.imgList
                    imgList.forEach(async element => {
                        await Image.prefetch(element)
                    });
                    
    
                });

                //This is when there is no properties in the area and user's notification is not set up 
                let curTime = new Date();
                if(properties.length == 0){
                    let lastNotificationPrompTime = await EncryptedStorage.getItem("notificationPromptTime");
                    console.log("lastNotificationPrompTime ", lastNotificationPrompTime)
                    // EncryptedStorage.setItem("notificationPromptTime",new Date(lastNotificationPrompTime).getTime().toString());


                    let daysApart = lastNotificationPrompTime == undefined ? null : (curTime.getTime() - lastNotificationPrompTime.toString()) / (1000*60*60*24);
                   
                    let device = await OneSignal.getDeviceState();
                    console.log(daysApart)
                    if((!device.isSubscribed && daysApart > 0.5) || daysApart == null){
                       
                        setNotifModalVisible(true)
                        EncryptedStorage.setItem("notificationPromptTime",new Date().getTime().toString());
                    }
                    // EncryptedStorage.removeItem("notificationPromptTime")
                }
                setFilteredProperties(properties)
                setLoading(false)
            }
            else{
                alert("Error occured in load")
                setLoading(false)
            }
        })
        .catch(e=>{
            alert("Error occured")
            console.log("ERROR --- DISCOVER --- loadProperty")
        })
        
       
    },[currentLocation])

    //Load more properties when threshold is reached in propertycard page
    const loadMoreProperties = async() => {
        if(retrieveMore){
            setPropertyPage(propertyPage+1);
        }
        let s = "";
        if(filterType != ""){
            s = s + "&type=" + filterType;
        }
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

        if(propertyPage != 0){
            await fetch('https://crib-llc.herokuapp.com/properties/query?page=' + propertyPage + s, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
                }
            }) 
            .then(async res => {
                
                //Continue with good status
                if(res.status == 200 || res.status == 201){
                    const properties = await res.json();
                    if(properties.length == 0){
                        setRetrieveMore(false)
                        return;
                    }
                    setFilteredProperties([...filteredProperties,...properties])
                }
                else{
                    console.log("ERROR --- DISCOVER --- loadMoreProperties")
                }
            })
            .catch(e=>{
                console.log("ERROR --- DISCOVER --- loadMoreProperties")
            })   
        }   
    }

    async function retrieveAllPins(lat, long, distance, price, bed, bath, type, amens, from, to ){
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

        await fetch(`https://crib-llc.herokuapp.com/properties/pins?${s}` , {
            method: 'GET',
            headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
            }
        }) 
        .then(async res => {
            
            if(res.status == 200 || res.status == 201){
                const pins = await res.json();
                setPinsData(pins) 
            }
            else{
                alert("Error in pins")
                console.log("ERROR --- DISCOVER --- retrieveAllPins")
            }
            
        })
        .catch(e=>{
            console.log("ERROR --- DISCOVER --- retrieveAllPins")
        })
    }

    //Move to the center the view property  
    //Input is an array [lat, long]
    //If only currentLocation is vlaid data, then center the mapview to current location
    //If both the currentLocation and the pinLocation is valid, then use delta to adjust mapview
    function moveMap(lat,long, marker){ 
        if(currentLocation != ""){
            mapRef.current?.animateToRegion({
                latitude: lat,
                longitude: long,
                latitudeDelta: marker != undefined ? 0.002 : 0.04,
                longitudeDelta: marker != undefined ? 0.002 : 0.04,
            })
        }
    }

    //Move to the center of the selected location from search input
    //Set currentLocation 
    //Move the map to the current location 
    //Empty the autocomplete locations 
    //setSearching to false so to shrink the header
    //Dismiss keyboard
    async function selectCurrentLocation(locationQueryName){

        const deviceState = await OneSignal.getDeviceState();
        
        if (locationQueryName != ""){
            setlocationQuery(locationQueryName)
            setSearching(false)
            
            let spacelessLocation = locationQueryName;
            var config = {
                headers:{
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                // method: 'get',
                // url: `https://crib-llc.herokuapp.com/autocomplete/geocoding?address=${spacelessLocation}`,
                // body:JSON.stringify({
                //     userId: USERID,
                //     oneSignalID: deviceState.userId
                // }),
              
                
            };

            axios.get(`https://crib-llc.herokuapp.com/autocomplete/geocoding?address=${spacelessLocation}`,{
                params: {
                    oneSignalID: deviceState.userId,
                    userId: USERID,
                }
            }, config)
            .then(async (response)=> {        
                console.log(response.status)   
                if(response.status == 200 || response.status == 201){
                    let lat = response.data.lat;
                    let long = response.data.lng;
                    let s = lat + "," + long
                  
                    await EncryptedStorage.setItem("lastSearchedCoor", s);
                   
                    setCurrentLocation([lat,long])
                    moveMap(lat - 0.005, long)
                }
                else{
                  
                    console.log("ERROR --- DISCOVER --- selectCurrentLocation")
                }
            })
            .catch(e=>{
                console.log("ERROR (CATCH) --- DISCOVER --- selectCurrentLocation")
            });
        }
    }

    //Input: Lat1 Long1 Lat2 Long2
    //Output: Distance in miles
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

    //Function to move map to selected property on map when the location icon is pressed
    //Open the preview card modal 
    async function onMarkerClick(item){
        
        if(item.postedBy == null){
            moveMap(item.loc.coordinates[1] , item.loc.coordinates[0], false)
            //Toggle previewCard modal, but the opcaity is 0 when opened 
            setPropertyPreviewCard(true)
            //Function that animates the opcaity of preview caed
            openPreviewCard()
        
            let propertyInfo = item

            setSelectedPin({propertyInfo})
        }
        else{
            if(item != null && item != undefined){
                await fetch('https://crib-llc.herokuapp.com/properties/' + item._id, {
                method: 'POST',
                headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
                },
               
                }) 
                .then(async res =>  {
                   
                    const property = await res.json();
                    if(res.status == 200){
                        if(property != null && property != undefined && property.propertyInfo.deleted == false){
                            moveMap(item.loc.coordinates[1] - 0.0005, item.loc.coordinates[0], false)
                            //Toggle previewCard modal, but the opcaity is 0 when opened 
                            setPropertyPreviewCard(true)
                            //Function that animates the opcaity of preview caed
                            openPreviewCard()
                            setLoading(false)
                            setSelectedPin(property)
                        }
                        else if(property.propertyInfo.deleted == true){
                            console.log("ERROR --- DISCOVER --- onMarkerClick")
                            setLoading(false)
                        }
                    }
                    else{
                        console.log("ERROR --- DISCOVER --- onMarkerClicks")
                        setLoading(false)
                    }
                })
                .catch(e=>{
                    console.log("ERROR --- DISCOVER --- onMarkerClick")
                    setLoading(false)
                })
            }
        }
    }

    //Input is the lat and long location 
    //Output is the google map location query formatted
    async function updateQueryString (loc){
        var config = {
            method: 'get',
            url: `https://crib-llc.herokuapp.com/autocomplete/reversegeocoding?lat=${loc[0]}&long=${loc[1]}`,
        };
        await axios(config)
        .then(async (response)=> {   
            if(response.status == 200 || response.status == 201){
                setlocationQuery(response.data.formatted_address)
            }
            else{
                console.log("ERROR --- DISCOVER --- updateQueryString")
            }
        })
        .catch(function (error) {
            console.log("ERROR (CATCH) --- DISCOVER --- updateQueryString")
        });
    }

    return(
        <GestureHandlerRootView style={{flex: 1}}>

            <SafeAreaView style={{flex: 1}}>
                {/* This is the container for the whole map background in discover behind search bar */}
                {/* Includes the Search Here pressable, map view, markers and preview modal */}
                <MapContainer>
                    <MapView
                        onRegionChange={(Region)=> setMapCenterLocation([Region.latitude,Region.longitude])}
                        ref={mapRef}
                        style={{flex:1, position:'relative'}}
                        initialRegion={{
                        latitude: Number(currentLocation[0]), 
                        longitude: Number(currentLocation[1]),
                        latitudeDelta: 0.02,
                        longitudeDelta: 0.02,
                        }}
                    >
                        <Marker
                            key={"currentlocationmarker"}
                            coordinate={{ latitude:Number(currentLocation[0]), longitude: Number(currentLocation[1]) }}
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
                        
                    {/* When pressed this moves the current location to center of the map and load properties */}
                    < SearchHerePressable hitSlop={WIDTH*0.05} onPress={()=>{setCurrentLocation(mapCenterLocation), updateQueryString(mapCenterLocation),
                    retrieveAllPins(currentLocation[0], currentLocation[1], filterDistance, filterPriceHigher, filterBedroom, filterBathroom, filterType, filterAmenities, filterAvailableFrom.getTime(), filterAvailableTo.getTime() )
                    }}>
                        <SearchHereText>Search Here</SearchHereText>
                    </ SearchHerePressable>

                    {/* This is the container for the preview modal/card */}
                    <RNAnimated.View 
                    style={{width:WIDTH*0.9, height: HEIGHT*0.275,backgroundColor:'white', borderRadius:25,
                    position:'absolute', bottom: HEIGHT*0.17, alignSelf:'center',shadowColor: 'black', shadowRadius: 5,
                    shadowOpacity: 0.4, elevation: 5, display: propertyPreviewCard ? 'flex' : 'none',
                    opacity: opacityTranslation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 1],
                    })}}>
                            {/* Checks if any pin is selected for displaying in the preview card */}
                        {selectedPin != "" && selectedPin != null && selectedPin != undefined &&
                        <Pressable disabled={loading}  hitSlop={WIDTH*0.05} onPress={()=>{ navigation.navigate("PropertyDetail", {data: selectedPin, uid: USERID, distance: Math.round(getDistanceFromLatLonInMiles(currentLocation[0],currentLocation[1],selectedPin.propertyInfo.loc.coordinates[1], selectedPin.propertyInfo.loc.coordinates[0])), scraped: selectedPin.propertyInfo.postedBy == null ? true : false})}}>
                            <PreviewTopContainer>
                                <Image source={{uri:selectedPin.propertyInfo.imgList[0]}} style={{width:WIDTH*0.9, height: '100%',borderTopLeftRadius:25, 
                                borderTopRightRadius:25, backgroundColor: LIGHTGREY, }}/>
                            </PreviewTopContainer>

                            <PreviewBottomContainer >
                                <PreviewLocationText>{selectedPin.propertyInfo.loc.secondaryTxt}</PreviewLocationText>
                                <PreviewdetailsText>{selectedPin.propertyInfo.bed} Bed  •  {selectedPin.propertyInfo.bath} Bath</PreviewdetailsText>
                                
                                <DatePriceContainer>
                                    <PreviewdetailsText>
                                        {
                                            new Date(selectedPin.propertyInfo.availableFrom).toDateString().split(" ")[1] + " " +
                                            new Date(selectedPin.propertyInfo.availableFrom).toDateString().split(" ")[3]
                                        }  
                                        {"  "}-{"  "}
                                        {
                                            new Date(selectedPin.propertyInfo.availableTo).toDateString().split(" ")[1] + " " +
                                            new Date(selectedPin.propertyInfo.availableTo).toDateString().split(" ")[3]
                                        }
                                    </PreviewdetailsText>

                                    <PreviewPriceText>${selectedPin.propertyInfo.price} / month</PreviewPriceText>

                                </DatePriceContainer>
                            </ PreviewBottomContainer> 
                        </Pressable>
                        }

                        <FontAwesome  hitSlop={WIDTH*0.05} onPress={()=>closePreviewCard()} name="times-circle" size={30}  color='white' style={{position: 'absolute', right:WIDTH*0.03,
                        top: HEIGHT*0.015}}/>
                    </RNAnimated.View>
                </MapContainer>
                    
                {/* This sets the container of the search input */}
                <SearchContainer  onPress={()=>setDiscoverSearchVisible(true)}>
                    {/* The search icon on the search outlien */}
                    <SeachIconContainer>
                        <Ionicons name='search' size={25}  color='black' />
                    </SeachIconContainer>
                    
                    {/* Placeholder for locationquerytext selected in discoversearch */}
                    
                    <SearchContainerPlaceholderText numberOfLines={1} locationQuery={locationQuery}> {locationQuery}</SearchContainerPlaceholderText>

                    {/* This is the icon for filters when locationquery is not empty  */}
                    <DeleteIconContainer hitSlop={WIDTH*0.025} onPress={()=> setFilterModal(true)} style={{display: (!searching && locationQuery != "") ? 'flex' : 'none', }} >
                        {(filterType != ''  || filterDistance != 150 || filterBedroom !=="" || filterBathroom != "" || filterPriceLower != 0 || filterPriceHigher != 10000 || filterAmenities.length != 0) || !(dateCompare(new Date(1759190400000), new Date(filterAvailableTo))) || !(dateCompare(new Date(), new Date(filterAvailableFrom)))?
                        <FilterAppliedIconBackground>
                            <Ionicons name="options-sharp" size={20} />
                        </FilterAppliedIconBackground>
                        :
                        <NoFilterAppliedIconBackground>
                            <Ionicons name="options-sharp" size={20} />
                        </NoFilterAppliedIconBackground>                        
                        }
                    </DeleteIconContainer> 
                </SearchContainer>
                
                {/* View component to seperate the search bar and the propertycard */}
                <View style={{width:WIDTH, height:HEIGHT*0.05}}/>

                {/* Property Cards*/}       
                <PropertyCard index={0} navigation={navigation} length={pinsData.length} userId={USERID}
                loadMoreProperties={loadMoreProperties} filteredPropertiesData={filteredProperties} 
                flatlistRefreshing={flatlistRefreshing} mapRef={mapRef} onMarkerClick={onMarkerClick} currentLocation={currentLocation} moveMap={moveMap}
                setSelectedPin={setSelectedPin} openPreviewCard={openPreviewCard} locationQuery={locationQuery} searching={searching} loading={loading}/>

                {/* Filter screen when filter icon is pressed */}
                <DiscoverFilterScreen open={filterModal} close={()=>setFilterModal(false)} retrieveAllPins={retrieveAllPins}
                currentLocation={currentLocation} setFilteredProperties={setFilteredProperties} setPropertyPage={setPropertyPage} setRetrieveMore={setRetrieveMore}
                filterType={filterType} setfilterType={setfilterType} filterSort={filterSort} setfilterSort={setfilterSort} filterDistance={filterDistance}
                setfilterDistance={setfilterDistance} filterBedroom={filterBedroom} setfilterBedroom={setfilterBedroom} filterBathroom={filterBathroom}
                setfilterBathroom={setfilterBathroom} filterPriceLower={filterPriceLower} setfilterPriceLower={setfilterPriceLower}
                filterPriceHigher={filterPriceHigher} setfilterPriceHigher={setfilterPriceHigher} filterAmenities={filterAmenities}
                setfilterAmenities={setfilterAmenities} filterPreviewValue={filterPreviewValue} setfilterPreviewValue={setfilterPreviewValue}
                filterPreviewDistanceValue={filterPreviewDistanceValue} setfilterPreviewDistanceValue={setfilterPreviewDistanceValue}
                filterAvailableFrom={filterAvailableFrom} setfilterAvailableFrom={setfilterAvailableFrom}
                filterAvailableTo={filterAvailableTo} setfilterAvailableTo={setfilterAvailableTo} 
                loadProperty={loadProperty} setFlatlistRefreshingTrue={()=>setFlatlistRefreshing(true)} setFlatlistRefreshingFalse={()=>setFlatlistRefreshing(false)}
                />

                {/* Search screen when the search bar is pressed */}
                <DiscoverSearchScreen open={discoverSearchVisible} close={()=> setDiscoverSearchVisible(false)} selectCurrentLocation={selectCurrentLocation}/>
                <TouchableWithoutFeedback>
                    <NotificationModal notifModalVisible={notifModalVisible} close={()=>setNotifModalVisible(false)}/>
                </TouchableWithoutFeedback>
            </SafeAreaView>  
        </GestureHandlerRootView>
    )
}
import React, { useState, useEffect, useRef } from 'react';

import {
    SafeAreaView,
    ScrollView,
    Text,
    View,
    Keyboard,
    Image,
    Animated,
    Pressable,
    FlatList,
    TouchableOpacity,
    TouchableHighlight,
    ActivityIndicator
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';


//Icons
import Ionicons from 'react-native-vector-icons/Ionicons';
Ionicons.loadFont()
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import DatePicker from 'react-native-date-picker'

import SecureStorage, { ACCESS_CONTROL, ACCESSIBLE, AUTHENTICATION_TYPE } from 'react-native-secure-storage'

import ImagePicker from 'react-native-image-crop-picker';

import Lottie from 'lottie-react-native';




FontAwesome.loadFont();

const ImageName = [
    { name: "Bedroom", des: "Please upload an image of tenant's bedroom.", icon: "bed-outline" },
    { name: "Bathroom", des: "Please upload an image of tenant's bathroom.", icon: "water-outline" },
    { name: "Living Room", des: "Please upload an image of common/shared space." , icon: "tv-outline"},
    { name: "Kitchen", des: "Please upload an image of kitchen/cooking area." , icon: "fast-food-outline"},
    { name: "Floor Plan", des: "Please upload an image of property floor plan.", icon: "logo-stackoverflow" },
]


const bedroomList = ["Studio", "1" , "2", "3", "4P"]
const bathroomList = ["1", "2", "3", "4P"]


//Posting Pages
const LANDINGPOSTINGPAGE = 0;
const PROPTYPEPAGE = 1;
const PROPADDRESSPAGE = 2;
const PROPLOCATIONDETAILPAGE = 3;
const PROPGALLERYPAGE = 4;
const PROPPRICEPAGE = 5;










import {
    ModalView, Heading, ButtonContainer, ImageContainer, NextContainer, InfoText, PostingSection, InfoTextSection2, SearchContainer, SearchInput, Subheading,
    InputContainer, DateSelectContainer, DateContainer, DateSelectPressable, BedBathInput, AmenitiesContainer,
    PropertyPhotoContainer, PhotoContainer, PropertyDescriptionInput, Divider, ReviewInfoText, ReviewSectionContainer,
    BedAndBathContainer, BedBathLogo, LocationText, ReviewPropertyDescriptionInput, Footer, ContactTanentButton,
    PricePerMonth, PropertyTypeCard, PriceInputSearchContainer, CategoryName, RowContainer, RowValueContainer, RowName,
    FollowUpContainer, FollowUpText, DateCategoryName, BedroomContaienr, BedroomItemContainer, RowContainerCol,
    ReviewHeading, ReviewLocationContainer, ReviewDateContainer, ImageSelectionContainer, ImageText, CribText,
    ContinueText, MaxText, StreetAddrInput,LocationDetailContainer,LocationDetailName, StreetAddrHalfInput
} from './discoverPropertyPostingStyle';
import Easing from 'react-native/Libraries/Animated/Easing';
import { DARKGREY, LIGHTGREY, MEDIUMGREY, GetAmenitiesIcon, amenitiesList, HEIGHT, WIDTH, PRIMARYCOLOR, ContinueButton, GetFAIcons} from '../../../sharedUtils';
import { SubHeadingText } from '../../Onboarding/Landing/landingStyle';


export default function PropertyPostingScreen({ navigation }) {

    const flatListdata =
        [{ name: "Room", image: require('../../../assets/room.jpg'), description: "Shared public space" },
        { name: "House", image: require('../../../assets/house.jpg'), description: "Entire House" },
        { name: "Apartment", image: require('../../../assets/apartment.jpg'), description: "2+ Bedroom Apartment" },
        { name: "Studio", image: require('../../../assets/studio.jpg'), description: "Open-styled apartment" }
    ]

    //Posting data information 
    const [propertyType, setpropertyType] = useState('')
    const [propertyLocation, setpropertyLocation] = useState('')
    const [propertyphotoGallery, setpropertyphotoGallery] = useState([])
    const [propertyMainAddr, setpropertyMainAddr] = useState('')
    const [propertySecondaryAddr, setpropertySecondaryAddr] = useState('')
    const [propertydateFrom, setpropertydateFrom] = useState(null)
    const [propertydateTo, setpropertydateTo] = useState(null)
    const [propertyNumBed, setpropertyNumBed] = useState('');
    const [propertyNumBath, setpropertyNumBath] = useState('');
    const [propertyPrice, setpropertyPrice] = useState('');
    const [propertyDescription, setpropertyDescription] = useState('')
    const [propertyAmenities, setpropertyAmenities] = useState([])
    const [propertyPriceNego, setPropertyPriceNego] = useState(false)

    //Property Details
    const [propertyLocationStreetNumber, setPropertyLocationStreetNumber] = useState("")
    const [propertyLocationStreet, setPropertyLocationStreet] = useState("")
    //Number and street combined
    const [propertyLocationNumberStreet, setPropertyLocationNumberStreet] = useState("")
    const [propertyLocationCity, setPropertyLocationCity] = useState("")
    const [propertyLocationState, setPropertyLocationState] = useState("")
    const [propertyLocationPostalCode, setPropertyLocationPostalCode] = useState("")
    const [locationDetailsChanged, setLocationDetailsChanged] = useState(false)


    const [propertyBedroomImage, setPropertyBedroomImage] = useState(null)
    const [propertyBathroomImage, setPropertyBathroomImage] = useState(null)
    const [propertyLivingroomImage, setPropertyLivingroomImage] = useState(null)
    const [propertyKitchenImage, setPropertyKitchenImage] = useState(null)
    const [propertyFloorplanImage, setPropertyFloorPlanImage] = useState(null)
    const [locationPressed, setLocationPressed] = useState(false)
    const [latLong, setLatLong] = useState([])
    const [fetching, setFetching] = useState(false)

    const [loading, setLoading] = useState(false)

    //Sets DatePicker Modal Visibility
    const [openFrom, setOpenFrom] = useState(false)
    const [openTo, setOpenTo] = useState(false)

    //Type      - useRef(number), useState(number), function
    //Control the flow of the property posting scrollview 
    const scrollView = useRef();
    const [scrollviewIndex, setscrollviewIndex] = useState(0)


    //Control Opacity when scrolling 
    const OpacityTranslation = useRef(new Animated.Value(1)).current;
    const TopContainerTranslation = useRef(new Animated.Value(HEIGHT * 0.1)).current;

    /**
     * 0 : Landing page: start subleasing 
     * 1 : Enter type of sublease 
     * 2 : Enter the address of the sublease 
     * 3 : Location details
     * 4 : Image Gallery 
     * 5 : Sublease price 
     * 6 : Sublease description
     * 7 : Availability 
     * 8 : Property Detail (Bedrooms and bathrooms)
     * 9 : Amenities
     * 10: One last step! 
     * 11: Review 
    */

    /**
     * Function - moves the horizontal scrollview to the appropreiate page
     * Input - An index indicating which the NEXT page to scroll to
     */
    function moveScrollView(val) {
        // console.log("The current page is: " + val);
        // console.log("main addr: " + propertyMainAddr)
        // console.log("secondary addr: " + propertySecondaryAddr)
        // console.log("Street : " + propertyLocationStreet)
        // console.log("latlong : " + latLong[0])
        Keyboard.dismiss()
       
        /**
         * propertyLocation: address that the user input on page 2
         * findLocationDetail: find components of address withthe given input
         */
        // if(val == 3 && !locationDetailsChanged){
        //     //If user didn't input a location
        //     console.log("hello")
        //     if(propertyLocation== ""){
        //         alert("Must enter property location.")
        //         return;
        //     }
        //     findLocationDetail(propertyLocation);
        // }

        /**
         * Function - check if the user has changed the recommended address input
         * Input - the locationdetailschanged varaible
         */
        // if(locationDetailsChanged){
        //     if(propertyLocationNumberStreet.trim() == ""){
        //         alert("Street Address cannot be empty.");
        //         return;
        //     }
        //     else if(propertyLocationCity.trim() == ""){
        //         alert("City cannot be empty.");
        //         return;
        //     }
        //     else if(propertyLocationState.trim() == ""){
        //         alert("City cannot be empty.");
        //         return;
        //     }
        //     else if(propertyLocationPostalCode.trim() == ""){
        //         alert("Postal code be empty.");
        //         return;
        //     }
        //     console.log("User changed the loation details")
        //     let queryString = "";
            
        //     queryString += propertyLocationNumberStreet + " ";
        //     queryString += propertyLocationCity + " ";
        //     queryString += propertyLocationState + " ";

        //     console.log("The changed address is: " + queryString);

        //     //The complete street Address
        //     console.log ("the message is: " + findLocationDetail(queryString));
        //     setpropertyLocation(queryString)
        //     setLocationDetailsChanged(false)
           
        // }
    
        //When user press return when on landing page
        if (val < LANDINGPOSTINGPAGE) {
            navigation.goBack();
        }

        //Test to check if user inputed the property type before going to address page
        if(val == PROPADDRESSPAGE){
            if(propertyType == ""){
                alert("Must select a property type.")
                return;
            }
        }
        
        //Test to check if the user input of address is empty before going to location detail
        if(val == PROPLOCATIONDETAILPAGE){
            if(propertyLocation.trim() == ""){
                alert("Must enter property location.")
                return;
            }

            //This autofills the location details
            findLocationDetail(propertyLocation);
        }

        if(val == PROPGALLERYPAGE && locationDetailsChanged){

            //True if all inputs are non-empty else, return false
            let result = checkLocationDetails();

            if(!result){
                return;
            }

            findFormattedLocation();
            
        }



        // if(val == 4 && (propertyLocationNumberStreet.trim() == "" || propertyLocationCity.trim() == "" || propertyLocationState.trim() == "" ||
        //     propertyLocationPostalCode == "")){
        //     console.log("Something is wrong");
        //     console.log(propertyLocationNumberStreet == "");
        //     if(propertyLocationNumberStreet.trim() == ""){
        //         alert("Street Address cannot be empty.");
        //     }
        //     else if(propertyLocationCity.trim() == ""){
        //         alert("City cannot be empty.");
        //     }
        //     else if(propertyLocationState.trim() == ""){
        //         alert("City cannot be empty.");
        //     }
        //     else if(propertyLocationPostalCode.trim() == ""){
        //         alert("cannot be empty.");
        //     }
        //     else{
        //         console.log("oops")
        //     }
        // }
        if(val == 5 && (propertyBathroomImage == null || propertyBathroomImage == null ||
            propertyLivingroomImage == null || propertyKitchenImage == null)){
                if(propertyBedroomImage == null){
                    alert("Must select Bedroom Image.")
                }
                else if(propertyBathroomImage == null){
                    alert("Must select Bathrrom Image.")
                }
                else if(propertyKitchenImage == null){
                    alert("Must select Kitchen Image.")
                }
                else if(propertyLivingroomImage == null){
                    alert("Must select Livingroom Image.")
                }
        }
        if(val == 6 && (propertyPrice == "" || parseInt(propertyPrice.split("$")[1]) > 10000)){
            if(propertyPrice == ""){
                alert("Must enter property price.")
            }
            else{
                alert("Property price must be less than $10000 / month.")
            }
        }
        if(val == 8 && propertydateFrom == null){
            alert("Must enter property availability start date.")
        }
        if(val == 8 && propertydateTo == null){
            alert("Must enter property availability end date.")
        }
        else {
            while(fetching){}
            setscrollviewIndex(val)
            
            propertyAmenities.forEach(element => {
                console.log(element)
            });
            setTimeout(() => {
                scrollView.current.scrollTo({ x: WIDTH * val });
                setscrollviewIndex(val)
            }, 100)
            return
        }

    }

    function checkLocationDetails(){
        if(propertyLocationNumberStreet.trim() == ""){
            alert("Street Address cannot be empty.");
            return false;
        }
        else if(propertyLocationCity.trim() == ""){
            alert("City cannot be empty.");
            return false;
        }
        else if(propertyLocationState.trim() == ""){
            alert("City cannot be empty.");
            return false;
        }
        else if(propertyLocationPostalCode.trim() == ""){
            alert("Postal code cannot be empty.");
            return false;
        }
        else{
            return true;
        }   
    }

    function findFormattedLocation(){
        console.log("Finding formatted address")
        let query = propertyLocationNumberStreet + " " + propertyLocationCity + " " + propertyLocationState;
        console.log(query)
        var config = {
            method: 'get',
            url: `https://crib-llc-dev.herokuapp.com/autocomplete/geocoding?address=${query}`,
        };
        axios(config)
        .then(async (locInfo)=> {           
           console.log(locInfo.data)

        })
        .catch(function (error) {
            
            console.log(error);
        });

    }

    function SelectLocationSequence() {

        Animated.sequence([
            Animated.spring(TopContainerTranslation, {
                toValue: 0,
                bounciness: 0,
                useNativeDriver: false,
            }),

        ]).start()
    }


    //Type     - String 
    //Function -  the Big profile image when selecting images to upload. Default to propertyphotoGallery[0] if not null
    const [headerImage, setHeaderImage] = useState()

    //Type      - Array, Function for autocomplete
    //Function  - Stroes the autocomplete locations when user type in input 
    const [autocompleteLocation, setautocompleteLocation] = useState([]);
    var axios = require('axios');

    function autocomplete(query) {
        if (query == "") {
            setautocompleteLocation([]);
        }
        setpropertyLocation(query);
        if (query != "" && query.length % 2 == 0) {
            var config = {
                method: 'get',
                url: `https://crib-llc-dev.herokuapp.com/autocomplete/places/${query}`,
            };
            axios(config)
            .then(function (response) {
                setautocompleteLocation([]);            
                for( let name of response.data){
                    setautocompleteLocation(prevArray => [...prevArray,name])   
                }        
            })
            .catch(function (error) {
                console.log(error);
            });
        }
    }

    //Render individual card items for PropertyType in posting page
    const renderItem = ({ item, index }) => (
        <Pressable hitSlop={WIDTH*0.05} onPress={() => setpropertyType(item.name)}
            style={{ width: WIDTH * 0.9, height: WIDTH * 0.2, backgroundColor: propertyType == item.name ? PRIMARYCOLOR : 'white', borderRadius: 15, marginLeft: HEIGHT * 0.01, marginTop: HEIGHT * 0.01, flexDirection: 'row' }}>

            <Image source={item.image} style={{ height: '100%', width: WIDTH * 0.45, borderBottomLeftRadius: 15, borderTopLeftRadius: 15 }} />

            <View style={{ height: '100%', width: WIDTH * 0.45, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ alignSelf: 'center', fontWeight: '700', color: propertyType == item.name ? 'white' : 'black' }}>{item.name}</Text>
                <Text style={{ color: propertyType == item.name ? 'white' : DARKGREY }}>{item.description}</Text>
            </View>
        </Pressable>
    );

    function updateAmenities(name) {

        if (propertyAmenities.indexOf(name) != -1) {
            let tempindex = propertyAmenities.indexOf(name);
            setpropertyAmenities([...propertyAmenities.slice(0, tempindex), ...propertyAmenities.slice(tempindex + 1, propertyAmenities.length)])
        }
        else {
            setpropertyAmenities(prev => [...prev, name]);
        }
    }

    async function postproperty() {
        setLoading(true)
        console.log("Posting")
        const accessToken = await SecureStorage.getItem("accessToken");
        console.log(propertyphotoGallery);
        const postingData = new FormData();

        postingData.append("type", propertyType);                       //String 
        postingData.append("streetAddr", propertyMainAddr);               //String 
        postingData.append("secondaryTxt", propertySecondaryAddr);               //String 
        postingData.append("latitude", latLong[0])
        postingData.append("longitude", latLong[1])
        //String Array

        var array = propertyBedroomImage.split(".");

        postingData.append("propertyImages", {
            uri: propertyBedroomImage,
            type: 'image/' + array[1],
            name: 'someName',
        });

        var array = propertyBathroomImage.split(".");
        postingData.append("propertyImages", {
            uri: propertyBathroomImage,
            type: 'image/' + array[1],
            name: 'someName',
        });
        var array = propertyLivingroomImage.split(".");

        postingData.append("propertyImages", {
            uri: propertyLivingroomImage,
            type: 'image/' + array[1],
            name: 'someName',
        });

        var array = propertyKitchenImage.split(".");

        postingData.append("propertyImages", {
            uri: propertyKitchenImage,
            type: 'image/' + array[1],
            name: 'someName',
        });

        if(propertyFloorplanImage!= null){
            var array = propertyFloorplanImage.split(".");
            postingData.append("propertyImages", {
                uri: propertyFloorplanImage,
                type: 'image/' + array[1],
                name: 'someName',
            });
        }


        postingData.append("price", propertyPrice.split("$")[1]);                     //String 
        postingData.append("description", propertyDescription);         //String 
        postingData.append("availableFrom", propertydateFrom.getTime());          //String
        postingData.append("availableTo", propertydateTo.getTime());              //String
        postingData.append("bed", propertyNumBed);                      //String
        postingData.append("bath", propertyNumBath);                    //String 
        postingData.append("title", "Name");                    //String
        // postingData.append("propertyAmenities", propertyAmenities);     //Array of String 
        postingData.append("timePosted", new Date())
        propertyAmenities.forEach(element => {
            postingData.append("amenities", element);
        });

       
        if(accessToken != null){
            fetch('https://crib-llc-dev.herokuapp.com/properties', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'multipart/form-data',
                    'Authorization': 'bearer ' + accessToken
                },
                body: postingData,
            })
            .then((response) => response.json()).then( async data => {
                console.log("RESPONSE", data)
                await SecureStorage.removeItem("postedProperty")
                setTimeout(()=>{
                    navigation.goBack()
                    setLoading(false)
                    console.log(data)
                },1500)
            })
            .catch(e => {
                alert(e)
            })
        }
        else{
            console.log("ERROR --- DISCOVERPOSTING -- POSTPROPERTY")
        }
      
    }

    async function selectGallery(name) {
        console.log(name)
        ImagePicker.openPicker({
            width: 600,
            height: 600,
            cropping:true,
            compressImageQuality: 0.7
            
          }).then(image => {
            console.log(image.path)
            if (name == "Bedroom") {
                setPropertyBedroomImage(image.path);
            }
            else if (name == "Bathroom") {
                setPropertyBathroomImage(image.path);
            }
            else if (name == "Living Room") {
                setPropertyLivingroomImage(image.path);
            }
            else if (name == "Kitchen") {
                setPropertyKitchenImage(image.path);
            }
            else if (name == "Floor Plan") {
                setPropertyFloorPlanImage(image.path);
            }

        }).catch((e)=>{
            console.log(e)
        })


    }

    function updateImages(index) {
        setHeaderImage(propertyphotoGallery[index]);
    }
    const startingvalue = HEIGHT * 0.1;
    const [expanded, setexpended] = useState(true)
    const heighttranslation = useRef(new Animated.Value(startingvalue)).current;
    useEffect(() => {
        testing();
        console.log("Useeffect")
        //   getTokens
    }, [expanded])


    function testing() {
        Animated.timing(heighttranslation, {
            toValue: expanded ? startingvalue : 0,
            duration: 300,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
        }).start()
    }

    function moveOn(value) {
        console.log(value)
        console.log("fefefwewf", value.description)
        setLocationPressed(true)
        Keyboard.dismiss()
        // if(value.results == undefined){
        //     setpropertyLocation("")
        //     alert("Invalid Address")
        // }
        // else{
            setpropertyLocation(value.description)
            setpropertyMainAddr(value.structured_formatting.main_text)
            setpropertySecondaryAddr(value.structured_formatting.secondary_text)
            LocationToLatLong(value.description)
        // }
        
       
    }

    function formatPrice(price){
        if (price == ""){
            return;
        }
        let val = price.replace("$","")
        return "$" + val
    }

    async function LocationToLatLong(name){
        const accessToken = await SecureStorage.getItem("accessToken");
        if(accessToken != null && name != null && name != undefined){
            let spacelessLocation = name.replaceAll(" ", "+");
            var config = {
                method: 'get',
                url: `https://crib-llc-dev.herokuapp.com/autocomplete/geocoding?address=${name}`,
            };
            axios(config)
            .then(async (locInfo)=> {           
                setLatLong([locInfo.data.lat, locInfo.data.lng])

            })
            .catch(function (error) {
                
                console.log(error);
            });
        }
    }

    //https://maps.googleapis.com/maps/api/place/queryautocomplete/json?input=${query}&country:us&types=address&location=37.76999%2C-122.44696&radius=4000&strictbounds=true&key=${google_api_key}`

    function findLocationDetail(name){
        setFetching(true)
        let spacelessname = name.replaceAll("_","+")
        var config = {
            method: 'get',
            url: `https://maps.googleapis.com/maps/api/geocode/json?address=${spacelessname}&key=AIzaSyBbZGuUw4bqWirb1UWSzu9R6_r13rPj-eI`,
        };
        axios(config)
        .then(async (locInfo)=> {   
            console.log("LINE 569", locInfo.data); 

            if(locInfo.data.status == "ZERO_RESULTS"){
                console.log("Inside location details and cannot find any results");
                var config = {
                    method: 'get',
                    url: `https://maps.googleapis.com/maps/api/place/queryautocomplete/json?input=${spacelessname}&country:us&types=address&location=37.76999%2C-122.44696&radius=4000&strictbounds=true&key=AIzaSyBbZGuUw4bqWirb1UWSzu9R6_r13rPj-eI`,
                };
                axios(config)
                .then(async (locDetail)=> {
                    console.log("looping with " , locDetail.data.predictions[0].description.replaceAll(" ", "+"));
                   findLocationDetail(locDetail.data.predictions[0].description.replaceAll(" ", "+"))
                })
                .catch(function (error) {
                    console.log("ZERO_RESULTS CATCH")
                    console.log(error);
                    return -1;
                })
                
            }
            else{
                // console.log(locInfo.data.results[0].address_components)

                let streetNumber = "";
                let streetAddr = "";
                let city = "";
                let state = "";
                console.log(locInfo.data.results[0].geometry.location);
                setLatLong([locInfo.data.results[0].geometry.location.lat,locInfo.data.results[0].geometry.location.lng])
                locInfo.data.results[0].address_components.forEach(element => {
                    //    console.log(element.types + "    " + element.long_name)
        
                    if(element.types.indexOf("street_number") != -1){
                        // console.log("Street number: " + element.long_name);
                        streetNumber = element.long_name;
                        setPropertyLocationStreetNumber(element.long_name)
                    }
                    else if(element.types.indexOf("route") != -1){
                        // console.log("Route: " + element.long_name);
                        streetAddr = element.long_name;
                        setPropertyLocationStreet(element.long_name)
                    }
                    else if(element.types.indexOf("locality") != -1){
                        // console.log("City: " + element.long_name);
                        city = element.long_name;
                        setPropertyLocationCity(element.long_name)
                    }
                    else if(element.types.indexOf("administrative_area_level_1") != -1){
                        // console.log("State: " + element.long_name);
                        state = element.short_name;
                        setPropertyLocationState(element.long_name)
                    }
                    else if(element.types.indexOf("postal_code") != -1){
                        // console.log("Postal code: " + element.long_name);
                        setPropertyLocationPostalCode(element.long_name)
                    }
                });
                console.log(streetNumber + " " + streetAddr)
                setPropertyLocationNumberStreet(streetNumber + " " + streetAddr);
                setpropertyMainAddr(streetNumber + " " + streetAddr);
                setpropertySecondaryAddr(city + " " + state);




            }
            
        })
        .catch(function (error) {
            console.log("address is not right")
            console.log(error);
            return -1;
        });
        setFetching(false)
        return 1;
    }

    function FindGoogleMapLocationName(){

    }

   
    return (
        <SafeAreaView style={{ width: WIDTH, height: HEIGHT, margin: 0, padding: 0 }} >
            <TouchableOpacity disabled={loading} style={{paddingLeft:WIDTH*0.05}} onPress={()=>navigation.navigate("Profile")}>
                <Text style={{color: DARKGREY, fontWeight:'500'}}>Cancel Posting</Text>
            </TouchableOpacity>
            <ModalView>
                <ButtonContainer>
                    <Pressable disabled={loading} onPress={() => moveScrollView(scrollviewIndex - 1)} style={{ width: WIDTH * 0.1 }}>
                        <Ionicons name="arrow-back" size={30} color='white'></Ionicons>
                    </Pressable>
                    <Pressable disabled={fetching} style={{ display: scrollviewIndex == 10 || scrollviewIndex == 11 || scrollviewIndex == 0 ? 'none' : 'flex', }}
                    hitSlop={WIDTH*0.05} onPress={() => moveScrollView(scrollviewIndex + 1)}>
                        {
                            fetching ?
                            <ActivityIndicator size="small" color={PRIMARYCOLOR}/>
                            :
                            <Ionicons name="checkmark-outline" size={30} color={PRIMARYCOLOR}></Ionicons>
                        }
                    </Pressable>
                </ButtonContainer>
                <Animated.ScrollView keyboardShouldPersistTaps={'handled'}
                    style={{
                        opacity: OpacityTranslation.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, 1]
                        })
                    }}
                    scrollEnabled={false} horizontal snapToAlignment='end' decelerationRate='fast' snapToInterval={WIDTH} ref={scrollView} onTouchEnd={() => setexpended(true)} >
                    <PostingSection style={{ width: WIDTH, height: HEIGHT, alignItems: 'center', }}>
                        <Heading>Sublease your <CribText>Crib</CribText></Heading>
                        <InfoText>
                            We make subleasing as easy as possible.
                        </InfoText>
                        
                            <Lottie source={require('../../../postingfirstpage.json')}  autoPlay={scrollviewIndex == 0 ? true : false} loop style={{width:WIDTH*0.9, height: WIDTH*0.9, }}/>
                       

                    </PostingSection>

                    {/* Choose apartment type  */}
                    <PostingSection >
                        <Heading>Property Type</Heading>
                        <InfoText>
                            Please select one of the options
                        </InfoText>

                        <View style={{ marginTop: HEIGHT * 0.015 }}>
                            <FlatList key={() => flatListdata.name} data={flatListdata} renderItem={renderItem} />
                        </View>

                    </PostingSection>

                    {/* Select Address */}

                    <PostingSection >
                       
                            <Heading >Address of sublease </Heading>
                            <InfoText>
                                Enter your property address
                            </InfoText>
                            <InfoText>
                                (Don't include apartment number)
                            </InfoText>
                       
                        <SearchContainer>
                            <Ionicons name="search-outline" size={20} color='white' />
                            <SearchInput placeholderTextColor='white' 
                                onFocus={SelectLocationSequence} value={propertyLocation} onChangeText={(value) => setpropertyLocation(value)} placeholder="Location..." />
                        </SearchContainer>
                        <Animated.View style={{ width: WIDTH * 0.9, height: HEIGHT * 0.4, borderRadius: 10 }}>

                            {/* {propertyLocation.length != 0 && autocompleteLocation.map((value, index) => (
                                <TouchableHighlight key={value.description + index} >
                                    <View style={{
                                        width: WIDTH * 0.9, height: HEIGHT * 0.08, paddingLeft: WIDTH * 0.025,
                                        alignItems: 'center', flexDirection: 'row',
                                    }}>
                                        <Ionicons name="location-outline" size={25} color={LIGHTGREY} />
                                        <Pressable style={{ width: WIDTH * 0.8, marginLeft: WIDTH * 0.025 }} hitSlop={WIDTH*0.05} onPress={() => moveOn(value)}>
                                            <Text style={{ color: 'white', fontSize: HEIGHT * 0.015 }}>{value.structured_formatting.main_text}</Text>
                                            <Text style={{ color: LIGHTGREY, fontSize: HEIGHT * 0.015 }}>{value.structured_formatting.secondary_text}</Text>
                                        </Pressable>
                                    </View>
                                </TouchableHighlight>
                            ))} */}

                        </Animated.View>

                    </PostingSection>

                    {/* This shows the detail of the property location 
                        Street addr, City, State, Postal Code
                    */}
                    <PostingSection >
                        <Heading>Location details</Heading>
                        
                        <LocationDetailContainer>
                            <LocationDetailName>Street Address</LocationDetailName>
                            <StreetAddrInput value={propertyLocationNumberStreet} onChangeText={(value)=> {setPropertyLocationNumberStreet(value), setLocationDetailsChanged(true)}}/>
                        </LocationDetailContainer>
                        <LocationDetailContainer>
                            <LocationDetailName>City</LocationDetailName>
                            <StreetAddrInput value={propertyLocationCity} onChangeText={(value)=> {setPropertyLocationCity(value),setLocationDetailsChanged(true)}}/>
                        </LocationDetailContainer>
                        <View style={{flexDirection:'row', justifyContent:'space-between', width: WIDTH*0.9}}>
                            <LocationDetailContainer>
                                <LocationDetailName style={{width: '100%'}}>State</LocationDetailName>
                                <StreetAddrHalfInput value={propertyLocationState} onChangeText={(value)=> {setPropertyLocationState(value), setLocationDetailsChanged(true)}} />
                                      
                            </LocationDetailContainer>
                            <LocationDetailContainer>
                                <LocationDetailName style={{width: '100%'}}>Postal Code</LocationDetailName>
                                <StreetAddrHalfInput value={propertyLocationPostalCode} onChangeText={(value)=> {setPropertyLocationPostalCode(value), setLocationDetailsChanged(true)}}/>
                                      
                            </LocationDetailContainer>
                        </View>


                    </PostingSection>

                    {/* Select Photo Gallery */}
                    <PostingSection>
                        <Heading>Image Gallery</Heading>
                        <InfoText>Please upload images of your property. </InfoText>
                        <ScrollView showsVerticalScrollIndicator={false} style={{ marginTop: HEIGHT * 0.02 }}>
                            {
                                ImageName.map((value) => (
                                    <ImageSelectionContainer key={"Image" + value.name}>
                                        <Subheading>{value.name}</Subheading>
                                        <ImageText >{value.des}</ImageText>
                                        <ImageContainer hitSlop={WIDTH*0.05} onPress={() => selectGallery(value.name)}>
                                            <Ionicons name={value.icon} size={40} color='white' />
                                            <Image
                                                style={{ position: 'absolute', height: '100%', width: '100%', borderRadius: 10 }}
                                                resizeMode='cover'

                                                source={{
                                                    uri:
                                                        value.name == "Bedroom" ? propertyBedroomImage == null ? null : propertyBedroomImage :
                                                            value.name == "Bathroom" ? propertyBathroomImage == null ? null : propertyBathroomImage :
                                                                value.name == "Living Room" ? propertyLivingroomImage == null ? null : propertyLivingroomImage :
                                                                    value.name == "Kitchen" ? propertyKitchenImage == null ? null : propertyKitchenImage :
                                                                        propertyFloorplanImage == null ? null : propertyFloorplanImage
                                                }} />
                                        </ImageContainer>

                                    </ImageSelectionContainer>


                                ))}
                                <View style={{height:HEIGHT*0.1}}/>


                        </ScrollView>
                        

                    </PostingSection>

                    <PostingSection>
                        <Heading>Sublease Price</Heading>
                        <InfoText>
                            Please set property price per month.
                        </InfoText>
                        <PriceInputSearchContainer>
                            <SearchInput keyboardType='number-pad' value={formatPrice(propertyPrice)} onChangeText={(value) => setpropertyPrice(value)}
                                placeholder="$ Price" placeholderTextColor='white' />
                        </PriceInputSearchContainer>
                        
                    </PostingSection>

                    {/* Enter description  */}
                    <PostingSection>
                        <Heading >Sublease Description</Heading>

                        <PropertyDescriptionInput placeholder="Enter some basic details of your property. (Optional)"
                            value={propertyDescription} onChangeText={(value) => setpropertyDescription(value)} multiline={true}
                            placeholderTextColor={MEDIUMGREY} maxLength={700} />
                        <MaxText length={propertyDescription.length}>{propertyDescription.length} / 700</MaxText>
                    </PostingSection>


                    <PostingSection>
                        <Heading>Availability</Heading>
                        <InfoText>
                            Please select the availability of your property.
                            </InfoText>
                        <InputContainer >
                            <DateSelectContainer>

                                <RowContainer  hitSlop={WIDTH*0.05} onPress={() => setOpenFrom(true)}>
                                    <DateCategoryName>Available From</DateCategoryName>
                                    <Ionicons name="shuffle" size={20} color='white' />
                                    <RowValueContainer  hitSlop={WIDTH*0.05} onPress={() => setOpenFrom(true)} >
                                        <DateSelectPressable  hitSlop={WIDTH*0.05} onPress={() => setOpenFrom(true)}>
                                        {
                                            propertydateFrom == null ?
                                                <Text style={{color:'white'}}> Select Date</Text>
                                            :
                                            <Text style={{ alignSelf: 'center', color: 'white' }}>{propertydateFrom.getMonth()%12 + 1}-{propertydateFrom.getDate()}-{propertydateFrom.getFullYear()}</Text>
                                        }
                                        </DateSelectPressable>
                                        <Ionicons name='chevron-forward-outline' size={25} color='white' style={{ paddingLeft: WIDTH * 0.05 }} />
                                    </RowValueContainer>
                                </RowContainer>
                                <RowContainer  hitSlop={WIDTH*0.05} onPress={() => setOpenTo(true)}>
                                    <DateCategoryName>Available To</DateCategoryName>
                                    <Ionicons name="shuffle" size={20} color='white' />
                                    <RowValueContainer  hitSlop={WIDTH*0.05} onPress={() => setOpenTo(true)}>
                                        <DateSelectPressable  hitSlop={WIDTH*0.05} onPress={() => setOpenTo(true)}>
                                            {
                                            propertydateTo == null ?
                                                <Text style={{color: 'white'}}>Select Date</Text>
                                            :
                                                <Text style={{ alignSelf: 'center', color: 'white' }}>{propertydateTo.getMonth()%12 +1}-{propertydateTo.getDate()}-{propertydateTo.getFullYear()}</Text>
                                            }
                                        </DateSelectPressable>
                                        <Ionicons name='chevron-forward-outline' size={25} color='white' style={{ paddingLeft: WIDTH * 0.05 }} />
                                    </RowValueContainer>
                                </RowContainer>
                            </DateSelectContainer>

                            {/* <DateSelectContainer>
                               
                                    <Subheading keyboardType='number-pad'>Bed</Subheading>
                                    <BedBathInput keyboardType='number-pad' value={propertyNumBed} onChangeText={(value)=>setpropertyNumBed(value)}> </BedBathInput>
                                    
                               
                                    <Subheading>Bath</Subheading>
                                    <BedBathInput keyboardType='number-pad' value={propertyNumBath} onChangeText={(value)=>setpropertyNumBath(value)}> </BedBathInput>
                               
                            </DateSelectContainer>   */}

                            <DatePicker
                              
                                modal
                                mode='date'
                                open={openFrom}
                                date={propertydateFrom == null ? new Date() : propertydateFrom}
                                onConfirm={(date) => {
                                    if(date.getTime() < new Date().getTime()){
                                        alert("Please enter a date later than current date.")
                                    }
                                    else if(date.getTime() > 1759176355615){
                                        alert("Date selected is too far ahead.")
                                    }
                                    else if(propertydateTo != null && date.getTime() > propertydateTo.getTime()){
                                        alert("Available from cannot be after available to.")
                                    }
                                    
                                    else{
                                        setpropertydateFrom(date)
                                    }
                                    setOpenFrom(false)
                                       
                                }}
                                onCancel={() => {
                                    setOpenFrom(false)
                                }}
                            />
                            <DatePicker
                              
                                modal
                                mode='date'
                                open={openTo}
                                date={propertydateTo == null ? new Date () : propertydateTo}
                                onConfirm={(date) => {
                                    if(date.getTime() < propertydateFrom.getTime()){
                                        alert("Available to date cannot be before available from date")
                                    }
                                    else if(date.getTime() > 1759176355615){
                                        console.log(propertydateTo)
                                        alert("Cannot schdeul too far in advance.")
                                    }
                                    else if(propertydateFrom != null && date.getTime() < propertydateFrom.getTime()+50000000){

                                        alert("Available from and available to cannot be on the same date.")
                                    }

                                    else{
                                        setpropertydateTo(date)
                                    }
                                    setOpenTo(false)
                                }}
                                onCancel={() => {
                                    setOpenTo(false)
                                }}
                            />
                        </InputContainer>
                    </PostingSection>

                    
                    <PostingSection>
                        <Heading>Property Details</Heading>
                        <InfoText>What would tenants be able to access.</InfoText>
                        <RowContainerCol>
                            <CategoryName>Bedroom</CategoryName>
                            <Ionicons name='bed-outline' color='white' size={25} style={{ paddingVertical: HEIGHT * 0.015 }} />
                            <BedroomContaienr>
                                {bedroomList.map((value) => (
                                    <BedroomItemContainer hitSlop={WIDTH*0.05} onPress={() => setpropertyNumBed(value)} userInput={propertyNumBed} value={value}
                                        key={"bedroom" + value}>
                                        <Text style={{ color: value == propertyNumBed ? 'black' : 'white', fontWeight: '500' }}>{value.replace("P","+")}</Text>
                                    </BedroomItemContainer>
                                ))}
                            </BedroomContaienr>
                        </RowContainerCol>

                        <RowContainerCol>
                            <CategoryName>Bathroom</CategoryName>
                            <Ionicons name='water-outline' color='white' size={25} style={{ paddingVertical: HEIGHT * 0.015 }} />
                            <BedroomContaienr>
                                {bathroomList.map((value) => (
                                    <BedroomItemContainer hitSlop={WIDTH*0.05} onPress={() => setpropertyNumBath(value)} userInput={propertyNumBath} value={value}
                                        key={"bathroom" + value}>
                                        <Text style={{ color: value == propertyNumBath ? 'black' : 'white', fontWeight: '500' }}>{value.replace("P","+")}</Text>
                                    </BedroomItemContainer>
                                ))}
                            </BedroomContaienr>
                        </RowContainerCol>


                    </PostingSection>

                    <PostingSection>
                        <Heading>More Details</Heading>
                        {/* <FontAwesomeIcon icon=blogger color='white' /> */}
                        <InfoText>
                            Select all of the amenities that are available
                            at this sublease property. Not all may apply
                        </InfoText>
                        <InputContainer >
                            <Subheading>Amenities</Subheading>
                            <ScrollView style={{height:HEIGHT*0.5}}>
                            <AmenitiesContainer>
                                
                                {amenitiesList.map((value, index) => (
                                    <View key={value.name + index + 'view'} style={{
                                        minWidth: WIDTH * 0.35, width: value.name.length * 0.03 * WIDTH, height: HEIGHT * 0.055, justifyContent: 'center',
                                        paddingRight: WIDTH * 0.03
                                    }}>
                                        <Pressable key={value.name + 'pressable'} hitSlop={WIDTH*0.05} onPress={() => updateAmenities(value.name)} style={{
                                            borderWidth: 3, borderColor: propertyAmenities.indexOf(value.name) == -1 ? value.color : '#0085FF', height: HEIGHT * 0.045,
                                            borderRadius: 20, justifyContent: 'center', backgroundColor: value.color, flexDirection: 'row', alignItems: 'center'
                                        }}>
                                            {GetFAIcons(value.name)}
                                            <Text key={value.name + 'text'} style={{ justifyContent: 'center', color: 'white' }}>
                                                {"   "}{value.name.replaceAll("_"," ")}
                                            </Text>
                                        </Pressable>

                                    </View>
                                ))}
                                
                            </AmenitiesContainer>
                            </ScrollView>
                        </InputContainer>
                    </PostingSection>

                    <PostingSection>
                        <Heading>One last step!</Heading>
                        <InfoText>
                            Please review your property information before posting.
                        </InfoText>
                        <ImageContainer>
                            <Image source={require('../../../assets/room.jpg')} style={{ height: HEIGHT * 0.25, width: WIDTH * 0.9, marginTop: HEIGHT * 0.1, borderRadius: 20 }} />
                        </ImageContainer>
                    </PostingSection>


                    <PostingSection>
                        <ScrollView style={{ paddingLeft: WIDTH * 0.05 }} showsVerticalScrollIndicator={false}>
                            <ReviewHeading>Review</ReviewHeading>


                            <View style={{ width: WIDTH, height: HEIGHT * 0.25, paddingBottom: HEIGHT * 0.05, marginTop: HEIGHT * 0.03, borderRadius: 10, }}>
                                <Image source={{ uri: headerImage == null ? propertyBedroomImage == null ? null : propertyBedroomImage: headerImage }}
                                    style={{ width: WIDTH * 0.9, height: HEIGHT * 0.25, borderRadius: 10, borderWidth: 1, borderColor: MEDIUMGREY }} />
                            </View>
                            <ReviewHeading style={{ marginTop: HEIGHT * 0.02 }}>Gallery</ReviewHeading>
                            <PropertyPhotoContainer >

                                <TouchableOpacity key={"bedroomPic"} hitSlop={WIDTH*0.05}  onPress={() => setHeaderImage(propertyBedroomImage)}>
                                    <PhotoContainer >
                                        <Image source={{ uri: propertyBedroomImage == null ? null : propertyBedroomImage }}
                                            style={{ height: '100%', width: '100%', backgroundColor: LIGHTGREY, borderRadius: 15 }} />
                                        {/* <Text>{propertyphotoGallery[index]}</Text> */}
                                    </PhotoContainer>
                                </TouchableOpacity>
                                <TouchableOpacity key={"bathRoomPic"} hitSlop={WIDTH*0.05}  onPress={() => setHeaderImage(propertyBathroomImage)}>
                                    <PhotoContainer >
                                        <Image source={{ uri: propertyBathroomImage == null ? null : propertyBathroomImage}}
                                            style={{ height: '100%', width: '100%', backgroundColor: LIGHTGREY, borderRadius: 15 }} />
                                        {/* <Text>{propertyphotoGallery[index]}</Text> */}
                                    </PhotoContainer>
                                </TouchableOpacity>
                                <TouchableOpacity key={"livingRoomPic"} hitSlop={WIDTH*0.05}  onPress={() => setHeaderImage(propertyLivingroomImage)}>
                                    <PhotoContainer >
                                        <Image source={{ uri: propertyLivingroomImage == null ? null : propertyLivingroomImage}}
                                            style={{ height: '100%', width: '100%', backgroundColor: LIGHTGREY, borderRadius: 15 }} />
                                        {/* <Text>{propertyphotoGallery[index]}</Text> */}
                                    </PhotoContainer>
                                </TouchableOpacity>
                                <TouchableOpacity key={"kitchenPic"} hitSlop={WIDTH*0.05}  onPress={() => setHeaderImage(propertyKitchenImage)}>
                                    <PhotoContainer >
                                        <Image source={{ uri: propertyKitchenImage == null ? null : propertyKitchenImage }}
                                            style={{ height: '100%', width: '100%', backgroundColor: LIGHTGREY, borderRadius: 15 }} />
                                        {/* <Text>{propertyphotoGallery[index]}</Text> */}
                                    </PhotoContainer>
                                </TouchableOpacity>
                                <TouchableOpacity key={"floorplanPic"}  hitSlop={WIDTH*0.05} onPress={() => setHeaderImage(propertyFloorplanImage)}>
                                    <PhotoContainer >
                                        <Image source={{ uri: propertyFloorplanImage == null ? null : propertyFloorplanImage}}
                                            style={{ height: '100%', width: '100%', backgroundColor: LIGHTGREY, borderRadius: 15 }} />
                                        {/* <Text>{propertyphotoGallery[index]}</Text> */}
                                    </PhotoContainer>
                                </TouchableOpacity>

                            </PropertyPhotoContainer>
                            <ReviewSectionContainer>
                                <ReviewHeading>Location</ReviewHeading>
                                <ReviewLocationContainer>
                                    <Ionicons name='location-outline' size={20} color='white' />
                                    <ReviewInfoText style={{ marginLeft: WIDTH * 0.05 }}>{propertyLocation}</ReviewInfoText>
                                </ReviewLocationContainer>

                            </ReviewSectionContainer>

                            <ReviewSectionContainer>
                                <ReviewHeading>Property Type</ReviewHeading>
                                <ReviewInfoText>{propertyType}</ReviewInfoText>
                                <SubHeadingText style={{ marginTop: HEIGHT * 0.025 }} >Tenant will have access to: </SubHeadingText>
                                <BedAndBathContainer>
                                    <BedBathLogo>
                                        <Ionicons name="bed-outline" size={30} color='white'></Ionicons>
                                        <LocationText>
                                            {
                                                propertyNumBed == "Studio" ? "Studio" : propertyNumBed + ' bedroom'
                                            }

                                        </LocationText>
                                    </BedBathLogo>
                                    <BedBathLogo>
                                        <Ionicons name="water-outline" size={30} color='white' ></Ionicons>
                                        <LocationText>{propertyNumBath.replaceAll("P","+")} bathroom</LocationText>
                                    </BedBathLogo>
                                </BedAndBathContainer>
                            </ReviewSectionContainer>
                            <ReviewSectionContainer>
                                <ReviewHeading>Description</ReviewHeading>
                                <ReviewPropertyDescriptionInput editable={false} value={propertyDescription} multiline={true} />
                            </ReviewSectionContainer>

                            <ReviewSectionContainer>
                                <ReviewHeading>Availability</ReviewHeading>
                                <ReviewDateContainer>
                                    {propertydateFrom != null &&
                                        <ReviewInfoText>From {propertydateFrom.getMonth()}-{propertydateFrom.getDate()}-{propertydateFrom.getFullYear()}</ReviewInfoText>
                                    }
                                    <Ionicons name='shuffle-outline' size={20} color='white' />
                                    {propertydateTo != null &&
                                        <ReviewInfoText>To {propertydateTo.getMonth()}-{propertydateTo.getDate()}-{propertydateTo.getFullYear()}</ReviewInfoText>
                                    }
                                </ReviewDateContainer>
                            </ReviewSectionContainer>
                            <ReviewSectionContainer>
                                <ReviewHeading>Amenities</ReviewHeading>
                                {propertyAmenities.map((value) => (
                                    <ReviewLocationContainer key={"amenities" + value}>
                                        {GetFAIcons(value)}
                                        <ReviewInfoText style={{ marginLeft: WIDTH * 0.05 }}>{value.replaceAll("_", " ")}</ReviewInfoText>
                                    </ReviewLocationContainer>
                                ))}
                            </ReviewSectionContainer>

                        </ScrollView>
                        <Footer>
                            <PricePerMonth>{propertyPrice} <Text style={{ fontSize: HEIGHT * 0.025, fontWeight: '500', color: 'white' }}>/ month</Text></PricePerMonth>
                            <ContactTanentButton loading={loading} hitSlop={WIDTH*0.05} onPress={postproperty}>
                            {loading ? 
                                 <Lottie source={require('../../../loadingAnim.json')} autoPlay loop style={{width:WIDTH*0.2, height: WIDTH*0.2, }}/>
                            :
                                <Text style={{ color: 'white', fontWeight: '700' }}>Post</Text>
                            }
                            </ContactTanentButton>
                        </Footer>


                    </PostingSection>


                </Animated.ScrollView>

                <NextContainer style={{ display: scrollviewIndex == 0 || scrollviewIndex == 10 ? 'flex' : 'none' }}>
                    <ContinueButton hitSlop={WIDTH*0.05} onPress={() => moveScrollView(scrollviewIndex + 1)}>
                        <ContinueText>
                            {scrollviewIndex == 0 ? "Start" : "Review"}
                        </ContinueText>
                    </ContinueButton>
                </NextContainer>
            </ModalView>
        </SafeAreaView>
    )

}
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
    Alert
} from 'react-native';

//Icons
import Ionicons from 'react-native-vector-icons/Ionicons';

import FontAwesome from 'react-native-vector-icons/FontAwesome';

import DatePicker from 'react-native-date-picker'

import EncryptedStorage from 'react-native-encrypted-storage';

import ImagePicker from 'react-native-image-crop-picker';

import Lottie from 'lottie-react-native';



;

const ImageName = [
    { name: "Bedroom", des: "Image of where subtenants would sleep", icon: "bed-outline" },
    { name: "Bathroom", des: "Image of bathroom tenant have access to", icon: "water-outline" },
    { name: "Living Room", des: "Image of common/shared space." , icon: "tv-outline"},
    { name: "Kitchen", des: "Image of kitchen/cooking area." , icon: "fast-food-outline"},
    { name: "Floor Plan (Optional)", des: "Image of property floor plan.", icon: "logo-stackoverflow" },
]


const bedroomList = ["Studio", "1" , "2", "3", "4P"]
const bathroomList = ["1", "2", "3", "4P"]


import { faBath, faBed} from '@fortawesome/free-solid-svg-icons'


import {
    ModalView, Heading, ButtonContainer, ImageContainer, NextContainer, InfoText, PostingSection, InfoTextSection2, SearchContainer, SearchInput, Subheading,
    InputContainer, DateSelectContainer, DateContainer, DateSelectPressable, BedBathInput, AmenitiesContainer,
    PropertyPhotoContainer, PhotoContainer, PropertyDescriptionInput, Divider, ReviewInfoText, ReviewSectionContainer,
    BedAndBathContainer, BedBathLogo, LocationText, ReviewPropertyDescriptionInput, Footer, ContactTanentButton,
    PricePerMonth, PropertyTypeCard, PriceInputSearchContainer, CategoryName, RowContainer, RowValueContainer, RowName,
    FollowUpContainer, FollowUpText, DateCategoryName, BedroomContaienr, BedroomItemContainer, RowContainerCol,
    ReviewHeading, ReviewLocationContainer, ReviewDateContainer, ImageSelectionContainer, ImageText, CribText,
    ContinueText, MaxText, ExitButtonContainer, ExitButtonText, ContinueButton, BackNextContainer, BackText, SmallContinueButton, ImageTypeText, PriceInput, DollarSignText, SecurityDepositInputSearchContainer, SecurityDepositInput, CounterContainer, BedroomCountContaienr, BedroomBathroomCountText, AmenitiesName, ReivewImageContainer, ReviewSection, ReviewHeadingAndEditContainer, ReviewButtonContainer,
} from './discoverPropertyPostingStyle';
import Easing from 'react-native/Libraries/Animated/Easing';
import { DARKGREY, LIGHTGREY, MEDIUMGREY, GetAmenitiesIcon, amenitiesList, HEIGHT, WIDTH, PRIMARYCOLOR, GetFAIcons} from '../../../sharedUtils';
import { SubHeadingText } from '../../Onboarding/Landing/landingStyle';
import { he, te } from 'date-fns/locale';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { set } from 'date-fns';


export default function PropertyPostingScreen({ navigation }) {

    const flatListdata =
        [{ name: "Room", image: require('../../../assets/room.jpg'), description: "Shared public space" },
        { name: "House", image: require('../../../assets/house.jpg'), description: "Entire House" },
        { name: "Entire apartment", image: require('../../../assets/apartment.jpg'), description: "2+ Bedroom Apartment" },
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
    const [propertydateFlexible, setpropertydateFlexible] = useState(false)
    const [propertyNumBed, setpropertyNumBed] = useState(0);
    const [propertyNumBath, setpropertyNumBath] = useState(0);
    const [propertyPrice, setpropertyPrice] = useState('');
    const [propertySecurityDeposit, setpropertySecurityDeposit] = useState('');
    const [propertyDescription, setpropertyDescription] = useState('')
    const [propertyAmenities, setpropertyAmenities] = useState([])

    const [title, setTitle] = useState("")

    const [propertyBedroomImage, setPropertyBedroomImage] = useState(null)
    const [propertyBathroomImage, setPropertyBathroomImage] = useState(null)
    const [propertyLivingroomImage, setPropertyLivingroomImage] = useState(null)
    const [propertyKitchenImage, setPropertyKitchenImage] = useState(null)
    const [propertyFloorplanImage, setPropertyFloorPlanImage] = useState(null)
    const [latLong, setLatLong] = useState([])

    const [reviewing, setReviewing] = useState(false)

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


    async function moveScrollView(val) {
        setLoading(true)
        Keyboard.dismiss()
        if (val < 0) {
            navigation.goBack();
        }
        if(val == 2 && !checkPropertyType()){
            setLoading(false)
            return;
        }
        
        if(val == 3){
            const success = await checkPropertyLocation();
            if(!success){
                setLoading(false)
                return;
            }
        }
        if(val == 4){
            const success = await checkPropertyImages();
            if(!success){
                setLoading(false)
                return;
            }
        }
        if(val == 5){
            const success = await checkPropertyPrice();
            if(!success){
                setLoading(false)
                return;
            }
        }
        if(val == 6){
            const success = await checkPropertyAvailability();
            if(!success){
                setLoading(false)
                return;
            }
        }
        if(val == 8){
            const success = await checkPropertyBedBath();
            if(!success){
                setLoading(false)
                return;
            }
        }

        if(val == 10){
            setReviewing(true)
        }

        setscrollviewIndex(val)
        setLoading(false)
        setTimeout(() => {
            scrollView.current.scrollTo({ x: WIDTH * val });
            setscrollviewIndex(val)
        }, 100)
        return
        
    }

    //Function to check if user input a type in property type
    function checkPropertyType(){
        if(propertyType == ""){
            alert("Must enter property type.");
            return false;
        }
        return true;
    }

    //Function to check if user input a proper location in property location
    async function checkPropertyLocation(){
        //Didn't enter an address
        if(propertyLocation.trim() == ""){
            alert("Invalid property location.");
            return false;
        }
        
        //Entered some weird address that doesn't have result
        if(autocompleteLocation.length == 0){
            alert("Invalid property location.");
            return false;
        }

        //This checks if the user pressed next without selecting autocomplete options 
        if(propertyMainAddr == null || propertyMainAddr.trim() == "" || latLong == null){
            setpropertyLocation(autocompleteLocation[0].description)
            setpropertyMainAddr(autocompleteLocation[0].structured_formatting.main_text)
            setpropertySecondaryAddr(autocompleteLocation[0].structured_formatting.secondary_text)

            const tempLatLong = await LocationToLatLong(autocompleteLocation[0].description);
            setLatLong(tempLatLong)
            return true;
        }
        return true;
    }

    //Checks if user have input the required images for image gallery
    async function checkPropertyImages(){
        if(propertyBedroomImage == null){
            alert("Must select Bedroom Image.")
            return false;
        }
        else if(propertyBathroomImage == null){
            alert("Must select Bathrrom Image.")
            return false;
        }
        else if(propertyKitchenImage == null){
            alert("Must select Kitchen Image.")
            return false;
        }
        else if(propertyLivingroomImage == null){
            alert("Must select Livingroom Image.")
            return false;
        }
        return true;
    }

    //Check if users have input sublease price or security deposit
    async function checkPropertyPrice(){
        if(propertyPrice == null || propertyPrice.trim() == ""){
            alert("Invalid property price.")
            return false;
        }
        if(propertyPrice <= 0){
            alert("Invalid property price.")
            return false;
        }
        if(propertyPrice > 10000){
            alert("Property price must be less than $10000")
            return false;
        }
        if(propertySecurityDeposit > 10000){
            alert("Security deposit must be less than $10000")
            return false;
        }
        return true;
    }

    //Check if user have input a valid sublease availability
    async function checkPropertyAvailability(){
        if(propertydateFrom == null){
            alert("Must select sublease start date.")
            return false;
        }
        if(propertydateTo == null){
            alert("Must select sublease end date.")
            return false
        }
        return true;
    }

    //Check if user have input a valid bed and bath number 
    async function checkPropertyBedBath(){
        if(propertyNumBed == 0){
            alert("Please enter a valid bed number.")
            return false;
        }
        if(propertyNumBath == 0){
            alert("Please enter a valid bathroom number.")
            return false;
        }
        return true;
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
    function SelectLocationOutSequence() {

        Animated.parallel([

            Animated.spring(TopContainerTranslation, {
                toValue: HEIGHT * 0.1,
                bounciness: 1,
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
                url: `https://crib-llc.herokuapp.com/autocomplete/places/${query}`,
            };
            axios(config)
            .then(function (response) {
                setautocompleteLocation([]);            
                for( let name of response.data){
                    setautocompleteLocation(prevArray => [...prevArray,name])   
                }        
            })
            .catch(function (error) {
                console.log("PLACES", error);
            });
        }
    }

    //Render individual card items for PropertyType in posting page
    const renderItem = ({ item, index }) => (
        <Pressable hitSlop={WIDTH*0.05} onPress={() => setpropertyType(item.name)}
            style={{ width: WIDTH * 0.9, height: WIDTH * 0.2, backgroundColor: propertyType == item.name ? PRIMARYCOLOR : 'white', borderRadius: 15, marginTop: HEIGHT * 0.01, flexDirection: 'row' }}>

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




async function testScraped(){
        console.log("hello")
        // console.log(propertyType)
        // console.log(propertyMainAddr)
        // console.log(propertySecondaryAddr)
        // console.log(latLong[0])
        // console.log(latLong[1])
        // console.log(propertyPrice)
        // console.log(propertyDescription)
        // console.log(propertydateFrom.getTime())
        // console.log(propertydateTo.getTime())
        // console.log(propertyNumBed)
        // console.log(propertyNumBath)
        // console.log(propertydateFlexible)
        // console.log(propertySecurityDeposit)
        setLoading(true)
        
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


        postingData.append("price", propertyPrice);                     //String 
        postingData.append("description", propertyDescription);         //String 
        postingData.append("availableFrom", propertydateFrom.getTime());          //String
        postingData.append("availableTo", propertydateTo.getTime());              //String
        postingData.append("bed", propertyNumBed);                      //String
        postingData.append("bath", propertyNumBath);                    //String 
        postingData.append("title", title);                    //String
        // postingData.append("propertyAmenities", propertyAmenities);     //Array of String 
        postingData.append("timePosted", new Date())
        propertyAmenities.forEach(element => {
            postingData.append("amenities", element);
        });
        
        postingData.append("availabilityFlexibility", true);
       
        if(propertySecurityDeposit != null && propertySecurityDeposit != undefined){
            postingData.append("securityDeposit", propertySecurityDeposit);
        }


    
        
            fetch('https://crib-llc.herokuapp.com/properties/scraped', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'multipart/form-data',
                },
                body: postingData,
            })
            .then(async (response) => {
                alert(response.status);
                if(response.status == 200){
                    
                    try{
                        await EncryptedStorage.removeItem("postedProperty")
                    }
                    catch{
                    }
                }
                else{
                    setLoading(false)
                    // navigation.goBack()
                    alert("An error occured. Please try again later!")
                }
                
            })
            .catch(e => {
                setLoading(false)
                console.log(e)
                alert("error")
            })
            
            setLoading(false)
    }


    async function postproperty() {
        // console.log("hello")
        // console.log(propertyType)
        // console.log(propertyMainAddr)
        // console.log(propertySecondaryAddr)
        // console.log(latLong[0])
        // console.log(latLong[1])
        // console.log(propertyPrice)
        // console.log(propertyDescription)
        // console.log(propertydateFrom.getTime())
        // console.log(propertydateTo.getTime())
        // console.log(propertyNumBed)
        // console.log(propertyNumBath)
        // console.log(propertydateFlexible)
        // console.log(propertySecurityDeposit)
        setLoading(true)
        try{

            const accessToken = await EncryptedStorage.getItem("accessToken");

            if(accessToken != undefined){
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


                postingData.append("price", propertyPrice);                     //String 
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
               
                postingData.append("availabilityFlexibility", true);
               
                if(propertySecurityDeposit != null && propertySecurityDeposit != undefined){
                    postingData.append("securityDeposit", propertySecurityDeposit);
                }


            
              
                    fetch('https://crib-llc.herokuapp.com/properties', {
                        method: 'POST',
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'multipart/form-data',
                            'Authorization': 'bearer ' + accessToken
                        },
                        body: postingData,
                    })
                    .then(async (response) => {
                        if(response.status == 200){
                            try{
                                await EncryptedStorage.removeItem("postedProperty")
                            }
                            catch{
                            }
                        }
                        else{
                           
                            navigation.reset(
                                {index: 0 , routes: [{ name: 'ProfileTabs'}]}
                            )
                            alert("An error occured. Please try again later!")
                        }
                       
                    })
                    .catch(e => {
                        setLoading(false)
                        navigation.reset(
                            {index: 0 , routes: [{ name: 'ProfileTabs'}]}
                        )
                        alert(e)
                    })

                    setTimeout(()=>{
                        navigation.goBack()
                    },1000)
                
               
            }
        }
        catch{
            console.log("PROPERTYPOSTING");
        }
    }

    async function selectGallery(name) {
        ImagePicker.openPicker({
            width: 600,
            height: 600,
            cropping:true,
            compressImageQuality: 0.7
            
          }).then(image => {
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
            else if (name == "Floor Plan (Optional)") {
                setPropertyFloorPlanImage(image.path);
            }

        }).catch((e)=>{
            console.log(e)
        })
    }

    async function editImageGalleryInReview(name){
        ImagePicker.openPicker({
            width: 800,
            height: 800,
            cropping:true,
            compressImageQuality: 0.8
            
          }).then(image => {
            setHeaderImage(image.path);
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

    async function LocationToLatLong(name){
        let tempLatLong = [];
        let spacelessname = name.replace(" ", "+");
        await fetch(`https://crib-llc.herokuapp.com/autocomplete/geocoding?address=${spacelessname}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        }).then( async res => {
            if(res.status == 200){
                const latLong = await res.json();
                tempLatLong[0] = latLong.lat;
                tempLatLong[1] = latLong.lng;
            }
        })
        return tempLatLong;
    }

    async function selectAutocompleteLocationOption(value){
        Keyboard.dismiss()
        setpropertyLocation(value.description)
        setpropertyMainAddr(value.structured_formatting.main_text)
        setpropertySecondaryAddr(value.structured_formatting.secondary_text)
        
        let tempLatLong = await LocationToLatLong(value.description);
        setLatLong(tempLatLong);
    }

    async function checkReviewEdit(){
        if(scrollviewIndex == 2){
            const success = await checkPropertyLocation();
            if(!success){
                return;
            }
        } 
        if(scrollviewIndex == 4){
            const success = await checkPropertyPrice();
            if(!success){
                return;
            }
        } 
        if(scrollviewIndex == 7){
            const success = await checkPropertyBedBath();
            if(!success){
                return;
            }
        } 
        moveScrollView(10);
    }

    async function exitAlert(){
        Alert.alert(
            'Exit?',
            `You're just ${11-scrollviewIndex} steps away!`,
            [
              {text: 'No', onPress: () => {}, style: 'cancel'},
              {text: 'Exit', onPress: () => moveScrollView(-1), style: 'destructive'},
            ],
            { 
              cancelable: true 
            }
          );
    }

   
    return (
        <SafeAreaView style={{ width: WIDTH, height: HEIGHT, padding: 0, backgroundColor: 'black'}} >
            <ModalView>
            <SafeAreaView>

                {/* Contains the exit button and the back button */}
                <ButtonContainer>
                    <ReviewButtonContainer hitSlop={WIDTH*0.025} >
                       
                    </ReviewButtonContainer>
                    <ExitButtonContainer hitSlop={WIDTH*0.025} onPress={() => {console.log(scrollviewIndex), scrollviewIndex >= 2 ? exitAlert() : moveScrollView(-1)}}>
                        <ExitButtonText>Exit</ExitButtonText>
                    </ExitButtonContainer>
                </ButtonContainer>
                <Animated.ScrollView keyboardShouldPersistTaps={'handled'}
                    style={{
                        opacity: OpacityTranslation.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, 1]
                        })
                    }}
                    scrollEnabled={false} 
                    horizontal 
                    snapToAlignment='end' 
                    decelerationRate='fast' 
                    snapToInterval={WIDTH} 
                    ref={scrollView} 
                    onTouchEnd={() => setexpended(true)}
                >
                    {/* Posting Landing Page */}
                    <PostingSection>
                        <Heading>Sublease your property,</Heading>
                        <Heading style={{marginTop: HEIGHT*0.01}}>earn up to <Text style={{color: PRIMARYCOLOR}}> $950 </Text> per month</Heading>

                        <Subheading>We make subleasing as easy as possible.</Subheading>

                        <Lottie source={require('../../../postingfirstpage.json')}  autoPlay={scrollviewIndex == 0 ? true : false} loop style={{width:WIDTH*0.9, height: WIDTH*0.9, }}/>

                                               
                    </PostingSection>

                    {/* Choose apartment type  */}
                    <PostingSection>
                        <Heading>Property type</Heading>
                        <Subheading>Choose the type of sublease.</Subheading>


                        <View style={{ marginTop: HEIGHT * 0.05}}>
                            <FlatList scrollEnabled={false} key={() => flatListdata.name} data={flatListdata} renderItem={renderItem} />
                        </View>
                    </PostingSection>

                    {/* Select Address */}

                    <PostingSection>
                        <Animated.View style={{
                            height: TopContainerTranslation
                            , opacity: TopContainerTranslation.interpolate({
                                inputRange: [0, startingvalue],
                                outputRange: [0, 1]
                            })
                        }}>
                            <Heading >Address of sublease </Heading>
                            <Subheading>Choose the type of sublease.</Subheading>
                        </Animated.View>
                        <SearchContainer>
                            <Ionicons name="search-outline" size={20} color='white' />
                            <SearchInput placeholderTextColor='white' 
                            // onEndEditing={SelectLocationOutSequence}

                                onFocus={SelectLocationSequence} value={propertyLocation} onChangeText={(value) => {autocomplete(value), setLatLong(null)}} placeholder="Location..." />
                        </SearchContainer>
                        <Animated.View style={{ width: WIDTH * 0.9, height: HEIGHT * 0.4, borderRadius: 10 }}>

                            {propertyLocation.length != 0 && autocompleteLocation.map((value, index) => (
                                <Pressable 
                                key={value.description + index}
                                onPress={()=>selectAutocompleteLocationOption(value)}
                                style={{
                                    width: WIDTH * 0.9, height: HEIGHT * 0.08, paddingLeft: WIDTH * 0.025,
                                    alignItems: 'center', flexDirection: 'row',
                                }}>
                                    <Ionicons name="location-outline" size={25} color={LIGHTGREY} />
                                    <View style={{ width: WIDTH * 0.8, marginLeft: WIDTH * 0.025 }} hitSlop={WIDTH*0.05}>
                                        <Text style={{ color: 'white', fontSize: HEIGHT * 0.015 }}>{value.structured_formatting.main_text}</Text>
                                        <Text style={{ color: LIGHTGREY, fontSize: HEIGHT * 0.015 }}>{value.structured_formatting.secondary_text}</Text>
                                    </View>
                                </Pressable>
                            ))}

                        </Animated.View>

                    </PostingSection>
                    

                    {/* Select Photo Gallery */}
                    <PostingSection>
                        <ScrollView showsVerticalScrollIndicator={false}>
                        <Heading>Sublease images</Heading>
                        <Subheading>Upload images for tenants to better understand the sublease property</Subheading>
                            {
                                ImageName.map((value) => (
                                    <ImageSelectionContainer key={"Image" + value.name}>
                                        <ImageTypeText>{value.name}</ImageTypeText>
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
                                <View style={{height:HEIGHT*0.3}}/>

                        </ScrollView>
                        

                    </PostingSection>

                    <PostingSection>
                        <Heading>Sublease price</Heading>
                        <Subheading>Enter property price per month in USD</Subheading>
                        
                        <PriceInputSearchContainer>
                            <View style={{flexDirection: 'row', alignItems:'center'}}>
                            <DollarSignText>$  </DollarSignText>
                            <PriceInput keyboardType='number-pad' value={propertyPrice} onChangeText={(value) => setpropertyPrice(value)}
                                placeholder="1000" placeholderTextColor={DARKGREY} />
                            </View>
                            <DollarSignText> / month</DollarSignText>
                        </PriceInputSearchContainer>

                        <Subheading style={{marginTop: HEIGHT*0.05}}>Security deposit (if applicable)</Subheading>
                        
                        <SecurityDepositInputSearchContainer>
                            <View style={{flexDirection: 'row', alignItems:'center'}}>
                            <DollarSignText>$  </DollarSignText>
                            <SecurityDepositInput keyboardType='number-pad' value={propertySecurityDeposit} onChangeText={(value) => setpropertySecurityDeposit(value)}
                                placeholder="1000" placeholderTextColor={DARKGREY} />
                            </View>
                            
                        </SecurityDepositInputSearchContainer>
                        
                    </PostingSection>

                    <PostingSection>
                        <Heading>Sublease availability</Heading>
                        <Subheading>Enter start and end date of sublease </Subheading>
                           
                        <InputContainer >
                            <DateSelectContainer>

                                <RowContainer  hitSlop={WIDTH*0.05} onPress={() => setOpenFrom(true)}>
                                    <DateCategoryName>Available From</DateCategoryName>
                                   
                                    <RowValueContainer  hitSlop={WIDTH*0.05} onPress={() => setOpenFrom(true)} >
                                        <DateSelectPressable  hitSlop={WIDTH*0.05} onPress={() => setOpenFrom(true)}>
                                        {
                                            propertydateFrom == null ?
                                                <Text style={{color:'white'}}> Select Date</Text>
                                            :
                                            <Text style={{ alignSelf: 'center', color: 'white' }}>{propertydateFrom.getMonth()%12 + 1}-{propertydateFrom.getDate()}-{propertydateFrom.getFullYear()}</Text>
                                        }
                                        </DateSelectPressable>
                                    </RowValueContainer>
                                </RowContainer>
                                <RowContainer  hitSlop={WIDTH*0.05} onPress={() => setOpenTo(true)}>
                                    <DateCategoryName>Available To</DateCategoryName>
                        
                                   <RowValueContainer  hitSlop={WIDTH*0.05} onPress={() => setOpenTo(true)} >
                                       <DateSelectPressable  hitSlop={WIDTH*0.05} onPress={() => setOpenTo(true)}>
                                       {
                                           propertydateTo == null ?
                                               <Text style={{color:'white'}}> Select Date</Text>
                                           :
                                           <Text style={{ alignSelf: 'center', color: 'white' }}>{propertydateTo.getMonth()%12 + 1}-{propertydateTo.getDate()}-{propertydateTo.getFullYear()}</Text>
                                       }
                                       </DateSelectPressable>
                                   </RowValueContainer>
                                </RowContainer>
                            </DateSelectContainer>

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
                                    if(date.getTime() < new Date().getTime()){
                                        alert("Invalid date.")
                                    }
                                    else if(propertydateFrom != null &&  date.getTime() < propertydateFrom.getTime()){
                                        alert("Available to date cannot be before available from date")
                                    }
                                    else if(date.getTime() > 1759176355615){
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
                        <Heading style={{marginTop: HEIGHT*0.02}}>Flexible? (Optional)</Heading>
                        <View style={{marginTop: HEIGHT*0.01, flexDirection: 'row', justifyContent:'space-between', width: WIDTH*0.9, alignItems:'center'}}>
                            <Subheading style={{marginTop:0}}>Can tenant move in a few days early / late</Subheading>
                            <Ionicons name='checkbox' color={propertydateFlexible ? PRIMARYCOLOR : 'white'} size={30} onPress={()=>setpropertydateFlexible(!propertydateFlexible)}/>
                        </View>
                    </PostingSection>

                    <PostingSection>
                        <Heading>Sublease amenities</Heading>
                        {/* <FontAwesomeIcon icon=blogger color='white' /> */}
                        <Subheading>Enter all amenities that are included with the sublease</Subheading>
                        <InputContainer >
                            <ScrollView style={{height:HEIGHT*0.6}}>
                            <AmenitiesContainer>
                                {amenitiesList.map((value, index) => (
                                    
                                    <Pressable key={value.name + index} onPress={() => updateAmenities(value.name)} hitSlop={WIDTH*0.025}
                                    style={{width: WIDTH*0.9, paddingVertical: HEIGHT*0.0175, flexDirection: 'row',
                                    justifyContent:'space-between'}}>
                                        <View style={{flexDirection:'row'}}>
                                            {GetFAIcons(value.name)}
                                            <AmenitiesName>{value.name.replace("_", " ")}</AmenitiesName>
                                        </View>
                                        <Ionicons name='checkbox' color={propertyAmenities.indexOf(value.name) == -1 ? 'white' : PRIMARYCOLOR} size={27}/>
                                    </Pressable>
                                   
                                ))}
                            </AmenitiesContainer>
                            </ScrollView>
                        </InputContainer>
                    </PostingSection>

                    <PostingSection>
                        <Heading>Property Details</Heading>
                        <Subheading>Enter details of what tenant have access to</Subheading>
                        <RowContainerCol>
                            <View style={{flexDirection: 'row', alignItems:'center'}}>
                            <FontAwesomeIcon icon={faBed} color='white' size={20}/>
                                <CategoryName>Bed</CategoryName>
                            </View>
                            <CounterContainer>
                                <Pressable hitSlop={WIDTH*0.1}>
                                    <Ionicons name="remove-circle" color='white' size={30}  onPress={propertyNumBed > 0 ? ()=> setpropertyNumBed(propertyNumBed-1) : null}/>
                                </Pressable>
                                <BedroomCountContaienr>
                                    <BedroomBathroomCountText>{propertyNumBed}</BedroomBathroomCountText>
                                </BedroomCountContaienr>
                                <Pressable hitSlop={WIDTH*0.1}>
                                    <Ionicons name="add-circle" color='white' size={30} onPress={propertyNumBed < 10 ? ()=> setpropertyNumBed(propertyNumBed+1) : null}/>
                                </Pressable>
                            </CounterContainer>
                            {/* <BedroomContaienr>
                                {bedroomList.map((value) => (
                                    <BedroomItemContainer hitSlop={WIDTH*0.05} onPress={() => setpropertyNumBed(value)} userInput={propertyNumBed} value={value}
                                        key={"bedroom" + value}>
                                        <Text style={{ color: value == propertyNumBed ? 'black' : 'white', fontWeight: '500' }}>{value.replace("P","+")}</Text>
                                    </BedroomItemContainer>
                                ))}
                            </BedroomContaienr> */}
                        </RowContainerCol>

                        <RowContainerCol>
                            <View style={{flexDirection: 'row', alignItems:'center'}}>
                                
                                <FontAwesomeIcon icon={faBath} color='white' size={20}/>
                               
                                <CategoryName>Bathroom</CategoryName>
                            </View>
                            <CounterContainer>
                                <Pressable hitSlop={WIDTH*0.1}>
                                    <Ionicons name="remove-circle" color='white' size={30} onPress={propertyNumBath > 0 ? ()=> setpropertyNumBath(propertyNumBath-1) : null} />
                                </Pressable>
                                <BedroomCountContaienr>
                                    <BedroomBathroomCountText>{propertyNumBath}</BedroomBathroomCountText>
                                </BedroomCountContaienr>
                                <Pressable hitSlop={WIDTH*0.1}>
                                    <Ionicons name="add-circle" color='white' size={30} onPress={propertyNumBath < 10 ? ()=> setpropertyNumBath(propertyNumBath+1) : null }/>
                                </Pressable>
                            </CounterContainer>
                        
                        </RowContainerCol>

                    </PostingSection>

                    {/* Enter description  */}
                    <PostingSection>
                        <Heading >Sublease description (Optional)</Heading>
                        <Subheading>Enter useful information about the sublease that would help tenants</Subheading>

                        <PropertyDescriptionInput placeholder="It is 5 minutes from campus..."
                            value={propertyDescription} onChangeText={(value) => setpropertyDescription(value)} multiline={true}
                            placeholderTextColor={MEDIUMGREY} maxLength={700} />
                        <MaxText length={propertyDescription.length}>{propertyDescription.length} / 700</MaxText>
                    </PostingSection>


                    <PostingSection>
                        <Heading>One <Text style={{color: PRIMARYCOLOR}}>last</Text> step,</Heading>
                        <Heading>you're almost done!</Heading>
                        
                        <Lottie source={require('../../../postingfirstpage.json')}  autoPlay={scrollviewIndex == 0 ? true : false} loop style={{marginTop: HEIGHT*0.025, width:WIDTH*0.9, height: WIDTH*0.9, }}/>

                    </PostingSection>


                    <PostingSection>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <Heading>Review</Heading>
                            <Subheading>Please ensure all information is correct and accurate</Subheading>

                            <ReviewSectionContainer style={{marginTop: HEIGHT*0.025}}>
                                <View style={{ width: WIDTH*0.9, height: HEIGHT * 0.4, borderRadius: 10, }}>
                                    <Image source={{ uri: headerImage == null ? propertyBedroomImage == null ? null : propertyBedroomImage: headerImage }}
                                        style={{ width: '100%', height: '100%', borderRadius: 10, borderWidth: 1, borderColor: MEDIUMGREY }} />
                                </View>
                                <ReviewHeading style={{ marginTop: HEIGHT * 0.02 }}>Gallery <Text style={{fontSize: HEIGHT*0.015}}> (Press and hold images below to edit)</Text></ReviewHeading>
                                <PropertyPhotoContainer >

                                    <TouchableOpacity key={"bedroomPic"} hitSlop={WIDTH*0.05} onLongPress={()=> {editImageGalleryInReview("Bedroom")}} onPress={() => setHeaderImage(propertyBedroomImage)}>
                                        <PhotoContainer >
                                            <Image source={{ uri: propertyBedroomImage == null ? null : propertyBedroomImage }}
                                                style={{ height: '100%', width: '100%', backgroundColor: LIGHTGREY, borderRadius: 15 }} />
                                            {/* <Text>{propertyphotoGallery[index]}</Text> */}
                                        </PhotoContainer>
                                    </TouchableOpacity>
                                    <TouchableOpacity key={"bathRoomPic"} hitSlop={WIDTH*0.05} onLongPress={()=> {editImageGalleryInReview("Bathroom")}} onPress={() => setHeaderImage(propertyBathroomImage)}>
                                        <PhotoContainer >
                                            <Image source={{ uri: propertyBathroomImage == null ? null : propertyBathroomImage}}
                                                style={{ height: '100%', width: '100%', backgroundColor: LIGHTGREY, borderRadius: 15 }} />
                                            {/* <Text>{propertyphotoGallery[index]}</Text> */}
                                        </PhotoContainer>
                                    </TouchableOpacity>
                                    <TouchableOpacity key={"livingRoomPic"} hitSlop={WIDTH*0.05} onLongPress={()=> {editImageGalleryInReview("Living Room")}} onPress={() => setHeaderImage(propertyLivingroomImage)}>
                                        <PhotoContainer >
                                            <Image source={{ uri: propertyLivingroomImage == null ? null : propertyLivingroomImage}}
                                                style={{ height: '100%', width: '100%', backgroundColor: LIGHTGREY, borderRadius: 15 }} />
                                            {/* <Text>{propertyphotoGallery[index]}</Text> */}
                                        </PhotoContainer>
                                    </TouchableOpacity>
                                    <TouchableOpacity key={"kitchenPic"} hitSlop={WIDTH*0.05}  onLongPress={()=> {editImageGalleryInReview("Kitchen")}} onPress={() => setHeaderImage(propertyKitchenImage)}>
                                        <PhotoContainer >
                                            <Image source={{ uri: propertyKitchenImage == null ? null : propertyKitchenImage }}
                                                style={{ height: '100%', width: '100%', backgroundColor: LIGHTGREY, borderRadius: 15 }} />
                                            {/* <Text>{propertyphotoGallery[index]}</Text> */}
                                        </PhotoContainer>
                                    </TouchableOpacity>
                                    <TouchableOpacity key={"floorplanPic"}  hitSlop={WIDTH*0.05} onLongPress={()=> {editImageGalleryInReview("Floor Plan")}} onPress={() => setHeaderImage(propertyFloorplanImage)}>
                                        <PhotoContainer >
                                            <Image source={{ uri: propertyFloorplanImage == null ? null : propertyFloorplanImage}}
                                                style={{ height: '100%', width: '100%', backgroundColor: LIGHTGREY, borderRadius: 15 }} />
                                            {/* <Text>{propertyphotoGallery[index]}</Text> */}
                                        </PhotoContainer>
                                    </TouchableOpacity>

                                </PropertyPhotoContainer>
                            </ReviewSectionContainer>

                            <ReviewSectionContainer>
                                <ReviewHeadingAndEditContainer>
                                    <ReviewHeading>Type</ReviewHeading>
                                    <Ionicons name="create-outline" hitSlop={WIDTH*0.05} color='white' size={25} onPress={()=>moveScrollView(1)}/>
                                </ReviewHeadingAndEditContainer>
                                <ReviewInfoText>{propertyType} for sublease</ReviewInfoText>
                            </ReviewSectionContainer>

                            <ReviewSectionContainer>
                                <ReviewHeadingAndEditContainer>
                                    <ReviewHeading>Location</ReviewHeading>
                                    <Ionicons name="create-outline" hitSlop={WIDTH*0.05} color='white' size={25} onPress={()=>moveScrollView(2)}/>
                                </ReviewHeadingAndEditContainer>
                                <ReviewLocationContainer>
                                    <Ionicons name='location-outline' size={20} color='white' />
                                    <ReviewInfoText style={{ marginLeft: WIDTH * 0.02, paddingTop: 0 }}>{propertyLocation}</ReviewInfoText>
                                </ReviewLocationContainer>
                            </ReviewSectionContainer>

                            <ReviewSectionContainer>
                                <ReviewHeadingAndEditContainer>
                                    <ReviewHeading>Price</ReviewHeading>
                                    <Ionicons name="create-outline" hitSlop={WIDTH*0.05} color='white' size={25} onPress={()=>moveScrollView(4)}/>
                                </ReviewHeadingAndEditContainer>
                                <ReviewInfoText><Text style={{fontWeight:'400'}}>Rent: </Text> ${propertyPrice} / month</ReviewInfoText>
                                {propertySecurityDeposit != null && propertySecurityDeposit.trim() != "" &&
                                <ReviewInfoText><Text style={{fontWeight:'400'}}>Security deposit: </Text> ${propertySecurityDeposit}</ReviewInfoText>
                                }
                            </ReviewSectionContainer>

                            <ReviewSectionContainer>
                                <ReviewHeadingAndEditContainer>
                                    <ReviewHeading>Availability</ReviewHeading>
                                    <Ionicons name="create-outline" hitSlop={WIDTH*0.05} color='white' size={25}  onPress={()=>moveScrollView(5)}/>
                                </ReviewHeadingAndEditContainer>
                                    <ReviewInfoText>From        {new Date(propertydateFrom).toDateString()}</ReviewInfoText>
                                    <ReviewInfoText>To             {new Date(propertydateTo).toDateString()}</ReviewInfoText>

                                    <ReviewInfoText><Text style={{fontWeight:'400'}}>Flexible: </Text>  {propertydateFlexible == true ? "Yes" : "No"}</ReviewInfoText>
                            </ReviewSectionContainer>

                            <ReviewSectionContainer>
                                <ReviewHeadingAndEditContainer>
                                    <ReviewHeading>Details</ReviewHeading>
                                    <Ionicons name="create-outline" hitSlop={WIDTH*0.05} color='white' size={25}  onPress={()=>moveScrollView(7)}/>
                                </ReviewHeadingAndEditContainer>
                                <BedAndBathContainer>
                                    <FontAwesomeIcon icon={faBed} color='white' size={20}/>
                                    <ReviewInfoText style={{paddingTop:0, marginLeft: WIDTH*0.02}}>{propertyNumBed} Bed</ReviewInfoText>
                                </BedAndBathContainer>
                                <BedAndBathContainer>
                                    <FontAwesomeIcon icon={faBath} color='white' size={18}/>
                                    <ReviewInfoText style={{paddingTop:0, marginLeft: WIDTH*0.02}}>{propertyNumBath} Bathroom</ReviewInfoText>
                                </BedAndBathContainer>
                            </ReviewSectionContainer>

                            
                            <ReviewSectionContainer>
                                <ReviewHeadingAndEditContainer>
                                    <ReviewHeading>Description</ReviewHeading>
                                    <Ionicons name="create-outline" hitSlop={WIDTH*0.05} color='white' size={25}  onPress={()=>moveScrollView(8)}/>
                                </ReviewHeadingAndEditContainer>
                                <ReviewPropertyDescriptionInput editable={false} value={propertyDescription} multiline={true} />
                            </ReviewSectionContainer>

                            
                            <ReviewSectionContainer style={{borderBottomWidth: 0}}>
                                <ReviewHeadingAndEditContainer>
                                    <ReviewHeading>Amenities</ReviewHeading>
                                    <Ionicons name="create-outline" hitSlop={WIDTH*0.05} color='white' size={25}  onPress={()=>moveScrollView(6)}/>
                                </ReviewHeadingAndEditContainer>
                                <View>
                                    {propertyAmenities.map((value) => (
                                        <ReviewLocationContainer key={"amenities" + value}>
                                            {GetFAIcons(value)}
                                            <ReviewInfoText style={{ marginLeft: WIDTH * 0.05, paddingTop:0 }}>{value.replaceAll("_", " ")}</ReviewInfoText>
                                        </ReviewLocationContainer>
                                    ))}
                                </View>
                            </ReviewSectionContainer>
                           
                            {/* <SearchInput style={{backgroundColor:'white', color:'black'}}placeholderTextColor='white' 
                            // onEndEditing={SelectLocationOutSequence}

                                value={title} onChangeText={(value) => setTitle(value)} placeholder="Location..." /> */}
                                 <View style={{height: HEIGHT*0.3, width: WIDTH}}/>

                        </ScrollView>
                        {/* <Footer>
                           
                                <PricePerMonth>{propertyPrice} <Text style={{ fontSize: HEIGHT * 0.025, fontWeight: '500', color: 'white' }}>/ month</Text></PricePerMonth>
                                <ContactTanentButton loading={loading} hitSlop={WIDTH*0.05} onPress={postproperty}>
                                {loading ? 
                                    <Lottie source={require('../../../loadingAnim.json')} autoPlay loop style={{width:WIDTH*0.2, height: WIDTH*0.2, }}/>
                                :
                                    <Text style={{ color: 'white', fontWeight: '700' }}>Post</Text>
                                }
                                </ContactTanentButton>
                           
                           
                        </Footer> */}


                    </PostingSection>


                </Animated.ScrollView>

                <NextContainer>
                    {(scrollviewIndex == 0 || scrollviewIndex == 10) ?
                    <ContinueButton loading={loading} disabled={loading} hitSlop={WIDTH*0.05} onPress={() => {scrollviewIndex == 10 ? postproperty() : moveScrollView(scrollviewIndex + 1)}}>
                        <ContinueText>
                            {scrollviewIndex == 0 ? "Start" :  loading ? 
                            <Lottie source={require('../../../loadingAnim.json')} autoPlay loop style={{width:WIDTH*0.1, height: WIDTH*0.1, }}/>
                            :
                            "Post"}
                        </ContinueText>
                    </ContinueButton>
                    :
                    <BackNextContainer>
                       
                        <Pressable disabled={loading}  hitSlop={WIDTH*0.05} onPress={() =>{ !reviewing && moveScrollView(scrollviewIndex - 1)}}>
                            <BackText>{reviewing ? null : "Back"}</BackText>
                        </Pressable>
                       
                        <SmallContinueButton disabled={loading} onPress={() => {reviewing ? checkReviewEdit() : moveScrollView(scrollviewIndex + 1)}}>
                            <ContinueText>{reviewing ? "Review" : "Next"}</ContinueText>
                        </SmallContinueButton>
                       
                    </BackNextContainer>
                    }
                </NextContainer>
            </SafeAreaView>
            </ModalView>
        </SafeAreaView>
    )

}
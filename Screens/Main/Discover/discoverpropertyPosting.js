import React, { useState, useEffect, useRef } from 'react';

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
    Image,
    Animated,
    Pressable,
    FlatList,
    KeyboardAvoidingView,
    TouchableOpacity
} from 'react-native';

//Icons
import Ionicons from 'react-native-vector-icons/Ionicons';
Ionicons.loadFont()
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import DatePicker from 'react-native-date-picker'

import SecureStorage, { ACCESS_CONTROL, ACCESSIBLE, AUTHENTICATION_TYPE } from 'react-native-secure-storage'


FontAwesome.loadFont();

const ImageName = [
    { name: "Bedroom", des: "Please upload an image of where teanant will be sleeping.", icon: "bed-outline" },
    { name: "Bathroom", des: "Please upload an image of bathroom where teanant can use.", icon: "water-outline" },
    { name: "Living Room", des: "Please upload an image of common space / shared space." , icon: "tv-outline"},
    { name: "Kitchen", des: "Please upload an image of kitchen / cooking area." , icon: "fast-food-outline"},
    { name: "Floor Plan", des: "Please upload an image of property floor plan.", icon: "logo-stackoverflow" },
]

const amenitiesList =
    [{ name: 'Pets Allowed', color: '#57b2f7', icon: "paw-outline" },
    { name: 'Mattress  ', color: '#fa4b4b', icon: 'bed-outline' },
    { name: 'Able to renew', color: '#f79c40', icon: 'refresh-outline' },
    { name: 'Gym', color: '#00d14d', icon: 'barbell-outline' },
    { name: 'On-site Washer and Dryer', color: '#f79c40', icon: 'water-outline' },
    { name: 'Wifi', color: '#00d14d', icon: 'wifi-outline' },
    { name: 'Furnished', color: '#fa4b4b', icon: 'desktop-outline' },
    { name: 'Utilities Included', color: '#57b2f7', icon: 'power-outline' },
    { name: 'Pool', color: '#f79c40', icon: 'flask-outline' },
    { name: 'Parking   ', color: '#57b2f7', icon: 'car-outline' },
    { name: 'TV', color: '#fa4b4b', icon: 'tv-outline' },
    { name: 'Heating and Cooling', color: '#fa4b4b', icon: 'thermometer-outline' },
    ]

const bedroomList = ["Studio", "2", "3", "4+"]
const bathroomList = ["1", "2", "3", "4+"]



const PRIMARYCOLOR = '#4050B5'
const PRIMARYGREY = '#5e5d5d'

const HEIGHT = Dimensions.get('screen').height;
const WIDTH = Dimensions.get('screen').width;

import {
    ModalView, Heading, ButtonContainer, ImageContainer, NextContainer, InfoText, ContinueButton,
    ContinueText, PostingSection, InfoTextSection2, SearchContainer, SearchInput, Subheading,
    InputContainer, DateSelectContainer, DateContainer, DateSelectPressable, BedBathInput, AmenitiesContainer,
    PropertyPhotoContainer, PhotoContainer, PropertyDescriptionInput, Divider, ReviewInfoText, ReviewSectionContainer,
    BedAndBathContainer, BedBathLogo, LocationText, ReviewPropertyDescriptionInput, Footer, ContactTanentButton,
    PricePerMonth, PropertyTypeCard, PriceInputSearchContainer, CategoryName, RowContainer, RowValueContainer, RowName,
    FollowUpContainer, FollowUpText, DateCategoryName, BedroomContaienr, BedroomItemContainer, RowContainerCol,
    ReviewHeading, ReviewLocationContainer, ReviewDateContainer, ImageSelectionContainer, ImageText
} from './discoverPropertyPostingStyle';
import Easing from 'react-native/Libraries/Animated/Easing';
import { DARKGREY, LIGHTGREY, MEDIUMGREY } from '../../../sharedUtils';
import { TopContainer } from '../Profile/profileEditStyle';
import { SubHeadingText } from '../../Onboarding/Landing/landingStyle';


export default function PropertyPostingScreen({ navigation }) {

    const flatListdata =
        [{ name: "Room", image: require('../../../assets/room.jpeg'), description: "Shared public space" },
        { name: "House", image: require('../../../assets/house.jpeg'), description: "Entire House" },
        { name: "Apartment", image: require('../../../assets/apartment.jpeg'), description: "2+ Bedroom Apartment" },
        { name: "Studio", image: require('../../../assets/studio.jpeg'), description: "Open-styled apartment" }
    ]

    //Posting data information 
    const [propertyType, setpropertyType] = useState('')
    const [propertyLocation, setpropertyLocation] = useState('')
    const [propertyphotoGallery, setpropertyphotoGallery] = useState([])
    const [propertydateFrom, setpropertydateFrom] = useState(new Date())
    const [propertydateTo, setpropertydateTo] = useState(new Date())
    const [propertyNumBed, setpropertyNumBed] = useState('');
    const [propertyNumBath, setpropertyNumBath] = useState('');
    const [propertyPrice, setpropertyPrice] = useState('');
    const [propertyDescription, setpropertyDescription] = useState('')
    const [propertyAmenities, setpropertyAmenities] = useState([])
    const [propertyPriceNego, setPropertyPriceNego] = useState(false)

    const [propertyBedroomImage, setPropertyBedroomImage] = useState(null)
    const [propertyBathroomImage, setPropertyBathroomImage] = useState(null)
    const [propertyLivingroomImage, setPropertyLivingroomImage] = useState(null)
    const [propertyKitchenImage, setPropertyKitchenImage] = useState(null)
    const [propertyFloorplanImage, setPropertyFloorPlanImage] = useState(null)

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
    const SearchHeightTranslation = useRef(new Animated.Value(0)).current;


    function moveScrollView(val) {
        Keyboard.dismiss()
        if (val < 0) {
            navigation.goBack();
        }
        else {
            setscrollviewIndex(val)
            // sequence()
            console.log("Type: " + propertyType)
            console.log("Address: " + propertyLocation)
            console.log("Images: " + propertyphotoGallery.length)
            console.log("Price: " + propertyPrice)
            console.log("Negotiable: " + propertyPriceNego)
            console.log("Description: " + propertyDescription)
            console.log("AvailableFrom: " + propertydateFrom.getTime())
            console.log("AvailableTo: " + propertydateTo.getTime())
            console.log("Bed: " + propertyNumBed)
            console.log("Bath: " + propertyNumBath)
            console.log("AmenitiesList: ")
            propertyAmenities.forEach(element => {
                console.log(element)
            });
            console.log("====================")
            setTimeout(() => {
                scrollView.current.scrollTo({ x: WIDTH * val });
                setscrollviewIndex(val)
            }, 100)
            return
        }

    }

    // function sequence(){
    //     Animated.sequence([
    //         Animated.spring(OpacityTranslation,{
    //             toValue: 0,
    //             duration:200, 
    //             useNativeDriver:false,
    //         }),
    //         Animated.spring(OpacityTranslation,{
    //             toValue: 1,
    //             duration:300, 
    //             delay:500,
    //             useNativeDriver:false,
    //         })
    //     ]).start()
    // }

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
        if (query != "") {
            var config = {
                method: 'get',
                url: `https://maps.googleapis.com/maps/api/place/queryautocomplete/json?input=${query}&country:us&types=address&location=37.76999%2C-122.44696&radius=4000&strictbounds=true&key=AIzaSyBLCfWwROY3Bfvq_TOnDjX90wn2nCJF2nA`,
            };
            axios(config)
                .then(function (response) {
                    setautocompleteLocation([]);
                    let JSONdata = response.data
                    for (let name of JSONdata.predictions) {

                        setautocompleteLocation(prevArray => [...prevArray, name])

                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    }

    //Render individual card items for PropertyType in posting page
    const renderItem = ({ item, index }) => (
        <Pressable onPress={() => setpropertyType(item.name)}
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
        console.log("Posting")
        const accessToken = await SecureStorage.getItem("refreshToken");
        console.log(propertyphotoGallery);
        const postingData = new FormData();

        postingData.append("type", propertyType);                       //String 
        postingData.append("streetAddr", propertyLocation);               //String 
        postingData.append("secondaryTxt", propertyLocation);               //String 
        postingData.append("latitude", 37.175)
        postingData.append("longitude", -122.278)
        //String Array

        var array = propertyBedroomImage.uri.split(".");

        postingData.append("propertyImages", {
            uri: propertyBedroomImage.uri,
            type: 'image/' + array[1],
            name: 'someName',
        });

        var array = propertyBathroomImage.uri.split(".");
        postingData.append("propertyImages", {
            uri: propertyBathroomImage.uri,
            type: 'image/' + array[1],
            name: 'someName',
        });
        var array = propertyLivingroomImage.uri.split(".");

        postingData.append("propertyImages", {
            uri: propertyLivingroomImage.uri,
            type: 'image/' + array[1],
            name: 'someName',
        });

        var array = propertyKitchenImage.uri.split(".");

        postingData.append("propertyImages", {
            uri: propertyKitchenImage.uri,
            type: 'image/' + array[1],
            name: 'someName',
        });


        var array = propertyFloorplanImage.uri.split(".");
        postingData.append("propertyImages", {
            uri: propertyFloorplanImage.uri,
            type: 'image/' + array[1],
            name: 'someName',
        });


        postingData.append("price", propertyPrice);                     //String 
        postingData.append("description", propertyDescription);         //String 
        postingData.append("availableFrom", propertydateFrom.toString());          //String
        postingData.append("availableTo", propertydateTo.toString());              //String
        postingData.append("bed", propertyNumBed);                      //String
        postingData.append("bath", propertyNumBath);                    //String 
        postingData.append("title", "Name");                    //String
        // postingData.append("propertyAmenities", propertyAmenities);     //Array of String 
        postingData.append("timePosted", new Date().toString())
        postingData.append("amenities", "furnished");
        postingData.append("amenities", "moveinFlexibility");                  //Array of String 
        postingData.append("amenities", "renew");                              //Array of String 
        postingData.append("amenities", "pets");                               //Array of String 
        postingData.append("amenities", "parking");                            //Array of String 
        postingData.append("amenities", "onSiteWasherDryer");                  //Array of String 
        postingData.append("amenities", "sharedRoom");                         //Array of String 
        postingData.append("amenities", "utilitiesIncluded");                  //Array of String 

        console.log("AccessToken")
        console.log(accessToken)
        fetch('https://sublease-app.herokuapp.com/properties', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data',
                'Authorization': 'bearer ' + accessToken
            },
            body: postingData,
        })
            .then((response) => response.json()).then(data => {
                // if(response.status == 401){
                //     alert("Fuck you scumbag.")
                // }
                // else if(response.status == 200){
                //     alert("Success")
                // }
                navigation.goBack()
                console.log(data)
            })
            .catch(e => {
                alert(e)
            })

    }



    async function selectGallery(name) {


        const result = await launchImageLibrary({quality: 0.2});
        if (!result.didCancel) {

            if (name == "Bedroom") {
                setPropertyBedroomImage(result.assets[0]);
            }
            else if (name == "Bathroom") {
                setPropertyBathroomImage(result.assets[0]);
            }
            else if (name == "Living Room") {
                setPropertyLivingroomImage(result.assets[0]);
            }
            else if (name == "Kitchen") {
                setPropertyKitchenImage(result.assets[0]);
            }
            else if (name == "Floor Plan") {
                setPropertyFloorPlanImage(result.assets[0]);
            }

        }


    }

    function updateImages(index) {
        setHeaderImage(propertyphotoGallery[index].uri);
    }
    const startingvalue = HEIGHT * 0.1;
    const [expanded, setexpended] = useState(true)
    const heighttranslation = useRef(new Animated.Value(startingvalue)).current;
    useEffect(() => {
        testing();
        console.log("Useeffect")
        //   getTokens
    }, [expanded])

    // async function getTokens(){
    //     const accessToken = await SecureStorage.getItem("accessToken");


    // }

    function testing() {
        Animated.timing(heighttranslation, {
            toValue: expanded ? startingvalue : 0,
            duration: 300,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
        }).start()
    }

    function moveOn(name) {
        Keyboard.dismiss()
        setpropertyLocation(name)

    }





    return (
        <SafeAreaView style={{ width: WIDTH, height: HEIGHT, margin: 0, padding: 0 }} >
            <TouchableOpacity style={{paddingLeft:WIDTH*0.05}} onPress={()=>navigation.navigate('Profile')}>
                <Text style={{color: DARKGREY, fontWeight:'500'}}>Cancel Posting</Text>
            </TouchableOpacity>
            <ModalView>
                <ButtonContainer>
                    <Pressable onPress={() => moveScrollView(scrollviewIndex - 1)} style={{ width: WIDTH * 0.1 }}>
                        <Ionicons name="arrow-back-outline" size={30} color='white'></Ionicons>
                    </Pressable>
                    <Pressable style={{ display: scrollviewIndex == 10 || scrollviewIndex == 9 || scrollviewIndex == 0 ? 'none' : 'flex', }}
                        onPress={() => moveScrollView(scrollviewIndex + 1)}>
                        <Ionicons name="checkmark-done-outline" size={30} color={PRIMARYCOLOR}></Ionicons>
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
                        <Heading>Sublease your property in just a few steps </Heading>
                        <InfoText>
                            We make subleasing as easy as possible.
                        </InfoText>
                        <ImageContainer>
                            <Image source={require('../../../assets/room.jpeg')} style={{ height: HEIGHT * 0.25, width: '100%', marginTop: HEIGHT * 0.1, borderRadius: 10 }} />
                        </ImageContainer>

                    </PostingSection>

                    {/* Choose apartment type  */}
                    <PostingSection >
                        <Heading>Type of sublease</Heading>
                        <InfoText>
                            Please select your apartment type.
                        </InfoText>

                        <View style={{ marginTop: HEIGHT * 0.015 }}>
                            <FlatList key={() => flatListdata.name} data={flatListdata} renderItem={renderItem} />
                        </View>

                    </PostingSection>

                    {/* Select Address */}

                    <PostingSection >
                        <Animated.View style={{
                            height: TopContainerTranslation
                            , opacity: TopContainerTranslation.interpolate({
                                inputRange: [0, startingvalue],
                                outputRange: [0, 1]
                            })
                        }}>
                            <Heading >Address of sublease </Heading>
                            <InfoText>
                                Enter your property address.
                            </InfoText>
                        </Animated.View>
                        <SearchContainer>
                            <Ionicons name="search-outline" size={20} color='white' />
                            <SearchInput placeholderTextColor='white' onEndEditing={SelectLocationOutSequence}
                                onFocus={SelectLocationSequence} value={propertyLocation} onChangeText={(value) => autocomplete(value)} placeholder="Location..." />
                        </SearchContainer>
                        <Animated.View style={{ width: WIDTH * 0.9, height: HEIGHT * 0.4, borderRadius: 10 }}>

                            {propertyLocation.length != 0 && autocompleteLocation.map((value, index) => (
                                <Pressable key={value.description + index} onPress={() => { setpropertyLocation(value.description), Keyboard.dismiss(), setautocompleteLocation([]), moveScrollView(scrollviewIndex + 1) }} >
                                    <View style={{
                                        width: WIDTH * 0.9, height: HEIGHT * 0.08, paddingLeft: WIDTH * 0.025,
                                        alignItems: 'center', flexDirection: 'row'
                                    }}>
                                        <Ionicons name="location-outline" size={25} color={LIGHTGREY} />
                                        <Pressable style={{ width: WIDTH * 0.8, marginLeft: WIDTH * 0.025 }} onPress={() => moveOn(value.description)}>
                                            <Text style={{ color: 'white', fontSize: HEIGHT * 0.015 }}>{value.structured_formatting.main_text}</Text>
                                            <Text style={{ color: LIGHTGREY, fontSize: HEIGHT * 0.015 }}>{value.structured_formatting.secondary_text}</Text>
                                        </Pressable>
                                    </View>
                                </Pressable>
                            ))}

                        </Animated.View>

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
                                        <ImageContainer onPress={() => selectGallery(value.name)}>
                                            <Ionicons name={value.icon} size={40} color='white' />
                                            <Image
                                                style={{ position: 'absolute', height: '100%', width: '100%', borderRadius: 10 }}
                                                resizeMode='cover'

                                                source={{
                                                    uri:
                                                        value.name == "Bedroom" ? propertyBedroomImage == null ? null : propertyBedroomImage.uri :
                                                            value.name == "Bathroom" ? propertyBathroomImage == null ? null : propertyBathroomImage.uri :
                                                                value.name == "Living Room" ? propertyLivingroomImage == null ? null : propertyLivingroomImage.uri :
                                                                    value.name == "Kitchen" ? propertyKitchenImage == null ? null : propertyKitchenImage.uri :
                                                                        propertyFloorplanImage == null ? null : propertyFloorplanImage.uri
                                                }} />
                                        </ImageContainer>

                                    </ImageSelectionContainer>


                                ))}
                        </ScrollView>

                    </PostingSection>

                    <PostingSection>
                        <Heading>Sublease Price</Heading>
                        <InfoText>
                            Please set property price per month.
                        </InfoText>
                        <PriceInputSearchContainer>
                            <SearchInput keyboardType='number-pad' value={propertyPrice} onChangeText={(value) => setpropertyPrice(value)}
                                placeholder="$ Price" placeholderTextColor='white' />
                        </PriceInputSearchContainer>
                        <FollowUpContainer>
                            <Pressable onPress={() => setPropertyPriceNego(!propertyPriceNego)}>
                                <Ionicons size={20} name={propertyPriceNego ? 'checkbox' : 'checkbox-outline'} color={LIGHTGREY} style={{ paddingVertical: HEIGHT * 0.01 }} />
                            </Pressable>
                            <FollowUpText>Negotiable</FollowUpText>
                        </FollowUpContainer>
                    </PostingSection>

                    {/* Enter description  */}
                    <PostingSection>
                        <Heading >Sublease Description</Heading>

                        <PropertyDescriptionInput placeholder="Enter some basic details of your property. (Optional)"
                            value={propertyDescription} onChangeText={(value) => setpropertyDescription(value)} multiline={true}
                            placeholderTextColor={MEDIUMGREY} />
                    </PostingSection>

                    <PostingSection>
                        <Heading>Availability</Heading>
                        <InfoText>
                            Please select the availability of your property.
                            </InfoText>
                        <InputContainer >
                            <DateSelectContainer>

                                <RowContainer>
                                    <DateCategoryName>Available From</DateCategoryName>
                                    <Ionicons name="shuffle" size={20} color='white' />
                                    <RowValueContainer onPress={() => setOpenFrom(true)} >
                                        <DateSelectPressable onPress={() => setOpenFrom(true)}>
                                            <Text style={{ alignSelf: 'center', color: 'white' }}>{propertydateFrom.getMonth()}-{propertydateFrom.getDate()}-{propertydateFrom.getFullYear()}</Text>
                                        </DateSelectPressable>
                                        <Ionicons name='chevron-forward-outline' size={25} color='white' style={{ paddingLeft: WIDTH * 0.05 }} />
                                    </RowValueContainer>
                                </RowContainer>
                                <RowContainer>
                                    <DateCategoryName>Available To</DateCategoryName>
                                    <Ionicons name="shuffle" size={20} color='white' />
                                    <RowValueContainer onPress={() => setOpenTo(true)}>
                                        <DateSelectPressable onPress={() => setOpenTo(true)}>
                                            <Text style={{ alignSelf: 'center', color: 'white' }}>{propertydateTo.getMonth()}-{propertydateTo.getDate()}-{propertydateTo.getFullYear()}</Text>
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
                                date={propertydateFrom}
                                onConfirm={(date) => {
                                    const correctDate = new Date(date.getFullYear(), (date.getMonth() % 12) + 1, date.getDate())
                                    setOpenFrom(false),
                                        setpropertydateFrom(correctDate)
                                }}
                                onCancel={() => {
                                    setOpenFrom(false)
                                }}
                            />
                            <DatePicker
                              
                                modal
                                mode='date'
                                open={openTo}
                                date={propertydateTo}
                                onConfirm={(date) => {
                                    const correctDate = new Date(date.getFullYear(), (date.getMonth() % 12) + 1, date.getDate())
                                    setOpenTo(false),
                                        setpropertydateTo(correctDate)
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
                                    <BedroomItemContainer onPress={() => setpropertyNumBed(value)} userInput={propertyNumBed} value={value}
                                        key={"bedroom" + value}>
                                        <Text style={{ color: value == propertyNumBed ? 'black' : 'white', fontWeight: '500' }}>{value}</Text>
                                    </BedroomItemContainer>
                                ))}
                            </BedroomContaienr>
                        </RowContainerCol>

                        <RowContainerCol>
                            <CategoryName>Bathroom</CategoryName>
                            <Ionicons name='water-outline' color='white' size={25} style={{ paddingVertical: HEIGHT * 0.015 }} />
                            <BedroomContaienr>
                                {bathroomList.map((value) => (
                                    <BedroomItemContainer onPress={() => setpropertyNumBath(value)} userInput={propertyNumBath} value={value}
                                        key={"bathroom" + value}>
                                        <Text style={{ color: value == propertyNumBath ? 'black' : 'white', fontWeight: '500' }}>{value}</Text>
                                    </BedroomItemContainer>
                                ))}
                            </BedroomContaienr>
                        </RowContainerCol>


                    </PostingSection>

                    <PostingSection>
                        <Heading>More Details</Heading>
                        <InfoText>
                            Select all of the amenitie that are available
                            at this sublease property. Not all may apply
                        </InfoText>
                        <InputContainer >
                            <Subheading>Amenities</Subheading>
                            <AmenitiesContainer>
                                {amenitiesList.map((value, index) => (
                                    <View key={value.name + index + 'view'} style={{
                                        minWidth: WIDTH * 0.35, width: value.name.length * 0.03 * WIDTH, height: HEIGHT * 0.055, justifyContent: 'center',
                                        paddingRight: WIDTH * 0.03
                                    }}>
                                        <Pressable key={value.name + 'pressable'} onPress={() => updateAmenities(value.name)} style={{
                                            borderWidth: 3, borderColor: propertyAmenities.indexOf(value.name) == -1 ? value.color : '#0085FF', height: HEIGHT * 0.045,
                                            borderRadius: 20, justifyContent: 'center', backgroundColor: value.color, flexDirection: 'row', alignItems: 'center'
                                        }}>
                                            <Text key={value.name + 'text'} style={{ justifyContent: 'center', color: 'white' }}>
                                                <Ionicons name={value.icon} size={20} />
                                                {"   "}{value.name}
                                            </Text>
                                        </Pressable>

                                    </View>
                                ))}
                            </AmenitiesContainer>
                        </InputContainer>
                    </PostingSection>

                    <PostingSection>
                        <Heading>One last step!</Heading>
                        <InfoText>
                            Please review your property information before posting.
                        </InfoText>
                        <ImageContainer>
                            <Image source={require('../../../assets/room.jpeg')} style={{ height: HEIGHT * 0.25, width: WIDTH * 0.9, marginTop: HEIGHT * 0.1, borderRadius: 20 }} />
                        </ImageContainer>
                    </PostingSection>


                    <PostingSection>
                        <ScrollView style={{ paddingLeft: WIDTH * 0.05 }} showsVerticalScrollIndicator={false}>
                            <ReviewHeading>Review</ReviewHeading>


                            <View style={{ width: WIDTH, height: HEIGHT * 0.25, paddingBottom: HEIGHT * 0.05, marginTop: HEIGHT * 0.03, borderRadius: 10, }}>
                                <Image source={{ uri: headerImage == null ? propertyBedroomImage == null ? null : propertyBedroomImage.uri : headerImage }}
                                    style={{ width: WIDTH * 0.9, height: HEIGHT * 0.25, borderRadius: 10, borderWidth: 1, borderColor: MEDIUMGREY }} />
                            </View>
                            <ReviewHeading style={{ marginTop: HEIGHT * 0.02 }}>Gallery</ReviewHeading>
                            <PropertyPhotoContainer >

                                <TouchableOpacity key={"bedroomPic"} onPress={() => setHeaderImage(propertyBedroomImage.uri)}>
                                    <PhotoContainer >
                                        <Image source={{ uri: propertyBedroomImage == null ? null : propertyBedroomImage.uri }}
                                            style={{ height: '100%', width: '100%', backgroundColor: LIGHTGREY, borderRadius: 15 }} />
                                        {/* <Text>{propertyphotoGallery[index]}</Text> */}
                                    </PhotoContainer>
                                </TouchableOpacity>
                                <TouchableOpacity key={"bathRoomPic"} onPress={() => setHeaderImage(propertyBathroomImage.uri)}>
                                    <PhotoContainer >
                                        <Image source={{ uri: propertyBathroomImage == null ? null : propertyBathroomImage.uri }}
                                            style={{ height: '100%', width: '100%', backgroundColor: LIGHTGREY, borderRadius: 15 }} />
                                        {/* <Text>{propertyphotoGallery[index]}</Text> */}
                                    </PhotoContainer>
                                </TouchableOpacity>
                                <TouchableOpacity key={"livingRoomPic"} onPress={() => setHeaderImage(propertyLivingroomImage.uri)}>
                                    <PhotoContainer >
                                        <Image source={{ uri: propertyLivingroomImage == null ? null : propertyLivingroomImage.uri }}
                                            style={{ height: '100%', width: '100%', backgroundColor: LIGHTGREY, borderRadius: 15 }} />
                                        {/* <Text>{propertyphotoGallery[index]}</Text> */}
                                    </PhotoContainer>
                                </TouchableOpacity>
                                <TouchableOpacity key={"kitchenPic"} onPress={() => setHeaderImage(propertyKitchenImage.uri)}>
                                    <PhotoContainer >
                                        <Image source={{ uri: propertyKitchenImage == null ? null : propertyKitchenImage.uri }}
                                            style={{ height: '100%', width: '100%', backgroundColor: LIGHTGREY, borderRadius: 15 }} />
                                        {/* <Text>{propertyphotoGallery[index]}</Text> */}
                                    </PhotoContainer>
                                </TouchableOpacity>
                                <TouchableOpacity key={"floorplanPic"} onPress={() => setHeaderImage(propertyFloorplanImage.uri)}>
                                    <PhotoContainer >
                                        <Image source={{ uri: propertyFloorplanImage == null ? null : propertyFloorplanImage.uri }}
                                            style={{ height: '100%', width: '100%', backgroundColor: LIGHTGREY, borderRadius: 15 }} />
                                        {/* <Text>{propertyphotoGallery[index]}</Text> */}
                                    </PhotoContainer>
                                </TouchableOpacity>

                            </PropertyPhotoContainer>

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
                                        <LocationText>{propertyNumBath} bathroom</LocationText>
                                    </BedBathLogo>
                                </BedAndBathContainer>
                            </ReviewSectionContainer>
                            <ReviewSectionContainer>
                                <ReviewHeading>Description</ReviewHeading>
                                <ReviewPropertyDescriptionInput editable={false} value={propertyDescription} multiline={true} />
                            </ReviewSectionContainer>

                            <ReviewSectionContainer>
                                <ReviewHeading>Location</ReviewHeading>
                                <ReviewLocationContainer>
                                    <Ionicons name='location-outline' size={20} color='white' />
                                    <ReviewInfoText style={{ marginLeft: WIDTH * 0.05 }}>{propertyLocation}</ReviewInfoText>
                                </ReviewLocationContainer>

                            </ReviewSectionContainer>
                            <ReviewSectionContainer>
                                <ReviewHeading>Availability</ReviewHeading>
                                <ReviewDateContainer>
                                    <ReviewInfoText>From {propertydateFrom.getMonth()}-{propertydateFrom.getDate()}-{propertydateFrom.getFullYear()}</ReviewInfoText>
                                    <Ionicons name='shuffle-outline' size={20} color='white' />
                                    <ReviewInfoText>To {propertydateTo.getMonth()}-{propertydateTo.getDate()}-{propertydateTo.getFullYear()}</ReviewInfoText>
                                </ReviewDateContainer>
                            </ReviewSectionContainer>
                            <ReviewSectionContainer>
                                <ReviewHeading>Amenities</ReviewHeading>
                                {propertyAmenities.map((value) => (
                                    <ReviewLocationContainer key={"amenities" + value}>
                                        <Ionicons name='location-outline' size={20} color='white' />
                                        <ReviewInfoText style={{ marginLeft: WIDTH * 0.05 }}>{value}</ReviewInfoText>
                                    </ReviewLocationContainer>
                                ))}
                            </ReviewSectionContainer>

                        </ScrollView>
                        <Footer>
                            <PricePerMonth>$700 <Text style={{ fontSize: HEIGHT * 0.025, fontWeight: '500', color: 'white' }}>/ month</Text></PricePerMonth>
                            <ContactTanentButton onPress={postproperty}>
                                <Text style={{ color: 'white', fontWeight: '700' }}>Post</Text>
                            </ContactTanentButton>
                        </Footer>


                    </PostingSection>


                </Animated.ScrollView>

                <NextContainer style={{ display: scrollviewIndex == 0 || scrollviewIndex == 9 ? 'flex' : 'none' }}>
                    <ContinueButton onPress={() => moveScrollView(scrollviewIndex + 1)}>
                        <ContinueText>
                            {scrollviewIndex == 0 ? "Start" : "Review"}
                        </ContinueText>
                    </ContinueButton>
                </NextContainer>
            </ModalView>
        </SafeAreaView>
    )

}
import React, {useState, useEffect, useRef} from 'react';

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

import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import DatePicker from 'react-native-date-picker'


FontAwesome.loadFont();

const amenitiesList = 
[{name:'Pets Allowed', color: '#85CBFF'},
{name: 'Mattress  ', color: '#C0C0C0'},
{name: 'Able to renew', color:'#FFC58D'},
{name: 'Gym', color:'#FFC58D'},
{name: 'On-site Washer and Dryer', color:'#FFC58D'},
{name: 'Wifi', color:'#AEFFF0'},
{name: 'Furnished', color: '#AEFFF0'},
{name: 'Utilities Included', color:'#85CBFF'},
{name: 'Pool', color:'#FFC58D'},
{name: 'Parking   ', color:'#85CBFF'},
{name: 'TV', color:'#FF8B8B'},
{name: 'Heating and Cooling', color:'#FF8B8B'},
]



const PRIMARYCOLOR = '#4050B5'
const PRIMARYGREY = '#5e5d5d'

const HEIGHT = Dimensions.get('screen').height;
const WIDTH = Dimensions.get('screen').width;

import { ModalView, Heading, ButtonContainer, ImageContainer, NextContainer,InfoText, ContinueButton,
    ContinueText, PostingSection,InfoTextSection2, SearchContainer, SearchInput, Subheading,
    InputContainer, DateSelectContainer, DateContainer, DateSelectPressable, BedBathInput, AmenitiesContainer,
    PropertyPhotoContainer, PhotoContainer, PropertyDescriptionInput, Divider, ReviewInfoText,ReviewSectionContainer,
    BedAndBathContainer, BedBathLogo, LocationText, ReviewPropertyDescriptionInput, Footer, ContactTanentButton,
    PricePerMonth,PropertyTypeCard} from './discoverPropertyPostingStyle';
import Easing from 'react-native/Libraries/Animated/Easing';


export default function PropertyPostingScreen({navigation}){

    const flatListdata =[{name: "Room", image: require('../../../assets/room.jpeg'), description: "Shared space" },
    {name: "House", image: require('../../../assets/house.jpeg'), description: "Entire House"},
    {name: "Apartment", image: require('../../../assets/apartment.jpeg'), description:"2+ Bedroom Apartment"},
    {name: "Studio", image: require('../../../assets/studio.jpeg'), description: "1 Bedroom Apartment"}]

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

    //Sets DatePicker Modal Visibility
    const [openFrom, setOpenFrom] = useState(false)
    const [openTo, setOpenTo] = useState(false)

    //Type      - useRef(number), useState(number), function
    //Control the flow of the property posting scrollview 
    const scrollView = useRef();
    const [scrollviewIndex, setscrollviewIndex] = useState(0)
    function moveScrollView(){
        if(scrollviewIndex < 0 ){
           navigation.navigate("Discover")
        }
        else{
            scrollView.current.scrollTo({x:WIDTH*scrollviewIndex});
        }
    }

    //Type     - String 
    //Function -  the Big profile image when selecting images to upload. Default to propertyphotoGallery[0] if not null
    const [headerImage, setHeaderImage] = useState()
    // Sets placeholders when photoGallery is null
    let test=["","","","",""]
    
    //Type      - Array, Function for autocomplete
    //Function  - Stroes the autocomplete locations when user type in input 
    const [autocompleteLocation, setautocompleteLocation] = useState([]);
    var axios = require('axios');

    function autocomplete(query){
        if(query == ""){
            setautocompleteLocation([]);
        }
        setpropertyLocation(query);
        if(query != ""){
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
                    console.log(name);
                }        
            })
            .catch(function (error) {
                console.log(error);
            });
        }
    } 

    //Render individual card items for PropertyType in posting page
    const renderItem = ({ item, index }) => (
        <Pressable  onPress={()=> setpropertyType(item.name)} style={{width:WIDTH*0.45, height:WIDTH*0.45, backgroundColor: propertyType == item.name ? PRIMARYCOLOR : 'white', borderRadius: 15, marginLeft:HEIGHT*0.01,marginTop:HEIGHT*0.01}}>
            <View style={{height:WIDTH*0.35, width:WIDTH*0.45, padding:WIDTH*0.01}}>
                <Image source={item.image}  style={{height:WIDTH*0.34, width:WIDTH*0.43, borderRadius:15}}/>
            </View>
            <View style={{height:WIDTH*0.1, width:WIDTH*0.45, justifyContent:'center'}}>
                <Text style={{alignSelf:'center', fontWeight:'700', color: propertyType == item.name ? 'white' : 'black'}}>{item.name}</Text>
                <Text style={{alignSelf:'center', fontWeight:'300', color: propertyType == item.name ? 'white' : 'black', fontSize:HEIGHT*0.015}}>{item.description}</Text>
            </View>
        </Pressable>
    );

    function updateAmenities(name){

        if(propertyAmenities.indexOf(name) != -1){
            let tempindex = propertyAmenities.indexOf(name);
            setpropertyAmenities([...propertyAmenities.slice(0,tempindex), ...propertyAmenities.slice(tempindex+1,propertyAmenities.length)])
        }
        else{
            setpropertyAmenities(prev=>[...prev, name]);
        }
    }

    function postproperty(){
        console.log(propertyphotoGallery);
        const postingData = new FormData();

        postingData.append("type", propertyType);                       //String 
        postingData.append("location", propertyLocation);               //String 
                 //String Array
       propertyphotoGallery.forEach((item, i) => {
        var array = item.uri.split(".");
        postingData.append("propertyImages", {
            uri: item.uri,
            type: 'image/' + array[1],
            name: 'someName',
        });
    });
    
        postingData.append("price", propertyPrice);                     //String 
        postingData.append("description", propertyDescription);         //String 
        postingData.append("availableFrom", propertydateFrom.toString());          //String
        postingData.append("availableTo", propertydateTo.toString());              //String
        postingData.append("bed", propertyNumBed);                      //String
        postingData.append("bath", propertyNumBath);                    //String 
        postingData.append("propertyAmenities", propertyAmenities);     //Array of String 
        postingData.append("furnished", true);                          //Array of String 
        postingData.append("moveinFlexibility", true);                  //Array of String 
        postingData.append("renew", true);                              //Array of String 
        postingData.append("pets", true);                               //Array of String 
        postingData.append("parking", true);                            //Array of String 
        postingData.append("onSiteWasherDryer", true);                  //Array of String 
        postingData.append("sharedRoom", true);                         //Array of String 
        postingData.append("utilitiesIncluded", true);                  //Array of String 

        fetch('https://sublease-app.herokuapp.com/properties', {
        method: 'POST',
        headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data'
        },
        body: postingData
        }) 
        .then(response =>{
            console.log(response)
            console.log("Successful!")
        })
        .catch(e=>{
            alert(e)
        })

    }


    
    async function selectGallery(index){

        if(index <propertyphotoGallery.length){
            updateImages(index);
        }
        else{
            const result = await launchImageLibrary();
            if(!result.didCancel){

                setpropertyphotoGallery(prev=>[...prev,result.assets[0]])
            }

            else{
            }
        }
    }

    function updateImages(index){
        setHeaderImage(propertyphotoGallery[index].uri);
    }
    const startingvalue = HEIGHT*0.1;
    const [expanded, setexpended] = useState(true)
    const heighttranslation = useRef( new Animated.Value(startingvalue)).current;
     useEffect(()=>{
      moveScrollView();
      testing();
    },[scrollviewIndex, expanded])

    function testing(){
        Animated.timing(heighttranslation,{
        toValue:expanded?startingvalue: 0,
        duration:300, 
        easing: Easing.inOut(Easing.ease),
        useNativeDriver:false,
        }).start()
    }
   

    


    return(
       <View style={{width:WIDTH, height:HEIGHT, margin: 0, padding:0}} >
            <ModalView>
                <ButtonContainer>
                    <Pressable onPress={()=>setscrollviewIndex(scrollviewIndex-1)}>
                        <Ionicons name="arrow-back-outline" size={WIDTH*0.1} color='white'></Ionicons>
                    </Pressable>
                </ButtonContainer>
                <Animated.ScrollView scrollEnabled={false}  horizontal snapToAlignment='end' decelerationRate='fast' snapToInterval={WIDTH} ref={scrollView} onTouchEnd={()=>setexpended(true)} >
                    <PostingSection style={{width:WIDTH, height: HEIGHT*0.8, alignItems:'center'}}>
                        <Heading>Sublease your property in just a few steps </Heading>
                        <ImageContainer>
                            <Image source={require('../../../assets/room.jpeg')} style={{height:HEIGHT*0.25, width:WIDTH*0.8, marginTop: HEIGHT*0.1, borderRadius:20}}/>
                        </ImageContainer>
                        <NextContainer>
                            <InfoText>
                            You can have your rental property
                            subleased with just a few clicks
                            </InfoText>
                            <ContinueButton onPress={()=>setscrollviewIndex(scrollviewIndex+1)}>
                                <ContinueText>Get Started</ContinueText>
                            </ContinueButton>
                        </NextContainer>
                    </PostingSection>

                    {/* Choose apartment type  */}
                    <PostingSection >
                        <Heading>Type of sublease</Heading>
                        <InfoTextSection2>
                            You can have your rental property
                            subleased with just a few clicks
                        </InfoTextSection2>
                        <View style={{marginTop:HEIGHT*0.015}}>
                            <FlatList numColumns={2} data={flatListdata} renderItem={renderItem}/>
                        </View>
                        <NextContainer>
                            <ContinueButton onPress={()=>{propertyType == "" ? alert("Please select a type") : setscrollviewIndex(scrollviewIndex+1)}}>
                                <ContinueText>Next</ContinueText>
                            </ContinueButton>
                        </NextContainer>
                    </PostingSection>

                    {/* Select Address */}
                   
                    <PostingSection >
                        
                        <Animated.View style={{height:heighttranslation 
                        , opacity: heighttranslation.interpolate({
                            inputRange: [0, startingvalue],
                            outputRange: [0, 1]
                        })}}>
                            <Heading >Address of sublease </Heading>
                            <InfoTextSection2>
                            Type the exact address of your property.
                            Don’t worry, we won’t display this publicly
                            </InfoTextSection2>
                        </Animated.View>
                        <SearchContainer>
                            <SearchInput onFocus={()=>setexpended(false)} value={propertyLocation} onChangeText={(value)=> autocomplete(value)}  placeholder="Location..." />   
                        </SearchContainer>
                        <View style={{width:WIDTH*0.8, height:HEIGHT*0.2, marginTop:HEIGHT*0.01}}>
                            {propertyLocation.length != 0 && autocompleteLocation.map((value)=>(
                                <TouchableOpacity key={value.description} onPress={()=> {setpropertyLocation(value.description), Keyboard.dismiss(), setautocompleteLocation([]),setexpended(true)}} >
                                    <View style={{width:WIDTH*0.8, height:HEIGHT*0.06, paddingTop: HEIGHT*0.01, paddingLeft: WIDTH*0.025,
                                        paddingBottom: HEIGHT*0.01 , justifyContent:'center', borderBottomColor:'white', borderWidth: 1 }}>
                                        <Text style={{color: 'white', fontSize:HEIGHT*0.015}}>{value.description}</Text>
                                    </View> 
                                </TouchableOpacity>
                            ))}
                        </View>
                        <NextContainer>
                            <ContinueButton onPress={()=>{propertyLocation == "" ? alert("Please enter location") : setscrollviewIndex(scrollviewIndex+1)}}>
                                <ContinueText>Next</ContinueText>
                            </ContinueButton>
                        </NextContainer>
                        
                    </PostingSection>
                    
                    {/* Select Photo Gallery */}
                    <PostingSection>
                        <View style={{width:WIDTH, height:HEIGHT*0.4, paddingBottom:HEIGHT*0.05}}>
                            <Image source={{uri:propertyphotoGallery[propertyphotoGallery.length-1] == null ? headerImage : propertyphotoGallery[propertyphotoGallery.length-1].uri}} style={{width:WIDTH, height:HEIGHT*0.35}}/>
                        </View>
                        <Heading>Photo Gallery</Heading>
                        <InfoTextSection2>
                            Select placeholders below to choose images
                        </InfoTextSection2>
                        <PropertyPhotoContainer>
                        {test.map((value, index)=>(
                            propertyphotoGallery[index] =="" || propertyphotoGallery[index] == null ? 
                            <TouchableOpacity onPress={()=>selectGallery(index)}>
                            <PhotoContainer>
                                <Ionicons name="add" size={20}/>
                            </PhotoContainer>
                            </TouchableOpacity>
                            :
                            <TouchableOpacity onPress={()=>selectGallery(index)}>
                                <PhotoContainer>
                                    <Image source={{uri:propertyphotoGallery[index].uri}} style={{width:WIDTH*0.15, height:WIDTH*0.15, borderRadius:15,}} />
                                </PhotoContainer>
                            </TouchableOpacity>
                            
                            
                        ))}
                        </PropertyPhotoContainer>
                        <NextContainer>
                            <ContinueButton onPress={()=>{propertyphotoGallery.length < 3 ? alert("Must include at least 3 images") : setscrollviewIndex(scrollviewIndex+1)}}>
                                <ContinueText>Next</ContinueText>
                            </ContinueButton>
                        </NextContainer>
                    </PostingSection>

                    <PostingSection>
                        <Heading>Sublease Price</Heading>
                        <InfoTextSection2>
                        Please set property prices per month.         
                        </InfoTextSection2>
                        <SearchContainer>
                            <SearchInput keyboardType='number-pad' value={propertyPrice} onChangeText={(value)=> setpropertyPrice(value)}  placeholder="$ Price"/>   
                        </SearchContainer>
                        <Subheading style={{marginTop:HEIGHT*0.03}}>Sublease Description</Subheading>
                        <PropertyDescriptionInput  value={propertyDescription} onChangeText={(value)=>setpropertyDescription(value)} multiline={true}/>                           
                        
                        <NextContainer>
                            <ContinueButton onPress={()=>{(propertyPrice == "" || propertyDescription == "") ? alert("Missing Information") : setscrollviewIndex(scrollviewIndex+1)}}>
                                <ContinueText>Next</ContinueText>
                            </ContinueButton>
                        </NextContainer>
                    </PostingSection>

                    <PostingSection>
                        <Heading>Sublease Details</Heading>
                        <InfoTextSection2>
                        Select all the following details that apply.
                        You may change these at a later time.           
                        </InfoTextSection2>
                        <InputContainer >
                            <Subheading>Availability</Subheading>
                            <DateSelectContainer>
                                <DateContainer>
                                    <InfoTextSection2>From</InfoTextSection2>
                                    <DateSelectPressable onPress={()=>setOpenFrom(true)}>
                                        <Text style={{alignSelf:'center'}}>{propertydateFrom.getMonth()}-{propertydateFrom.getDate()}-{propertydateFrom.getFullYear()}</Text>
                                    </DateSelectPressable>
                                </DateContainer>
                                <DateContainer>
                                    <InfoTextSection2>To</InfoTextSection2>
                                    <DateSelectPressable onPress={()=>setOpenTo(true)}>
                                        <Text style={{alignSelf:'center'}}>{propertydateTo.getMonth()}-{propertydateTo.getDate()}-{propertydateTo.getFullYear()}</Text>
                                    </DateSelectPressable>
                                </DateContainer>
                            </DateSelectContainer>
                            
                            <DateSelectContainer>
                                <DateContainer>
                                    <Subheading keyboardType='number-pad'>Bed</Subheading>
                                    <BedBathInput keyboardType='number-pad' value={propertyNumBed} onChangeText={(value)=>setpropertyNumBed(value)}> </BedBathInput>
                                    
                                </DateContainer>
                                <DateContainer>
                                    <Subheading>Bath</Subheading>
                                    <BedBathInput keyboardType='number-pad' value={propertyNumBath} onChangeText={(value)=>setpropertyNumBath(value)}> </BedBathInput>
                                </DateContainer>
                            </DateSelectContainer>  
                            <DatePicker
                                modal
                                mode='date'
                                open={openFrom}
                                date={propertydateFrom}
                                onConfirm={(date) => {
                                setOpenFrom(false),
                                setpropertydateFrom(date)
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
                                setOpenTo(false),
                                setpropertydateTo(date)
                                }}
                                onCancel={() => {
                                setOpenTo(false)
                                }}
                            />  
                        </InputContainer>
                        <NextContainer>
                            <ContinueButton onPress={()=>setscrollviewIndex(scrollviewIndex+1)}>
                                <ContinueText>Next</ContinueText>
                            </ContinueButton>
                        </NextContainer>
                    </PostingSection>

                    <PostingSection>
                        <Heading>More Details</Heading>
                        <InfoTextSection2>
                            Select all of the amenitie that are available
                            at this sublease property. Not all may apply
                        </InfoTextSection2>
                        <InputContainer >
                            <Subheading>Amenities</Subheading>
                            <AmenitiesContainer>
                                {amenitiesList.map((value)=>(
                                    <View style={{height: HEIGHT*0.055, minWidth: WIDTH*0.23, width: WIDTH*value.name.length*0.03, marginLeft: WIDTH*0.02, justifyContent:'center', }}>
                                    <Pressable onPress={()=>updateAmenities(value.name)}>
                                    <View style={{height: HEIGHT*0.05, minWidth: WIDTH*0.21-5, width: WIDTH*value.name.length*0.03 -5, backgroundColor:propertyAmenities.indexOf(value.name) == -1 ? PRIMARYGREY : PRIMARYCOLOR, borderRadius:20,
                                        justifyContent:'space-around', alignItems:'center',}}>
                                        <Text style={{color: 'white'}}> {value.name}</Text>
                                    </View> 
                                    </Pressable>
                                    </View>
                                ))}
                            </AmenitiesContainer>
                        </InputContainer>
                        <NextContainer>
                            <ContinueButton onPress={()=>setscrollviewIndex(scrollviewIndex+1)}>
                                <ContinueText>Next</ContinueText>
                            </ContinueButton>
                        </NextContainer>
                    </PostingSection>

                    <PostingSection>
                        <Heading>You're almost done!</Heading>
                        <Heading>One step away from sublease.</Heading>
                        <ImageContainer>
                            <Image source={require('../../../assets/room.jpeg')} style={{height:HEIGHT*0.25, width:WIDTH*0.8, marginTop: HEIGHT*0.1, borderRadius:20}}/>
                        </ImageContainer>
                        <NextContainer>
                            <InfoTextSection2>
                                Review your sublease on the next page.
                                You can also go back and make changes
                            </InfoTextSection2>
                            <ContinueButton onPress={()=>setscrollviewIndex(scrollviewIndex+1)}>
                                <ContinueText>Review</ContinueText>
                            </ContinueButton>
                        </NextContainer>
                    </PostingSection>

                    
                    <PostingSection>
                    <ScrollView style={{paddingLeft:WIDTH*0.05}}>
                        <Heading>You're almost done!</Heading>
                        <Heading>One step away from sublease.</Heading>

                        <View style={{width:WIDTH, height:HEIGHT*0.2, paddingBottom:HEIGHT*0.05 , marginTop:HEIGHT*0.03, borderRadius:20, }}>
                            <Image source={{uri:propertyphotoGallery[0] == null ? headerImage : propertyphotoGallery[0].uri}} style={{width:WIDTH*0.9, height:HEIGHT*0.2, borderRadius:20,}}/>
                        </View>
                        <Heading style={{marginTop:HEIGHT*0.03}}>Gallery</Heading>
                        <PropertyPhotoContainer >
                        {test.map((value, index)=>(
                            propertyphotoGallery[index]=="" || propertyphotoGallery[index]== null ? 
                            <TouchableOpacity onPress={()=>selectGallery(index)}>
                            <PhotoContainer>
                                <Ionicons name="add" size={20}/>
                            </PhotoContainer>
                            </TouchableOpacity>
                            :
                            <TouchableOpacity onPress={()=>selectGallery(index)}>
                                <PhotoContainer >
                                </PhotoContainer>
                            </TouchableOpacity>
                        ))}
                        </PropertyPhotoContainer>
                        <Divider></Divider>
                        <ReviewSectionContainer>
                            <Heading>Property Type</Heading>
                            <ReviewInfoText>{propertyType}</ReviewInfoText>
                            <BedAndBathContainer>
                            <BedBathLogo>
                                <Ionicons name="bed-outline" size={WIDTH*0.1} color={PRIMARYGREY}></Ionicons>
                                <LocationText>1 bedroom</LocationText>
                            </BedBathLogo>
                            <BedBathLogo>
                                <Ionicons name="eye-off-outline" size={WIDTH*0.1} color={PRIMARYGREY}></Ionicons>
                                <LocationText>1 bathroom</LocationText>
                            </BedBathLogo>
                        </BedAndBathContainer>
                        </ReviewSectionContainer>
                        
                        <ReviewSectionContainer>
                            <Heading>Location</Heading>
                            <ReviewInfoText>{propertyLocation}</ReviewInfoText>
                        </ReviewSectionContainer>
                        <ReviewSectionContainer>
                            <Heading>Availability</Heading>
                            <ReviewInfoText>From {propertydateFrom.getMonth()}-{propertydateFrom.getDate()}-{propertydateFrom.getFullYear()}</ReviewInfoText>
                            <ReviewInfoText>To {propertydateTo.getMonth()}-{propertydateTo.getDate()}-{propertydateTo.getFullYear()}</ReviewInfoText>
                        </ReviewSectionContainer>
                        <ReviewSectionContainer>
                            <Heading>Description</Heading>
                            <ReviewPropertyDescriptionInput editable={false} value={propertyDescription} multiline={true}/>                           
                        </ReviewSectionContainer>
                        
                        </ScrollView>
                        <Footer>
                            <PricePerMonth>$700 <Text style={{fontSize: HEIGHT*0.025, fontWeight:'500', color:'white'}}>/ month</Text></PricePerMonth>
                            <ContactTanentButton onPress={postproperty}>
                                <Text style={{color:'white', fontWeight:'700'}}>Post</Text>
                            </ContactTanentButton>
                        </Footer>
                        
                        
                    </PostingSection>
                    
                                    
                </Animated.ScrollView>
            </ModalView>
       </View>
    )

}
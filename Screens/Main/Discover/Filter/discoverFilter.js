import React, {useEffect, useState, useRef}  from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Dimensions,
  Pressable,
  Animated,

} from 'react-native';

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

const PROPERTIESTYPES = 
[{type: "Room", icon:'bed'},
  {type: "House", icon:'home'}, 
  {type: "Apartment", icon: 'building'}, 
  {type:"Studio", icon :'lock'}
];

const BEDROOMTYPES = ["Studio", "2", "3", "4", "4+"];
const BATHROOMTYPES = ["1", "2", "3", "4", "5+"];


const PRIMARYGREY = '#5e5d5d'
const PRIMARYCOLOR = '#4050B5'

import { MEDIUMGREY,HEIGHT, WIDTH, DARKGREY } from '../../../../sharedUtils';

import Modal from "react-native-modal";

import Ionicons from 'react-native-vector-icons/Ionicons';
Ionicons.loadFont()

import MultiSlider from '@ptomasroos/react-native-multi-slider';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
FontAwesome.loadFont()

import DatePicker from 'react-native-date-picker'


import { Container, HeaderContainer, BackButtonContainer,NameContainer, ResetButtonContainer, Header, ModalStyle,
        InputForm,InputSection, InputName,InputNameContainer, InputOptionContainer, InputPressableContainer,
        InputPriceRangeContainer, PriceRangeText, PriceInputSection, AmenitiesInputSection, AmenitiesList,
        InputSectionCol, BedBathNumberText, TypeOption, TypeContainer, PropertyTypeName, BedroomOptions,
        BedroomOptionsText, AmenitiesContainer, NameIcon, DateInputPressable} from './discoverFilterStyle';

export default function DiscoverFilterScreen({navigation, currentLocation, open, close, setFilteredProperties}){
    const [containerModal, setcontainerModal] = useState(false);
    const [scrollEnabled, setscrollEnabled] = useState(true)

    const [filterType, setfilterType] = useState('')
    const [filterSort, setfilterSort] = useState('')
    const [filterDistance, setfilterDistance] = useState('')
    const [filterBedroom, setfilterBedroom] = useState(1);
    const [filterBathroom, setfilterBathroom] = useState(1);
    const [filterPriceLower, setfilterPriceLower] = useState(0);
    const [filterPriceHigher, setfilterPriceHigher] = useState(5000);
    const [filterAmenities, setfilterAmenities] = useState([])
    const [propertyAmenities, setpropertyAmenities] = useState([])

    //Sets DatePicker Modal Visibility
    const [propertydateFrom, setpropertydateFrom] = useState(new Date())
    const [propertydateTo, setpropertydateTo] = useState(new Date())
    const [openFrom, setOpenFrom] = useState(false)
    const [openTo, setOpenTo] = useState(false)


    function updateBedroomCount(operation){
       
        if(operation == 'add'){
            setfilterBedroom(filterBedroom+1);
        }
        else if(operation == "minus" && filterBedroom > 0){
            setfilterBedroom(filterBedroom-1);
        }
    }

    function updateBathroomCount(operation){
       
        if(operation == 'add'){
            setfilterBathroom(filterBathroom+1);
        }
        else if(operation == "minus" && filterBathroom > 0){
            setfilterBathroom(filterBathroom-1);
        }
    }

    function updateAmenities(name){

        if(filterAmenities.indexOf(name) != -1){
            let tempindex = filterAmenities.indexOf(name);
            setfilterAmenities([...filterAmenities.slice(0,tempindex), ...filterAmenities.slice(tempindex+1,filterAmenities.length)])
        }
        else{
            setfilterAmenities(prev=>[...prev, name]);
        }
    }
    
    const translation = useRef(new Animated.Value(0)).current;

   
    useEffect(()=>{
       setcontainerModal(true)
    },[])

    useEffect(()=>{
       
    },[])

    function filter(){
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
    s = s + "&maxDistance=1000000000000"
    s = s + `&priceHigh=${filterPriceHigher}`
    s = s + '&priceLow=0'
    console.log(s);

    fetch('https://sublease-app.herokuapp.com/properties/query?page=0' + s, {
        method: 'GET',
        headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
        }
        }) 
        .then(res => res.json()).then(properties =>{
            console.log("filtered properties is:")
            console.log(properties)
            setFilteredProperties([...properties])
            close()
        })
        .catch(e=>{
            alert(e)
    })
    }

    return(
       
        <Modal hideModalContentWhileAnimating={true} style={ModalStyle} isVisible={open} animationIn="slideInUp" animationOut='slideOutDown' backdropOpacity={0}>
        <SafeAreaView style={{flex: 1}}>
            <Animated.View>
            <HeaderContainer>
                <BackButtonContainer>
                    <Pressable style={{height:'50%', width:'50%', alignItems:'center'}} onPress={()=>close()}>
                        <Ionicons name='arrow-back-outline' size={25} />
                    </Pressable>
                </BackButtonContainer>
                <NameContainer>
                    <Header>Filter</Header>
                </NameContainer>
                <ResetButtonContainer>
                    <Pressable style={{height:'50%', width:'50%', alignItems:'center'}} onPress={filter}>
                        <Ionicons name='checkmark-done' size={25} />
                    </Pressable>
                </ResetButtonContainer>
            </HeaderContainer>
            <ScrollView showsVerticalScrollIndicator={false} scrollEnabled={scrollEnabled}>
            <InputForm>
                <InputSectionCol>
                    <InputNameContainer>
                        <InputName>Type</InputName>
                    </InputNameContainer>
                    <TypeContainer>
                    {PROPERTIESTYPES.map((value)=>(
                        <TypeOption key={value.name + value.icon}>
                            <NameIcon>
                                <FontAwesome name={value.icon} size={20} />
                                <PropertyTypeName>{value.type}</PropertyTypeName>
                            </NameIcon>
                            <Pressable onPress={()=>setfilterType(value)}>
                            <Ionicons name='checkbox' size={25} color={value == filterType ? PRIMARYCOLOR : MEDIUMGREY}/>
                        </Pressable>
                        </TypeOption>
                    ))}
                    
                    </TypeContainer>
                </InputSectionCol>
        
                {/* <InputSection>
                    <InputNameContainer>
                        <InputName>Sort By</InputName>
                    </InputNameContainer>
                    <InputOptionContainer>
                        <View>
                        <RNPickerSelect
                            placeholder={{
                                label: "Select an item ..."
                            }}
                            
                            style={{
                                placeholder:{
                                    color: PRIMARYGREY,
                                    fontSize : HEIGHT*0.02
                                }
                                
                            }}
                            pickerProps={{
                                itemStyle:{
                                    fontSize: HEIGHT*0.02
                                }
                            }}
                            
                            onValueChange={(value) => setfilterSort(value)}
                            items={[
                                { label: 'Distance', value: 'Ditance' },
                                { label: 'Price', value: 'Price' },
                                { label: 'Most Viewed', value: 'Most Viewed' },
                                { label: 'Most Recent', value: 'Most Recent' },
                            ]}
                        />
                        </View>
                        <InputPressableContainer >
                            <FontAwesome name='chevron-down' size={15} color={PRIMARYCOLOR} style={{marginLeft:WIDTH*0.025}}/>
                        </InputPressableContainer>
                    </InputOptionContainer>
                </InputSection> */}
                
                <PriceInputSection>
                <InputSection style={{borderBottomWidth: 0}}>
                    <InputNameContainer>
                            <InputName>Max Budget</InputName>
                    </InputNameContainer>
                    <InputPriceRangeContainer>
                            <PriceRangeText>${filterPriceHigher} / month</PriceRangeText>
                    </InputPriceRangeContainer>
                </InputSection>
                <View style={{alignItems:'center'}}>
                <MultiSlider
                
                vales={[filterPriceLower,filterPriceHigher]}
                onValuesChangeStart={()=> setscrollEnabled(false)}
                onValuesChangeFinish={()=> setscrollEnabled(true)}
                onValuesChange={(value)=> setfilterPriceHigher(value)}
                min={0}
                max={4000}
                allowOverlap={false}
                snapped
                step={10}
                enabledOne={true}
                enabledTwo={true}
                selectedStyle={{
                    backgroundColor: PRIMARYCOLOR
                }}
                containerStyle={{
                    width:WIDTH,
                    alignItems:'center'
                }}
                sliderLength={WIDTH*0.8}
              
                />
                </View>
                </PriceInputSection>
                <InputSectionCol>
                    <InputNameContainer>
                        <InputName>Available From</InputName>
                    </InputNameContainer>
                    <DateInputPressable onPress={()=>setOpenFrom(true)}>
                        <PropertyTypeName>{propertydateFrom.toDateString()}</PropertyTypeName>
                    </DateInputPressable>
                    <InputNameContainer>
                        <InputName>Available To</InputName>
                    </InputNameContainer>
                    <DateInputPressable onPress={()=>setOpenTo(true)}>
                        <PropertyTypeName>{propertydateTo.toDateString()}</PropertyTypeName>
                    </DateInputPressable>
                    <DatePicker
                              
                        modal
                        mode='date'
                        open={openFrom}
                        date={propertydateFrom}
                        onConfirm={(date) => {
                            setpropertydateFrom(date)
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
                        date={propertydateTo}
                        onConfirm={(date) => {
                            setpropertydateTo(date)
                            setOpenTo(false)
                                
                        }}
                        onCancel={() => {
                            setOpenTo(false)
                        }}
                    />
                    
                </InputSectionCol>
                <InputSectionCol>
                    <InputNameContainer>
                        <InputName>Bedrooms</InputName>
                    </InputNameContainer>
                    <InputOptionContainer>
                    {BEDROOMTYPES.map((value, index)=>(
                        
                            
                        <BedroomOptions  key={"bedroomOption" + value  + index} onPress={()=> setfilterBedroom(value)} inputValue={filterBedroom} value={value}>   
                            <BedroomOptionsText value={value} inputValue={filterBedroom}>{value}</BedroomOptionsText>
                        </BedroomOptions>
                       
                    ))}
                    </InputOptionContainer>
                </InputSectionCol>

                {/* Bathroom Section */}
                <InputSectionCol>
                    <InputNameContainer>
                        <InputName>Bethrooms</InputName>
                    </InputNameContainer>
                    <InputOptionContainer>
                    {BATHROOMTYPES.map((value, index)=>(
                        
                            
                        <BedroomOptions key={"bathroomOption" + value + index} onPress={()=> setfilterBathroom(value)} inputValue={filterBathroom} value={value}>   
                            <BedroomOptionsText value={value} inputValue={filterBathroom}>{value}</BedroomOptionsText>
                        </BedroomOptions>
                       
                    ))}
                    </InputOptionContainer>
                </InputSectionCol>

                <InputSectionCol style={{flexDirection:'column'}}>
                    
                    <InputNameContainer>
                        <InputName>Amenities</InputName>
                    </InputNameContainer>
                    
                   
                        <AmenitiesContainer>
                            {/* {amenitiesList.map((value, index) => (
                                <View key={value.name + index + 'view'} style={{
                                    minWidth: WIDTH * 0.35, width: value.name.length * 0.03 * WIDTH, height: HEIGHT * 0.0575, justifyContent: 'center',
                                    paddingRight: WIDTH * 0.03
                                }}>
                                    <Pressable key={value.name + 'pressable'} onPress={() => updateAmenities(value.name)} style={{
                                        borderWidth: 3, borderColor: propertyAmenities.indexOf(value.name) == -1 ? value.color : '#0085FF', height: HEIGHT * 0.045,
                                        borderRadius: 20, justifyContent: 'center', backgroundColor: value.color, flexDirection: 'row', alignItems: 'center'
                                    }}>
                                        <Text key={value.name + 'text'} style={{ justifyContent: 'center', color: 'white' }}>
                                            <Ionicons name={value.icon} size={15} />
                                            {"   "}{value.name}
                                        </Text>
                                    </Pressable>

                                </View>
                            ))} */}
                            {amenitiesList.map((value, index)=>(
                                <TypeOption key={value.name + value.icon + "amenities"}>
                                    <NameIcon>
                                        <Ionicons key={value.icon} name={value.icon} size={20} />
                                        <PropertyTypeName>{value.name}</PropertyTypeName>
                                    </NameIcon>
                                    <Pressable onPress={()=>updateAmenities(value.name)}>
                                        <Ionicons name='checkbox' size={25} color={filterAmenities.indexOf(value.name) != -1 ? PRIMARYCOLOR : MEDIUMGREY}/>
                                    </Pressable>
                                </TypeOption>
                            ))}
                        </AmenitiesContainer>
                        <View style={{width:WIDTH, height: HEIGHT*0.1}}>

                        </View>
                    
                </InputSectionCol>
            </InputForm>
           
        </ScrollView>
        </Animated.View>
        </SafeAreaView>
        </Modal>
       
    )
}
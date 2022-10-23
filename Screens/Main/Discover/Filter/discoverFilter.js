import React, {useState}  from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Pressable,
} from 'react-native';

import { MEDIUMGREY,HEIGHT, WIDTH, amenitiesList, GetFAIconsInBlack, PRIMARYCOLOR, PROPERTIESTYPES, DEFAULTTYPE, DEFAULTPRICE, DEFAULTAVAILABLEFROM, DEFAULTAVAILABLETO, DEFAULTBEDROOM, DEFAULTDISTANCE, DEFAULTAMENITIES, DEFAULTBATHROOM} from '../../../../sharedUtils';

import Modal from "react-native-modal";
import Slider from '@react-native-community/slider';
import DatePicker from 'react-native-date-picker'

import {
HeaderContainer,
BackButtonContainer,
NameContainer,
Header,
InputForm,
InputSection, 
InputName,
InputNameContainer, 
InputOptionContainer,
InputPriceRangeContainer, 
PriceRangeText, 
PriceInputSection,
InputSectionCol, 
TypeOption, 
TypeContainer, 
PropertyTypeName, 
BedroomOptions,
BedroomOptionsText, 
AmenitiesContainer, 
NameIcon, 
DateInputPressable, 
Footer, 
ResetText, 
ApplyButton, 
ApplyText
} from './discoverFilterStyle';

import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
FontAwesome.loadFont()
Ionicons.loadFont()

//Bedroom and bathroom options
const BEDROOMTYPES = ["Studio","1" ,"2", "3", "4P"];
const BATHROOMTYPES = ["1", "2", "3", "4P"];

export default function DiscoverFilterScreen({navigation, currentLocation, open, close, setFilteredProperties, retrieveAllPins
    ,filterType, setfilterType, filterDistance, setfilterDistance, filterBedroom, setfilterBedroom,filterBathroom, setfilterBathroom
    ,filterPriceHigher, setfilterPriceHigher, filterAmenities, setfilterAmenities, setRetrieveMore, filterPreviewValue, setfilterPreviewValue, 
    filterPreviewDistanceValue, setfilterPreviewDistanceValue, filterAvailableFrom, setfilterAvailableFrom,
    filterAvailableTo, setfilterAvailableTo, loadProperty, setFlatlistRefreshingTrue, setFlatlistRefreshingFalse
}){
    //When sliding the slides in select, the page doesnt move around
    const [scrollEnabled, setscrollEnabled] = useState(true)
    //Indicate if user pressed reset, if yes then load property with default values
    const [reset, setReset] = useState(false)

    //Sets DatePicker Modal Visibility
    const [openFrom, setOpenFrom] = useState(false)
    const [openTo, setOpenTo] = useState(false)

    //Save the previos user options in case user make changes but doesnt want it 
        // let savedType;
        // const [savedPriceHigher, setSavedPriceHigher] = useState(filterPriceHigher)
        // const [savedAvailableFrom, setSavedAvailableFrom] = useState(filterAvailableFrom);
        // const [savedAvailableTo, setSavedAvailableTo] = useState(filterAvailableTo);
        // const [savedPreviewDistance, setSavedPreviewDistance] = useState(filterDistance);
        // const [savedPreviewValue, setSavedPreviewValue] = useState(filterPreviewValue);
        // const [savedAmenities, setSavedAmenities] = useState(filterAmenities);
        // const [savedBathroom, setSavedBathroom] = useState(filterBathroom);
        // const [savedBedroom, setSavedBedroom] = useState(filterBedroom);
        // const [savedDistance, setSavedDistance] = useState(filterDistance);
    
    //Add and remove amenities from fitleramn list 
    function updateAmenities(name) {
        if (filterAmenities.indexOf(name) != -1) {
            console.log("deleting")
            let tempindex = filterAmenities.indexOf(name);
            setfilterAmenities([...filterAmenities.slice(0, tempindex), ...filterAmenities.slice(tempindex + 1, filterAmenities.length)])
        }
        else {
            console.log("adding")
            setfilterAmenities(prev => [...prev, name]);
        }
    }

    //Function to set all filter back to default
    function resetFilter(){
        console.log("resettin")
        setfilterType(DEFAULTTYPE)
        setfilterPriceHigher(DEFAULTPRICE)
        setfilterAvailableFrom(DEFAULTAVAILABLEFROM)
        setfilterAvailableTo(DEFAULTAVAILABLETO)
        setfilterPreviewDistanceValue(DEFAULTDISTANCE)
        setfilterPreviewValue(DEFAULTPRICE)
        setfilterAmenities(DEFAULTAMENITIES)
        setfilterBathroom(DEFAULTBATHROOM)
        setfilterBedroom(DEFAULTBATHROOM)
        setfilterDistance(DEFAULTDISTANCE)
        setReset(true)
    }

    //Set the properties according to filter values 
    function filter(){
        setFlatlistRefreshingTrue()
        setRetrieveMore(true)
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
        s = s +`&availableFrom=${filterAvailableFrom.getTime()}`
        s = s +`&availableTo=${filterAvailableTo.getTime()}`
        s = s + `&latitude=${currentLocation[0]}`
        s = s + `&longitude=${currentLocation[1]}`
        s = s + `&priceHigh=${filterPriceHigher}`
        s = s + '&priceLow=0'
    
        fetch('https://crib-llc-dev.herokuapp.com/properties/query?page=0' + s, {
            method: 'GET',
            headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
            }
            }) 
            .then(res => res.json()).then(properties =>{
                console.log("filtered properties is:")
                if(properties.propertiesFound != 'none'){
                    setFilteredProperties([...properties])
                } else{
                    setFilteredProperties([])
                }
                close()
            })
            .catch(e=>{
                alert(e)
        })
        retrieveAllPins(currentLocation[0], currentLocation[1], filterDistance, filterPriceHigher, filterBedroom, filterBathroom, filterType, filterAmenities,new Date(filterAvailableFrom).getTime(), new Date(filterAvailableTo).getTime() )

        setTimeout(()=>{
            setFlatlistRefreshingFalse()
        },2000)
            
    }

    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!NEED TO CHECK!!!!!!!!!!!!!!!!!!!!!!!!!!
    async function checkResetAndBack(){
        console.log(reset)
        console.log("closing")
        if(reset){
            setReset(false)
            retrieveAllPins(currentLocation[0], currentLocation[1], DEFAULTDISTANCE, DEFAULTPRICE, DEFAULTBEDROOM, DEFAULTBATHROOM, DEFAULTTYPE, DEFAULTAMENITIES,DEFAULTAVAILABLEFROM.getTime(), DEFAULTAVAILABLETO.getTime())
            loadProperty()
        }
        else{
            console.log("Normal back")
            // console.log("savedtype"  ,savedType)
            // setfilterType(savedType)
            // setfilterPriceHigher(savedPriceHigher)
            // setfilterAvailableFrom(savedAvailableFrom)
            // setfilterAvailableTo(savedAvailableTo)
            // setfilterPreviewDistanceValue(savedPreviewDistance)
            // setfilterPreviewValue(savedPreviewValue)
            // setfilterAmenities(savedAmenities)
            // setfilterBathroom(savedBedroom)
            // setfilterBedroom(savedBathroom)
            // setfilterDistance(savedDistance)
    
        }
        close()
    }

    return(
       
        <Modal visible={open} animationType='slide' style={{flex: 1, backgroundColor:'white', margin: 0}}>
            <SafeAreaView style={{flex: 1}}>
                <HeaderContainer>
                    <BackButtonContainer>
                        <Pressable hitSlop={WIDTH*0.05} style={{height:'50%', width:'50%', alignItems:'center'}} onPress={checkResetAndBack}>
                            <Ionicons name='arrow-back-outline' size={25} />
                        </Pressable>
                    </BackButtonContainer>
                    <NameContainer>
                        <Header>Filter</Header>
                    </NameContainer>
                </HeaderContainer>
                <ScrollView showsVerticalScrollIndicator={false} scrollEnabled={scrollEnabled}>
                    {/* All the inputs for the filter */}
                    <InputForm>
                        {/* Filter Type */}
                        <InputSectionCol>
                            <InputNameContainer>
                                <InputName>Type</InputName>
                            </InputNameContainer>

                            <TypeContainer>
                            {PROPERTIESTYPES.map((value)=>(
                                <TypeOption key={value.type + value.icon} >
                                    <NameIcon hitSlop={WIDTH*0.05} onPress={()=>{value.type == filterType ? setfilterType("") : setfilterType(value.type)}}>
                                        <FontAwesome name={value.icon} size={20} />
                                        <PropertyTypeName>{value.type}</PropertyTypeName>
                                    </NameIcon>
                                    <Pressable hitSlop={WIDTH*0.05} onPress={()=>{value.type == filterType ? setfilterType("") : setfilterType(value.type)}}>
                                    <Ionicons name='checkbox' size={25} color={value.type == filterType ? PRIMARYCOLOR : MEDIUMGREY}/>
                                </Pressable>
                                </TypeOption>
                            ))}
                            </TypeContainer>
                        </InputSectionCol>
            
                        {/* Filter Price */}
                        <PriceInputSection>
                            <InputSection style={{borderBottomWidth: 0}}>
                                <InputNameContainer>
                                        <InputName>Max Budget</InputName>
                                </InputNameContainer>
                                <InputPriceRangeContainer>
                                        <PriceRangeText>${filterPreviewValue} / month</PriceRangeText>
                                </InputPriceRangeContainer>
                            </InputSection>
                            {/* Cannot use style in slider so put slider in view component */}
                            <View style={{alignItems:'center'}}>
                                <Slider
                                    style={{width: WIDTH*0.8, height: HEIGHT*0.1}}
                                    value={filterPriceHigher}
                                    onValueChange={(value)=> setfilterPreviewValue(value)}
                                    onValuesChangeStart={()=> setscrollEnabled(false)}
                                    onValuesChangeFinish={()=> setscrollEnabled(true)}
                                    onSlidingComplete={(value)=> setfilterPriceHigher(value)}
                                    minimumValue={0}
                                    maximumValue={10000}
                                    step={100}
                                    minimumTrackTintColor={PRIMARYCOLOR}
                                    maximumTrackTintColor={MEDIUMGREY}
                                />
                            </View>
                        </PriceInputSection>

                        <InputSectionCol>
                            <InputNameContainer>
                                <InputName>Available From</InputName>
                            </InputNameContainer>
                            <DateInputPressable  hitSlop={WIDTH*0.05} onPress={()=>setOpenFrom(true)}>
                                <PropertyTypeName>{filterAvailableFrom.toDateString()}</PropertyTypeName>
                            </DateInputPressable>
                            <InputNameContainer>
                                <InputName>Available To</InputName>
                            </InputNameContainer>
                            <DateInputPressable  hitSlop={WIDTH*0.05} onPress={()=>setOpenTo(true)}>
                                <PropertyTypeName>{filterAvailableTo.toDateString()}</PropertyTypeName>
                            </DateInputPressable>

                            {/* Avaialble from datepicekr */}
                            <DatePicker
                                modal
                                mode='date'
                                open={openFrom}
                                date={filterAvailableFrom}
                                onConfirm={(date) => {
                                    if(date.getTime() < new Date().getTime()){
                                        alert("Invalid Available From Date")
                                    }
                                    else if(date.getTime() >= filterAvailableTo.getTime()){
                                        alert("Cannot set date to after Available From date.")
                                    }
                                    else{
                                        setfilterAvailableFrom(date)
                                    }
                                    setOpenFrom(false)
                                    
                                }}
                                onCancel={() => {
                                    setOpenFrom(false)
                                }}
                            />
                            {/* AvailableTo date picker  */}
                            <DatePicker
                                modal
                                mode='date'
                                open={openTo}
                                date={filterAvailableTo}
                                onConfirm={(date) => {
                                    if(date.getTime() < new Date().getTime()){
                                        alert("Cannot set Available To before today")
                                    }
                                    else if(date.getTime() <= filterAvailableFrom.getTime()){
                                        alert("Cannot set Available To on or before Available From date")
                                    }
                                    else if(date.getTime() >= 1759176355615){
                                        alert("Date Selected is too far ahead, please select a closer date.") 
                                    }
                                    else{
                                        setfilterAvailableTo(date)
                                    }    
                                    setOpenTo(false)            
                                }}
                                onCancel={() => {
                                    setOpenTo(false)
                                }}
                            />
                        </InputSectionCol>

                        {/* Filter Distance  */}
                        <PriceInputSection>
                            <InputSection style={{borderBottomWidth: 0}}>
                                <InputNameContainer>
                                        <InputName>Max Distance</InputName>
                                </InputNameContainer>
                                <InputPriceRangeContainer>
                                        <PriceRangeText>{filterPreviewDistanceValue} miles</PriceRangeText>
                                </InputPriceRangeContainer>
                            </InputSection>
                            <View style={{alignItems:'center'}}>
                            <Slider
                                style={{width: WIDTH*0.8, height: HEIGHT*0.1}}
                                value={filterPreviewDistanceValue}
                                onValueChange={(value)=> setfilterPreviewDistanceValue(value)}
                                onValuesChangeStart={()=> setscrollEnabled(false)}
                                onValuesChangeFinish={()=> setscrollEnabled(true)}
                                onSlidingComplete={(value)=> setfilterDistance(value)}
                                minimumValue={0}
                                maximumValue={DEFAULTDISTANCE}
                                step={5}
                                minimumTrackTintColor={PRIMARYCOLOR}
                                maximumTrackTintColor={MEDIUMGREY}
                            />
                            </View>
                        </PriceInputSection>

                        {/* Filter Bedroom  */}
                        <InputSectionCol>
                            <InputNameContainer>
                                <InputName>Bedrooms</InputName>
                            </InputNameContainer>
                            <InputOptionContainer>
                            {BEDROOMTYPES.map((value, index)=>(
                                <BedroomOptions  key={"bedroomOption" + value  + index}  hitSlop={WIDTH*0.05} onPress={()=> value == filterBedroom ? setfilterBedroom("") : setfilterBedroom(value)} inputValue={filterBedroom} value={value}>   
                                    <BedroomOptionsText value={value} inputValue={filterBedroom}>{value.replace("P","+")}</BedroomOptionsText>
                                </BedroomOptions>
                            ))}
                            </InputOptionContainer>
                        </InputSectionCol>

                        {/* Bathroom Section, bathroom stores as 4P not 4+ so need to change */}
                        <InputSectionCol>
                            <InputNameContainer>
                                <InputName>Bathrooms</InputName>
                            </InputNameContainer>
                            <InputOptionContainer>
                            {BATHROOMTYPES.map((value, index)=>(
                                <BedroomOptions key={"bathroomOption" + value + index} onPress={()=> value == filterBathroom ? setfilterBathroom("") : setfilterBathroom(value)} inputValue={filterBathroom} value={value}>   
                                    <BedroomOptionsText value={value} inputValue={filterBathroom}>{value.replace("P","+")}</BedroomOptionsText>
                                </BedroomOptions>
                            ))}
                            </InputOptionContainer>
                        </InputSectionCol>

                        {/* Filter Amenities */}
                        <InputSectionCol style={{borderBottomWidth: 0}}>
                            <InputNameContainer>
                                <InputName>Amenities</InputName>
                            </InputNameContainer>
                            
                            <AmenitiesContainer>
                                {amenitiesList.map((value, index)=>(
                                
                                    <TypeOption key={value.name + "amenitiesfilter"} >
                                        <NameIcon  hitSlop={WIDTH*0.05} onPress={()=>updateAmenities(value.name)}>
                                            {GetFAIconsInBlack(value.name)}
                                            <PropertyTypeName>{value.name.replaceAll("_", " ")}</PropertyTypeName>
                                        </NameIcon>
                                        <Pressable  hitSlop={WIDTH*0.05} onPress={()=>updateAmenities(value.name)}>
                                            <View style={{height:WIDTH*0.055, width:WIDTH*0.055, borderRadius: 5, backgroundColor:filterAmenities.indexOf(value.name) != -1 ? PRIMARYCOLOR : MEDIUMGREY,
                                            justifyContent:'center',alignItems:'center'}}>
                                                <Ionicons name='checkmark' size={15} color='white'/>
                                            </View>
                                        </Pressable>
                                    </TypeOption>
                                
                                ))}
                            </AmenitiesContainer>

                            {/* Padding in the bottom so the amenities list dont touch the bottom */}
                            <View style={{width:WIDTH, height: HEIGHT*0.025}}/>
                        </InputSectionCol>

                    </InputForm>
                </ScrollView>

                <Footer>
                    <Pressable  hitSlop={WIDTH*0.05} onPress={resetFilter}>
                        <ResetText>Reset</ResetText>
                    </Pressable>

                    <ApplyButton  hitSlop={WIDTH*0.05} onPress={filter}>
                        <ApplyText>Apply Filter</ApplyText>
                    </ApplyButton>
                </Footer>

            </SafeAreaView>
        </Modal>
    )
}
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
[{name:'Pets Allowed', color: '#85CBFF', icon: 'paw'},
{name: 'Mattress  ', color: '#C0C0C0', icon: 'bed'},
{name: 'Able to renew', color:'#FFC58D', icon: 'refresh' },
{name: 'Gym', color:'#FFC58D',icon: 'at'},
{name: 'On-site Washer and Dryer', color:'#FF8B8B', icon: 'at'},
{name: 'Wifi', color:'#AEFFF0', icon: 'wifi'},
{name: 'Furnished', color: '#AEFFF0', icon: 'bed'},
{name: 'Utilities Included', color:'#85CBFF', icon: 'bolt'},
{name: 'Pool', color:'#FFC58D', icon: 'at'},
{name: 'Parking   ', color:'#85CBFF', icon: 'at'},
{name: 'TV', color:'#FF8B8B', icon: 'tv'},
{name: 'Heating and Cooling', color:'#FFC58D', icon: 'at'},
]

const PROPERTIESTYPES = ["Room", "House", "Apartment", "Studio"];

const BEDROOMTYPES = ["Studio", "2", "3", "4", "4+"];
const BATHROOMTYPES = ["1", "2", "3", "4", "5+"];


const PRIMARYGREY = '#5e5d5d'
const PRIMARYCOLOR = '#4050B5'

import { MEDIUMGREY,HEIGHT, WIDTH } from '../../../../sharedUtils';

import Modal from "react-native-modal";

import Ionicons from 'react-native-vector-icons/Ionicons';
Ionicons.loadFont()

import RNPickerSelect from 'react-native-picker-select';
import MultiSlider from '@ptomasroos/react-native-multi-slider';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
FontAwesome.loadFont()

import { Container, HeaderContainer, BackButtonContainer,NameContainer, ResetButtonContainer, Header, ModalStyle,
        InputForm,InputSection, InputName,InputNameContainer, InputOptionContainer, InputPressableContainer,
        InputPriceRangeContainer, PriceRangeText, PriceInputSection, AmenitiesInputSection, AmenitiesList,
        InputSectionCol, BedBathNumberText, TypeOption, TypeContainer, PropertyTypeName, BedroomOptions,
        BedroomOptionsText} from './discoverFilterStyle';

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
    s = s + "&maxDistance=10"
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
                        <TypeOption>
                            <PropertyTypeName>{value}</PropertyTypeName>
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
                {/* <InputSection>
                    <InputNameContainer>
                        <InputName>Distance away</InputName>
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
                            
                            onValueChange={(value) => setfilterDistance(value)}
                            items={[
                                { label: '< 1 mile', value: '1' },
                                { label: '< 5 mile', value: '5' },
                                { label: '< 10 mile', value: '10' },
                                { label: '< 15 mile', value: '15' },
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
                        <InputName>Bedrooms</InputName>
                    </InputNameContainer>
                    <InputOptionContainer>
                    {BEDROOMTYPES.map((value)=>(
                        
                            
                        <BedroomOptions onPress={()=> setfilterBedroom(value)} inputValue={filterBedroom} value={value}>   
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
                    {BATHROOMTYPES.map((value)=>(
                        
                            
                        <BedroomOptions onPress={()=> setfilterBathroom(value)} inputValue={filterBathroom} value={value}>   
                            <BedroomOptionsText value={value} inputValue={filterBathroom}>{value}</BedroomOptionsText>
                        </BedroomOptions>
                       
                    ))}
                    </InputOptionContainer>
                </InputSectionCol>

                <InputSection style={{flexDirection:'column'}}>
                    <AmenitiesInputSection>
                        <InputName>Amenities</InputName>
                    </AmenitiesInputSection>
                    <Text style={{width:WIDTH*0.8}}>
                    {amenitiesList.map((value,index)=>(
                        <View key={value.name + 'view'} style={{minWidth: WIDTH*0.35, width: value.name.length*0.03*WIDTH, height:HEIGHT*0.055, justifyContent:'center', 
                        paddingTop:HEIGHT*0.001, paddingBottom: HEIGHT*0.001, paddingRight: WIDTH*0.03}}>
                            <Pressable key={value.name + 'pressable'} onPress={()=>updateAmenities(value.name)} style={{borderWidth:3, borderColor: filterAmenities.indexOf(value.name) == -1 ? value.color : '#0085FF', height: HEIGHT*0.045, 
                            borderRadius: 20, justifyContent: 'center',backgroundColor:value.color, flexDirection:'row', alignItems:'center' }}>
                                <FontAwesome key={value.name + 'icon'} name={value.icon} size={15} style={{paddingRight:WIDTH*0.025}} />
                                <Text key={value.name + 'text'} style={{alignSelf:'center'}}>
                                    {value.name}
                                    </Text>
                            </Pressable>
                           
                        </View>
                    ))}
                    </Text>
                </InputSection>
            </InputForm>
           
        </ScrollView>
        </Animated.View>
        </SafeAreaView>
        </Modal>
       
    )
}
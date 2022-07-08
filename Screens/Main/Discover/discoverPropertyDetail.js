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
    Pressable
  } from 'react-native';

import styled from 'styled-components/native';

import { SharedElement } from 'react-navigation-shared-element';
import Ionicons from 'react-native-vector-icons/Ionicons';
Ionicons.loadFont()



import { Container, PropertyDescription, ImageStyle, CardSectionOne, CardTitle, LocationDistanceContainer,
        LocationText, BedAndBathContainer, BedBathLogo, Divider, CardSectionTwo, InfoHeaderText,
            InfoContainer, BothInfoContainer, InfoText, DescriptionText, AmenitiesItem, Footer,
            PricePerMonth, ContactTanentButton, TenantInfoContainer, TenantInfo, ProfileImageContainer,
            CardSectionFour, CardSectionFive} from './discoverPDStyle'
import { FlatList } from 'react-native-gesture-handler';

const PRIMARYCOLOR = '#4050B5'
const PRIMARYGREY = '#5e5d5d'

const HEIGHT = Dimensions.get('screen').height;
const WIDTH = Dimensions.get('screen').width;


export default function PropertyDetailScreen({navigation, route}){
    useEffect(()=>{
        console.log("Detail")
        console.log(route.params.data.item)
    })
    const flatListRef = useRef(null)
    const propertyAmenities = (["Furnished", "Pets Allowed", "Able to renew", "On-site waher and dryer"]);
    const data = route.params.data.item;
    const viewabilityConfigCallbackPairs = useRef([
        { onViewableItemsChanged: testFuction },
    ]);
    const [flatingScrolling, setFlatlistScrolling] = useState(false)
    
    function renderImage({data,index}){
        return(
            <View style={{width:WIDTH, height:HEIGHT*0.35,justifyContent:'center'}}>
                <Image source={{uri: route.params.data.item.imgList[index]}} style={{width:WIDTH, height:HEIGHT*0.35,}} />
               
            </View>
        )
        
    }
    const testFuction = ({
        viewableItems,
      }) => {
        console.log(viewableItems)
      };

    return(
       
        <Container>             
            <PropertyDescription>
    
                <ScrollView showsVerticalScrollIndicator={false} >
                    <View style={{height:HEIGHT*0.35, width:WIDTH}}>
                        <FlatList 
                        horizontal 
                        style={{position:'absolute', width:WIDTH, height:HEIGHT*0.35, overflow:'hidden'}}
                        data={data.imgList}
                        ref={flatListRef}
                        renderItem={(data, index)=>renderImage(data, index)}
                        snapToAlignment="center"
                        decelerationRate={"fast"}
                        showsHorizontalScrollIndicator={false}
                        bounces={false}
                        snapToInterval={WIDTH}
                        viewabilityConfigCallbackPairs={
                            viewabilityConfigCallbackPairs.current
                        }
                        />
                            
                            {/* <Image style={ImageStyle} source={{uri: data.imgList[0]}}/> */}
                        <View style={{width: WIDTH, height: HEIGHT*0.02, position:'absolute', bottom:HEIGHT*0.05, flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
                            {data.imgList.map((data, index)=>(
                                <View key={"img"+ index} style={{marginLeft:WIDTH*0.02, marginRight:WIDTH*0.02, height:HEIGHT*0.015, width:HEIGHT*0.015, 
                                borderRadius:HEIGHT*0.0075,backgroundColor:'white' }}>
                                </View>
                            ))

                            }

                        </View>
                        <Ionicons onPress={()=>navigation.goBack()} style={{position:'absolute',top:HEIGHT*0.05, left:WIDTH*0.05, opacity:0.8, zIndex:2}} name="arrow-back-circle" size={WIDTH*0.12} color={PRIMARYGREY}></Ionicons>
                    </View>
                    
                    <CardSectionOne>
                        <CardTitle>{data.location}</CardTitle>
                        <LocationDistanceContainer>
                            <LocationText>Mountain View , CA</LocationText>
                            <LocationText>3 miles away</LocationText>
                        </LocationDistanceContainer>
                        <BedAndBathContainer>
                            <BedBathLogo>
                                <Ionicons name="bed-outline" size={WIDTH*0.1} color={PRIMARYGREY}></Ionicons>
                                <LocationText>{data.bed} bedroom</LocationText>
                            </BedBathLogo>
                            <BedBathLogo>
                                <Ionicons name="eye-off-outline" size={WIDTH*0.1} color={PRIMARYGREY}></Ionicons>
                                <LocationText>{data.bath} bathroom</LocationText>
                            </BedBathLogo>
                        </BedAndBathContainer>
                    </CardSectionOne>   
                    <Divider></Divider>
                    <CardSectionTwo>
                        <BothInfoContainer>
                            <InfoContainer> 
                                <InfoHeaderText>Property Type:</InfoHeaderText>
                                <InfoText>{data.type}</InfoText>
                            </InfoContainer>
                            <InfoContainer> 
                                <InfoHeaderText>Availability:</InfoHeaderText>
                                <InfoText>From {data.availableFrom} - {data.availableTo}</InfoText>
                            </InfoContainer>
                        </BothInfoContainer>
                    </CardSectionTwo>
                    <Divider></Divider>
                    <CardSectionOne>
                        <InfoHeaderText>Descriptions:</InfoHeaderText>
                        <DescriptionText>
                            {data.description}
                        </DescriptionText>
                    </CardSectionOne>
                    <Divider></Divider>
                    
                    <CardSectionFour>
                        <InfoHeaderText>Teanant Information:</InfoHeaderText>
                        <TenantInfoContainer>
                            <ProfileImageContainer>
                                <View style={{height:HEIGHT*0.09, width:HEIGHT*0.09, borderRadius:HEIGHT*0.045, backgroundColor:PRIMARYGREY}}></View>
                            </ProfileImageContainer>
                            <TenantInfo>
                                <InfoHeaderText>Jasmine Mustafa</InfoHeaderText>
                                <InfoText>Incoming Jane Street lawyer based in NY</InfoText>
                            </TenantInfo>
                        </TenantInfoContainer>
                    </CardSectionFour>
                    <Divider></Divider>
                    <CardSectionOne>
                        <InfoHeaderText>Amenities:</InfoHeaderText>
                        {propertyAmenities.map((value)=>(
                            <AmenitiesItem key={value}>
                                <LocationText>{value}</LocationText>
                                <Ionicons name="checkbox" size={WIDTH*0.075} color={PRIMARYCOLOR}></Ionicons>
                            </AmenitiesItem>

                        ))}
                    </CardSectionOne>
                    
                </ScrollView>
            </PropertyDescription>
            <Footer>
                    <PricePerMonth>${data.price} <Text style={{fontSize: HEIGHT*0.025, fontWeight:'500'}}>/ month</Text></PricePerMonth>
                    <ContactTanentButton>
                        <Text style={{color:'white', fontWeight:'700'}}>Contact Tenant</Text>
                    </ContactTanentButton>
            </Footer>

        </Container>
       
        
    )
}
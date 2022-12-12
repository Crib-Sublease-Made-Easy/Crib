import React, {useState, useEffect} from 'react';
import {Dimensions, Pressable, Text} from 'react-native';

import styled from 'styled-components/native';
import { DARKGREY, LIGHTGREY, MEDIUMGREY, HEIGHT, WIDTH, PRIMARYCOLOR,  EXTRALIGHT } from '../../../sharedUtils';

const PRIMARYGREY = '#5e5d5d'


export const ModalView = styled.View`
    backgroundColor:black
    align-items: center;
`

export const ExitButtonContainer = styled.Pressable`
    border-width: 1px;
    border-color: white;
    padding-horizontal: ${WIDTH*0.05}px
    padding-vertical: ${HEIGHT*0.01}px
    border-radius: 20px
    
` 
export const ExitButtonText = styled.Text`
    font-weight:400;
    font-size: ${HEIGHT*0.02}px;
    
    color: white
`

export const Heading = styled.Text`
    font-size: ${HEIGHT*0.0275}px;
    font-weight:700;
    text-align: left;
    width: ${WIDTH*0.9}px;
    color: white
`
export const Subheading = styled.Text`
    font-size: ${HEIGHT*0.0175}px;
    font-weight:400;
    text-align: left;
    color: white
    marginTop: ${HEIGHT*0.02}px
`

export const CribText = styled.Text`
    font-size: ${HEIGHT*0.035}px;
    font-weight:700;
    text-align: left;
    width: ${WIDTH*0.9}px;
    color: white
    
`
export const ReviewHeading = styled.Text`
    font-size: ${HEIGHT*0.0275}px;
    font-weight:500;
    text-align: left;  
    color: white
`

export const ReviewHeadingAndEditContainer = styled.View`
    width: ${WIDTH*0.9}px;
    flex-direction: row;
    justify-content: space-between;
    align-items: center
`

export const ButtonContainer = styled.View`
    width: ${WIDTH*0.9}px;
    align-self: center
    flex-direction: row
    align-items: center
    justify-content: space-between
    padding-top: ${HEIGHT*0.01}px
`
export const ReviewButtonContainer = styled.View`
    padding-horizontal: ${WIDTH*0.05}px
    padding-vertical: ${HEIGHT*0.01}px
    border-radius: 20px
`


export const NextContainer = styled.View`
    position: absolute;
    bottom:0;
    align-items:center
    width: ${WIDTH}px
    padding-horizontal: ${WIDTH*0.05}px
    align-self: center
    background-color: black
    padding-vertical: ${HEIGHT*0.02}px
`

export const BackNextContainer = styled.View`
    justify-content: space-between
    width: ${WIDTH}px;
    align-self: center
    flex-direction: row
    align-items: center
    padding-horizontal: ${WIDTH*0.1}px
    padding-top: ${HEIGHT*0.02}px
    border-top-width: 0.5px;
    border-color: ${EXTRALIGHT}
`
export const BackText = styled.Text`
    font-size: ${HEIGHT*0.02}px
    color: white
    font-weight: 400
    textDecorationLine: underline
`

export const InfoText = styled.Text`
    width: ${WIDTH*0.9}px;
    color: white;
    text-align: left
    font-size: ${HEIGHT*0.0175}px;
    font-weight: 500;
    margin-top: ${HEIGHT*0.02}px;
    align-self: center
    
    
`

export const PostingSection = styled.View`
    width:${WIDTH}px; 
    height: ${HEIGHT}px;
    padding-horizontal: ${WIDTH*0.05}px
    padding-vertical: ${HEIGHT*0.03}px
   
   
`

export const InfoTextSection2 = styled.Text`
    width: ${WIDTH*0.8}px;
    color: white;
    text-align: left
    font-size: ${HEIGHT*0.02}px;
    font-weight: 300;
    margin-top: ${HEIGHT*0.01}px;
    
`

export const SearchInput = styled.TextInput`
  width: ${WIDTH*0.8}px;
  height: ${HEIGHT*0.06}px;
  padding-left: ${WIDTH*0.05}px;
  color: white
  border-radius: 10px;
`
export const PriceInput = styled.TextInput`
  width: ${WIDTH*0.6}px;
  height: ${HEIGHT*0.06}px;
  color: white
  border-radius: 10px;
 
 
`

export const SearchContainer = styled.View`
  height: ${HEIGHT*0.06}px;
  width: ${WIDTH*0.9}px;
  
  justify-content: center;
  align-items: center
  flex-direction: row
  align-self: center
  border-radius:10px
  border-width: 1px
  border-color: white
`
export const DollarSignText = styled.Text`
    color: white
`


export const PriceInputSearchContainer = styled.View`
  height: ${HEIGHT*0.06}px;
  width: ${WIDTH*0.9}px;
  margin-top: ${HEIGHT*0.025}px
  padding-horizontal: ${WIDTH*0.05}px
  flex-direction: row
  align-self: center
  border-radius:10px
  border-color: white
  border-width: 1px
  background-color: #0D0D0D
  flex-direction: row
  align-items: center
  justify-content: space-between
`

export const SecurityDepositInputSearchContainer = styled.View`
  height: ${HEIGHT*0.06}px;
  width: ${WIDTH*0.4}px;
  margin-top: ${HEIGHT*0.025}px
  padding-horizontal: ${WIDTH*0.05}px
  flex-direction: row
  border-radius:10px
  border-color: white
  border-width: 1px
  background-color: #0D0D0D
  flex-direction: row
  align-items: center
  justify-content: space-between
`
export const SecurityDepositInput = styled.TextInput`
  width: ${WIDTH*0.4}px;
  color: white
  height: ${HEIGHT*0.06}px;
 
`

export const InputContainer = styled.View`
    
    align-items: center;
    margin-top: ${HEIGHT*0.03}px;
    
`
export const DateSelectContainer = styled.View`
    width: ${WIDTH*0.9}px;
   
    
`   


export const DateSelectPressable = styled.Pressable`
    border-width: 1px;
    border-color: white
    width: ${WIDTH*0.5}px
    padding-vertical: ${HEIGHT*0.01}px
    align-items: center   
    border-radius: 10px;
    background-color: #0D0D0D
`
export const CategoryName = styled.Text`
    font-size: ${HEIGHT*0.02}px
   
    margin-left: ${WIDTH*0.02}px
    font-weight: 500
    color: white
`   
export const DateCategoryName = styled.Text`
    font-size: ${HEIGHT*0.0175}px
    padding-vertical: ${HEIGHT*0.01}px
    width: ${WIDTH*0.275}px
    font-weight: 500
    color: white
`   
export const BedroomCountContaienr = styled.View`
   width: ${WIDTH*0.1}px;
   padding-vertical: ${HEIGHT*0.0125}px;
   background-color: white;
   border-radius: 5px
   margin-left: ${WIDTH*0.04}px;
   margin-right: ${WIDTH*0.04}px;
   justify-content: center;
   align-items: center
`
export const BedroomBathroomCountText = styled.Text`
    font-size: ${HEIGHT*0.0175}px
    font-weight: 500;
    color: black
`

export const BedroomItemContainer = styled.Pressable`
    width: ${WIDTH*0.15}px;
    border-radius: 10px;
    height: ${HEIGHT*0.035}px;
    border-width: 1px;
    border-color: white
    justify-content: center;
    align-items: center;
    background-color: ${props=>(props.value == props.userInput ? 'white' : 'transparent' )}
`

export const BedBathPressable = styled.Pressable`
    width: ${WIDTH*0.15}px;
    height: ${HEIGHT*0.05}px;
    background-color: white
    justify-content: center
    border-radius: 10px;
`
export const BedBathInput = styled.TextInput`
    width: ${WIDTH*0.15}px;
    height: ${HEIGHT*0.05}px;
    background-color: white
    border-radius: 10px;
    font-size: ${HEIGHT*0.025}px;
    font-weight: 400;
    text-align: center
    
`

export const AmenitiesContainer = styled.Text`
    width: ${WIDTH*0.9}px;
   
    marginTop: ${HEIGHT*0.02}px;
`

export const AmenitiesItem = styled.View`
    height: ${HEIGHT*0.02}px;
    border-radius: 10px;
    border-color: white;
    border-width: 1px;
    margin-left: ${WIDTH*0.01}px;
`

export const AmenitiesName = styled.Text`
    font-size: ${HEIGHT*0.02}px
    font-weight: 400
    color: white
    margin-left: ${WIDTH*0.05}px
`

export const PropertyPhotoContainer = styled.View`
    width: ${WIDTH*0.9}px;
    margin-top: ${HEIGHT*0.02}px
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
   
`

export const PhotoContainer = styled.View`
    width: ${WIDTH*0.15}px;
    height: ${WIDTH*0.15}px
    border-radius:15px;
    background-color: ${MEDIUMGREY};
    justify-content:center
    align-items:center
`
export const RowContainer = styled.Pressable`
    padding-vertical: ${HEIGHT*0.01}px
    width: ${WIDTH*0.9}px;
    align-items: center
    flex-direction: row
    justify-content: space-between
`
export const RowContainerCol = styled.View`
    padding-vertical: ${HEIGHT*0.025}px
    width: ${WIDTH*0.9}px;
    align-self: center
    justify-content: space-between
    flex-direction: row
`

export const CounterContainer = styled.View`
    flex-direction: row;
    align-items: center
`

export const FollowUpContainer = styled.View`
    padding-vertical: ${HEIGHT*0.02}px
    width: ${WIDTH*0.9}px;
    align-items: center
    flex-direction: row
`
export const FollowUpText = styled.Text`
    font-size: ${HEIGHT*0.0175}px;
    margin-left: ${WIDTH*0.05}px
    color: white;
`
export const RowValueContainer = styled.Pressable`
    justify-content: space-between;
    flex-direction: row;
    align-items: center
    padding-vertical: ${HEIGHT*0.015}px
    
`
export const RowName = styled.Text`
    font-size: ${HEIGHT*0.0175}px
    color:white
`

export const PropertyDescriptionInput = styled.TextInput`
    width: ${WIDTH*0.9}px;
    height: ${HEIGHT*0.225}px;
    border-width: 1px;
    border-color: white
    border-radius: 15px;
    color: white
    background-color: #0D0D0D
    margin-top: ${HEIGHT*0.03}px;
    padding-horizontal: ${HEIGHT*0.02}px;
    padding-vertical: ${HEIGHT*0.04}px;
`

export const Divider = styled.View`
    width: ${WIDTH*0.9}px;
    height: ${HEIGHT*0.0005}px;
    background-color: #E0E0E0

`

export const ReviewInfoText = styled.Text`
    font-size: ${HEIGHT*0.0175}px;
    font-weight: 300;
    color: white
    padding-top: ${HEIGHT*0.02}px
`
export const ReviewSectionContainer = styled.View`
    padding-vertical: ${HEIGHT*0.02}px;
    border-bottom-width: 0.5px;
    border-color: #1C1C1C
`

export const BedAndBathContainer = styled.View`
    margin-top: ${HEIGHT*0.02}px
    flex-direction: row
    align-items: center;
`

export const BedBathLogo = styled.View`
    height: ${HEIGHT*0.06}px;
    width: ${WIDTH*0.43}px;
    border-width: 1px;
    border-color: white;
    border-radius: 15px;
    padding: ${WIDTH*0.02}px;
    flex-direction: row
    align-items: center
    justify-content: space-around
`
export const LocationText = styled.Text`
    font-size: ${HEIGHT*0.02}px;
    font-weight: 400;
    color: white
`

export const ReviewPropertyDescriptionInput = styled.TextInput`
    width: ${WIDTH*0.9}px;
    padding-top: ${HEIGHT*0.02}px;
    color: white
`
export const Footer = styled.View`
    width: ${WIDTH}px;
    height: ${HEIGHT*0.125}px;
    justify-content: space-around;
    align-items: center
    flex-direction: row
    padding-bottom: ${HEIGHT*0.02}px;
    borderTopWidth: 1px;
    borderTopColor: #E0E0E0;

`
export const ContactTanentButton = styled(Pressable)`
    width: ${WIDTH*0.4}px;
    height: ${HEIGHT*0.06}px;
    backgroundColor:  ${props=>(props.loading ? MEDIUMGREY : PRIMARYCOLOR)}}
    border-radius: 30px;
    justify-content: center;
    align-items: center;
`

export const PricePerMonth = styled.Text`
    font-size: ${HEIGHT*0.025}px;
    font-weight: 700;
    color: white
`

export const ReviewLocationContainer = styled.View`
    flex-direction: row;
    align-items: center
    width: ${WIDTH*0.9}px
    margin-top: ${HEIGHT*0.03}px
`

export const ReviewDateContainer = styled.View`
    padding-vertical: ${HEIGHT*0.01}px
    width: ${WIDTH*0.9}px;
    justify-content: space-between
    flex-direction: row;
    align-items: center
`

export const ImageSelectionContainer = styled.View`
    padding-vertical: ${HEIGHT*0.03}px;
`

export const ImageTypeText = styled.Text`
    font-size: ${HEIGHT*0.025}px;
    color: white
    font-weight: 500
`
export const ImageText = styled.Text`
    color: white
    font-size: ${HEIGHT*0.0175}px;
    font-weight: 400
    align-self:center
    width: ${WIDTH*0.9}px
    padding-vertical: ${HEIGHT*0.01}px
`

export const ImageContainer = styled.Pressable`
    width: ${WIDTH*0.9}px
    height: ${WIDTH*0.8}px
    margin-top: ${HEIGHT*0.015}px
    border-radius: 10px;
    background-color: ${MEDIUMGREY}
    align-self: center
    justify-content: center;
    align-items: center
`

export const ReivewImageContainer = styled.View`
    width: ${WIDTH*0.9}px
    height: ${WIDTH*0.8}px
    margin-top: ${HEIGHT*0.1}px
    border-radius: 10px;
    background-color: ${MEDIUMGREY}
    align-self: center
    justify-content: center;
    align-items: center
`

export const MaxText = styled(Text)`
    width: ${WIDTH*0.9}px;
    align-self: center
    margin-top: ${HEIGHT*0.01}px
    color: ${props=>(props.length == 700 ? 'red'  : 'white')}
    text-align: right
`
export const SmallContinueButton = styled.Pressable`
    padding-vertical: ${HEIGHT*0.015}px
    padding-horizontal: ${WIDTH*0.075}px
    background-color: ${PRIMARYCOLOR}
    border-radius: 10px
`

export const ContinueButton = styled(Pressable)`
    width: ${WIDTH*0.7}px;
    max-height: ${HEIGHT*0.07}px
    padding-vertical: ${HEIGHT*0.02}px
    backgroundColor:  ${props=>(props.loading ? MEDIUMGREY : PRIMARYCOLOR)}}
    align-self: center
    border-radius: 20px
    justify-content: center
    align-items: center
    shadow-offset: 0 0
    shadow-color: white;
    shadow-radius: 5px;
    shadow-opacity: 0.2;
    elevation: 5
`

//Continue Button Text used in sign up 
export const ContinueText = styled.Text`
    font-size: ${ HEIGHT*0.02}px;
    font-weight: 400
    color: white
    
`
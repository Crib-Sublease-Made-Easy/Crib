import React, {useState, useEffect} from 'react';
import {Dimensions,} from 'react-native';

import styled from 'styled-components/native';
import { DARKGREY, EXTRALIGHT, LIGHTGREY, MEDIUMGREY } from '../../../sharedUtils';

const PRIMARYCOLOR = '#4050B5'
const PRIMARYGREY = '#5e5d5d'

const HEIGHT = Dimensions.get('screen').height;
const WIDTH = Dimensions.get('screen').width;

export const ImageStyle= {position:'absolute', width:WIDTH, height:HEIGHT*0.35,}

export const Container = styled.View`
  height: ${HEIGHT}px;
  width: ${WIDTH}px;
  backgroundColor: white
  position: relative
`

export const PropertyDescription = styled.View`
    height: ${HEIGHT*0.875}px;
    width: ${WIDTH}px;
    position: relative
`
export const CardTitle = styled.Text`
    font-size: ${HEIGHT*0.02}px;
    font-weight: 600;
    width: ${WIDTH*0.9}px;
`
export const CardSectionOne = styled.View`
    margin-top: ${HEIGHT*0.025}px
    padding-vertical: ${HEIGHT*0.01}px
    align-items: center
`
export const LocationDistanceContainer = styled.View`
    height: ${HEIGHT*0.05}px;
    width: ${WIDTH*0.9}px;
    flex-direction: row
    align-items: center;
   
`
export const LocationText = styled.Text`
    font-size: ${HEIGHT*0.0175}px;
    font-weight: 400;
    color: ${PRIMARYGREY}
`
export const BedAndBathContainer = styled.View`
   
    padding-vertical: ${HEIGHT*0.015}px
    width: ${WIDTH*0.9}px;
    flex-direction: row
    align-items: center;
    justify-content: space-between;
`

export const BedBathLogo = styled.View`
   
    width: ${WIDTH*0.43}px
    border-width: 1px;
    border-color: ${PRIMARYGREY};
    border-radius: 15px;
    padding: ${WIDTH*0.02}px;
    justify-content: space-around
    align-items: center
    flex-direction: row
`

export const Divider = styled.View`
    align-self: center;
    width: ${WIDTH*0.9}px;
    height: ${HEIGHT*0.002}px;
    background-color: #E0E0E0
   
`
export const CardSectionTwo = styled.View`
    padding-vertical: ${HEIGHT*0.02}px
    align-items:center
`
export const InfoContainer = styled.View`
    padding-vertical: ${HEIGHT*0.015}px
   
    width: ${WIDTH*0.9}px;
    justify-content: center
`
export const InfoHeaderText = styled.Text`
    font-size: ${HEIGHT*0.02}px;
    font-weight: 500;
    width: ${WIDTH*0.9}px;
    align-self: center
    
`
export const BothInfoContainer = styled.View`
    justify-content: space-around
`
export const InfoText = styled.Text`
    font-size: ${HEIGHT*0.0175}px;
    font-weight: 400;
    width: ${WIDTH*0.5}px;
    color: ${PRIMARYGREY}
    margin-top: ${HEIGHT*0.005}px
`

export const DescriptionText = styled.Text`
    font-size: ${HEIGHT*0.02}px;
    font-weight: 400;
    width: ${WIDTH*0.8}px;
    marginTop: ${HEIGHT*0.01}px;
`

export const AmenitiesItem = styled.View`
    width: ${WIDTH*0.9}px;
    height: ${HEIGHT*0.05}px;
    align-items:center;
    flex-direction: row;
    justify-content: space-between;
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
export const PricePerMonth = styled.Text`
    font-size: ${HEIGHT*0.025}px;
    font-weight: 700;
`
export const ContactTanentButton = styled.Pressable`
    width: ${WIDTH*0.4}px;
    height: ${HEIGHT*0.06}px;
    background-color: ${PRIMARYCOLOR};
    border-radius: 30px;
    justify-content: center;
    align-items: center;
`

export const TenantInfoContainer = styled.View`
   
    flex-direction: row;
    width: ${WIDTH*0.9}px;
    justify-content: space-between;
    align-items: center;
    margin-top: ${HEIGHT*0.02}px;
   
`
export const TenantInfo = styled.View`
    
    
    width: ${WIDTH*0.6}px;
    justify-content:center

`

export const ProfileImageContainer = styled.View`
    width: ${WIDTH*0.3}px;
    height: ${HEIGHT*0.15}px;
    justify-content: center
`

export const CardSectionFour = styled.View`
   
    padding-left: 5%;
    padding-top: ${HEIGHT*0.03}px;
`

export const CardSectionFive = styled.View`
    padding-top: ${HEIGHT*0.02}px;

`

export const RowContainer = styled.View`
    padding-vertical: ${HEIGHT*0.01}
    width: ${WIDTH*0.9}px
`

export const DateContainer = styled.View`
    margin-top: ${HEIGHT*0.005}px
    width: ${WIDTH*0.8}px;
    justify-content: space-between;
    align-items: center
    flex-direction: row
`

export const DateText = styled.Text`
    font-size: ${HEIGHT*0.0175}px;
    color: ${PRIMARYGREY}
`

export const DescriptionContainer = styled.View`
    margin-top: ${HEIGHT*0.01}px
    width: ${WIDTH*0.9}px;
    background-color: ${EXTRALIGHT};
    height: ${HEIGHT*0.15}px
    align-self: center
    border-radius: 10px
    padding-vertical: ${HEIGHT*0.01}px;
    padding-horizontal: ${WIDTH*0.02}px
`
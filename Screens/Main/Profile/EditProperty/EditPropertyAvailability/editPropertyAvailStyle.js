import React, {useState, useEffect} from 'react';
import {Dimensions,} from 'react-native';

import styled from 'styled-components/native';
import { DARKGREY, LIGHTGREY, MEDIUMGREY, EXTRALIGHT } from '../../../../../sharedUtils'

const PRIMARYCOLOR = '#4050B5'
const PRIMARYGREY = '#5e5d5d'

const HEIGHT = Dimensions.get('screen').height;
const WIDTH = Dimensions.get('screen').width;

export const RowContainer = styled.View`
    padding-vertical: ${HEIGHT*0.02}px
    width: ${WIDTH*0.9}px;
    align-self: center
    
`
export const CategoryName = styled.Text`
    font-size: ${HEIGHT*0.0175}px
    padding-vertical: ${HEIGHT*0.01}px
    font-weight: 500
    color: black
`

export const DateContainer = styled.Pressable`
    width: ${WIDTH*0.9}px;
    background-color: ${EXTRALIGHT}
    height: ${HEIGHT*0.05}px
    padding-left: ${WIDTH*0.025}px
    border-radius: 10px
    justify-content:center
`
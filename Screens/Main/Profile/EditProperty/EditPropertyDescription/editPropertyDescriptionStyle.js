import React, {useState, useEffect} from 'react';
import {Dimensions,} from 'react-native';

import styled from 'styled-components/native';
import { DARKGREY, LIGHTGREY, MEDIUMGREY, EXTRALIGHT } from '../../../../../sharedUtils'

const PRIMARYCOLOR = '#4050B5'
const PRIMARYGREY = '#5e5d5d'

const HEIGHT = Dimensions.get('screen').height;
const WIDTH = Dimensions.get('screen').width;

export const DescriptionInput = styled.TextInput`
    width: ${WIDTH*0.9}px;
    height: ${HEIGHT*0.3}px;
    border-radius: 10px
    color: black
    background-color: ${LIGHTGREY}
    padding-top: ${HEIGHT*0.01}px;
    padding-horizontal: ${HEIGHT*0.02}px;
    align-self:center
    textAlignVertical: top
`
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
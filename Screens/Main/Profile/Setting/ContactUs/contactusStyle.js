import styled from 'styled-components/native';

import { HEIGHT, WIDTH, PRIMARYCOLOR, LIGHTGREY, MEDIUMGREY, EXTRALIGHT, DARKGREY } from '../../../../../sharedUtils'

export const RowContainer = styled.View`
    padding-vertical: ${HEIGHT*0.01}px
    width: ${WIDTH*0.9}px;
    align-self: center
`

export const CategoryName = styled.Text`
    font-size: ${HEIGHT*0.0175}px
    padding-vertical: ${HEIGHT*0.01}px
    font-weight: 500
    color: black
`
export const TitleContainer = styled.TextInput`
    width: ${WIDTH*0.9}px;
    background-color: ${EXTRALIGHT}
    height: ${HEIGHT*0.05}px
    padding-left: ${WIDTH*0.025}px
    border-radius: 10px
    color: black
`

export const DescriptionInput = styled.TextInput`
    width: ${WIDTH*0.9}px;
    height: ${HEIGHT*0.2}px;
    border-radius: 10px
    color: black
    background-color: ${EXTRALIGHT}
    padding-top: ${HEIGHT*0.01}px;
    padding-horizontal: ${HEIGHT*0.02}px;
    align-self:center
    
`
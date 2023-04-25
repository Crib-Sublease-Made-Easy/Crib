import styled from 'styled-components/native';

import { HEIGHT, WIDTH, PRIMARYCOLOR, LIGHTGREY, MEDIUMGREY, EXTRALIGHT, DARKGREY } from '../../../../sharedUtils'


export const Title = styled.Text`
    
    font-size: ${HEIGHT*0.03}px
    font-weight: 500
  
`

export const SubtenantContainer = styled.Pressable`
    width: ${WIDTH*0.9}px
    padding-vertical: ${HEIGHT*0.015}px
    border-radius: 10px
    border-width: 1px
    border-color: ${DARKGREY}
    margin-top: ${HEIGHT*0.035}px
    padding-horizontal: ${WIDTH*0.025}px
`

export const SubtenantNameText = styled.Text`
    font-size: ${HEIGHT*0.0225}px
    font-weight: 600
    color: ${PRIMARYCOLOR}
`

export const SubtenantDetailText = styled.Text`
    font-size: ${HEIGHT*0.0175}px
    color: black
    width: ${WIDTH*0.9*0.9}px
`
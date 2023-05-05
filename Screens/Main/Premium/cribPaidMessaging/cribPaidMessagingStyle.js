import styled from 'styled-components/native';

import { HEIGHT, WIDTH, PRIMARYCOLOR, LIGHTGREY, MEDIUMGREY, EXTRALIGHT, DARKGREY } from '../../../../sharedUtils'

export const CribConnectModal = styled.View`
    width: ${WIDTH*0.8}px;
    height: ${HEIGHT*0.5}px
    background: white
    border-radius: 20px
    align-slef: center
    padding-vertical: ${HEIGHT*0.02}px
`

export const CribPremiumSubheaderText = styled.Text`
  font-size: ${HEIGHT*0.0325}px
  margin-top: ${HEIGHT*0.01}px
  width: ${WIDTH*0.9}px;
  font-weight: 500
  align-self: center
`
export const PriceContainer = styled.View`
    width: ${WIDTH*0.9}px
    padding-top: ${HEIGHT*0.015}px
    padding-bottom: ${HEIGHT*0.01}px
    border-top-width: 3px
    border-color: ${PRIMARYCOLOR}
    align-self: center
`

export const PriceText = styled.Text`
    font-size: ${HEIGHT*0.0275}px
`

export const PriceBreakDownText = styled.Text`
    font-size: ${HEIGHT*0.015}px
    font-weight: 600

`

export const SubtitleText = styled.Text`
    font-size: ${HEIGHT*0.02}px
    
    width: ${WIDTH*0.85}px
    align-self: center
`
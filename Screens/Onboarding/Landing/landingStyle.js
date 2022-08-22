import styled from 'styled-components/native';

import { WIDTH, HEIGHT, PRIMARYCOLOR, TEXTINPUTBORDERCOLOR , OnlyLetters,  } from '../../../sharedUtils';

const FONTFAMILY = 'EBGaramond-Bold'

export const TopContainer = styled.View`
    
    width: ${WIDTH}px;
    padding-horizontal: ${WIDTH*0.1}px
`

export const BottomContainer = styled.View`
    margin-top: ${HEIGHT*0.1}px
    width: ${WIDTH}px;  
    padding-horizontal: ${WIDTH*0.1}px
    
`

export const HeadingText = styled.Text`
    width: ${WIDTH*0.8}px
    font-size: ${HEIGHT*0.06}px;
    font-weight: 600
    color: white
    
   
`
export const SubHeadingText = styled.Text`
    width: ${WIDTH*0.8}px
    font-size: ${HEIGHT*0.0225}px;
    font-weight: 500
    color: white
    margin-top: ${HEIGHT*0.01}px
    
`

export const JoinButton = styled.Pressable`
    width: ${WIDTH*0.8}px;
    padding-vertical: ${HEIGHT*0.0135}px
    border-width:1.5px
    border-color: white
    border-radius: 30px
    margin-top: ${HEIGHT*0.015}px
    flex-direction: row
    align-items:center
    justify-content: center
`
export const JoinText = styled.Text`
    margin-left: ${WIDTH*0.025}px
    font-size: ${HEIGHT*0.02}px
    font-weight: 500
    color: white
    
`


export const LoginText = styled.Text`
    width: ${WIDTH*0.8}px
    font-size: ${HEIGHT*0.02}px;
    font-weight: 400
    color: white
    align-self: center
    margin-top: ${HEIGHT*0.05}px
    text-align:center
    
`

export const TopLeftText = styled.Text`
    font-size: ${HEIGHT*0.07}px
    font-weight: 700
    color: white
    font-family: ${FONTFAMILY}
`
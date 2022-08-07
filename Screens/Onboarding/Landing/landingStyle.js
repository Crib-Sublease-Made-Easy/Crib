import styled from 'styled-components/native';

import { WIDTH, HEIGHT, PRIMARYCOLOR, TEXTINPUTBORDERCOLOR , OnlyLetters, FONTFAMILY } from '../../../sharedUtils';


export const TopContainer = styled.View`
    height: ${HEIGHT*0.4}px
    width: ${WIDTH}px;
`

export const BottomContainer = styled.View`
   
    align-items: center
`

export const HeadingText = styled.Text`
    width: ${WIDTH*0.8}px
    font-size: ${HEIGHT*0.06}px;
    font-weight: 500
    color: white
    font-family: ${FONTFAMILY}
   
`
export const SubHeadingText = styled.Text`
    width: ${WIDTH*0.8}px
    font-size: ${HEIGHT*0.02}px;
    font-weight: 400
    color: white
    margin-top: ${HEIGHT*0.01}px
    font-family: ${FONTFAMILY}
`

export const JoinButton = styled.Pressable`
    width: ${WIDTH*0.8}px;
    height: ${HEIGHT*0.075}px;
    background-color: white
    border-radius: 15px
    justify-content: center 
    align-items: center
    margin-top: ${HEIGHT*0.05}px
    shadow-offset: 0 0
    shadow-color: black;
    shadow-radius: 10px;
    shadow-opacity: 0.3;
    elevation: 5
`
export const JoinText = styled.Text`
    font-size: ${HEIGHT*0.03}px;
    font-weight: 500
    font-family: ${FONTFAMILY}
`


export const LoginText = styled.Text`
    width: ${WIDTH*0.8}px
    font-size: ${HEIGHT*0.02}px;
    font-weight: 400
    color: white
    align-self: center
    margin-top: ${HEIGHT*0.05}px
    text-align:center
    font-family: ${FONTFAMILY}
`
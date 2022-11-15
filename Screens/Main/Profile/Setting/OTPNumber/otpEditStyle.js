import {
    Dimensions, 
  } from 'react-native';
import styled from 'styled-components/native';
import React, {useRef, useState} from 'react'

import { HEIGHT, WIDTH, PRIMARYCOLOR, DARKGREY} from '../../../../../sharedUtils'

export const HeaderContainer = styled.View`
    width: ${WIDTH}px;
    height: ${HEIGHT*0.05}px;
    border-top-right-radius: 20px;
    border-top-left-radius: 20px;
    flex-direction: row;
    border-bottom-width: 0.5px;
    border-color: #E0E0E0
    align-self:center
`

export const BackButtonContainer = styled.View`
    padding-left: ${WIDTH*0.025}px
    width: ${WIDTH*0.25}px;
    height: 100%
    justify-content: center;
    align-items:flex-start;

`

export const NameContainer = styled.View`
    width: ${WIDTH*0.5}px;
    justify-content: center;
    align-items:center
 
  `

export const ResetButtonContainer = styled.View`
    width: ${WIDTH*0.25}px;
    padding-right: ${WIDTH*0.025}px
    height: 100%
    justify-content: center;
    align-items:flex-end;
`

export const Header = styled.Text`
    font-size: ${HEIGHT*0.02}px;
    font-weight: 500;
`
export const HelpText = styled.Text`
    width: ${WIDTH*0.9}px;
    margin-top: ${HEIGHT*0.015}px
    align-self: center;
    font-size: ${HEIGHT*0.0175}px
    padding-vertical: ${HEIGHT*0.01}px
    font-weight: 400
    color: ${DARKGREY}
`
export const SubtitleText = styled.Text`
    width: ${WIDTH*0.8}px;
    margin-top: ${HEIGHT*0.05}px
    font-size: ${HEIGHT*0.0175}px
    padding-left: ${WIDTH*0.05}px;
    color: ${DARKGREY}
`


//otp stuff
export const HiddenTextInput = styled.TextInput`
    border-color: ${PRIMARYCOLOR}
    border-width: 2px;
    border-radius: 5px;
    padding: ${HEIGHT*0.007}px;
    width: ${WIDTH*0.7}px;
    color: black
    display: none
`
export const OTPInputContainer = styled.Pressable`
    width: ${WIDTH*0.9}px;
    flex-direction: row;
    justify-content: space-around;
`

export const OTPInputSection = styled.View`
    align-items: center;
    width: ${WIDTH}px;
    margin-top : ${HEIGHT*0.03}px
`

export const OTPInput = styled.View`
    background-color: #E0E0E0
    min-width: ${WIDTH*0.12}px
    justify-content: center
    border-radius: 15px;
    height: ${HEIGHT*0.07}px
    
`

export const OTPInputText = styled.Text`
    fontSize: 22px;
    font-weight: bold;
    text-align: center;
    color: #737070
`
export const Heading = styled.Text`
  color: black;
  fontWeight: 500
  fontSize: ${HEIGHT*0.03}px;
  padding-left: ${WIDTH*0.05}px;
`

export default OTPInputField = ({setPinReady, code, setCode, maxLength}) => {
    const textInputRef = useRef(null)
    const codeDigitsArray = new Array(maxLength).fill(0)
    const [inputContainerIsFocused, setinputContainerIsFocused] = useState(false)

    const toCodeDigitInput = (value, index) => {
        const emptyInputChar = "";
        const digit = code[index] || emptyInputChar

        return(
            <OTPInput key={index}>
                <OTPInputText>{digit}</OTPInputText>
            </OTPInput>
        )
    }

    const handleOnPress = () => {
        setinputContainerIsFocused(true);
        textInputRef?.current?.focus();
    }
    const handleBlur = () => {
        setinputContainerIsFocused(false)
    }
    return(
        <OTPInputSection>
            <OTPInputContainer onPress={handleOnPress}>
                {codeDigitsArray.map(toCodeDigitInput)}
            </OTPInputContainer>
            <HiddenTextInput
                value={code}
                onChangeText={setCode}
                maxLength={maxLength}
                keyboardType="number-pad"
                returnKeyType="done"
                ref={textInputRef}
                onBlur={handleBlur}            
                
            />
        </OTPInputSection>
    )
}
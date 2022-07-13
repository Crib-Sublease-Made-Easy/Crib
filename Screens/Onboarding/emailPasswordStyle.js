import {
    Dimensions, 
  } from 'react-native';
import styled from 'styled-components/native';

const HEIGHT = Dimensions.get('screen').height;
const WIDTH = Dimensions.get('screen').width;
const PRIMARYCOLOR = '#4050B5';

export const StandardButtonStyle = {width: WIDTH*0.8, height: HEIGHT*0.06, backgroundColor:PRIMARYCOLOR, borderRadius:15, 
                                    marginTop: HEIGHT*0.04, marginBottom: HEIGHT*0.05, justifyContent:'center', alignItems: 'center'}

export const StandardInputStyle = {borderBottomColor:'black', borderBottomWidth: 1, width: WIDTH*0.8, height: HEIGHT*0.05, 
                                    marginTop: HEIGHT*0.02, alignSelf: 'center'};

export const Container = styled.View`
  height: 100%;
  width: 100%;
  padding-top: ${HEIGHT*0.02}px;
  padding-left: 10%;
  padding-right: 10%;
  backgroundColor: white
`

export const Heading = styled.Text`
  color: ${PRIMARYCOLOR};
  fontWeight: 500
  fontSize: ${HEIGHT*0.05}px;
  
`
export const SignupForm = styled.View`
  height: 100%;
  width: 100%;
`
export const ButtonText = styled.Text`
  color: white;
  fontSize: ${HEIGHT*0.02}px;
`

export const HeadingImageContainer = styled.View`
flex-Direction: row;
align-items:center;
`
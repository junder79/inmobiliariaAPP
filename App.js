import React from 'react';
import { View, Image,StyleSheet } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { Container, Header, Title, Button, Left, Right, Body, Icon, Text, Form } from 'native-base';
import { createStackNavigator } from 'react-navigation-stack';

import Formulario from './componentes/formularioVivienda';
import consultar from './componentes/consultarVivienda';
import HeaderCustom from './componentes/header';
import IconFont from 'react-native-vector-icons/FontAwesome';
import ImagePicker from 'react-native-image-picker';
class InicioPantalla extends React.Component {


  // foto = async () => {
  //   const options = {
  //     title: 'Select Avatar',
  //     customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
  //     storageOptions: {
  //       skipBackup: true,
  //       path: 'images',
  //     },
  //   };
  //   console.log("PRESIONADO");
  //   // ImagePicker.launchCamera(options, (response) => {
  //   //   // Same code as in above section!
  //   // });
  //   // ImagePicker.launchImageLibrary(options, response => {
  //   //   // Same code as in above section!
  //   //   console.log("IMAGEN " + response);
  //   //   if (response.url) {
  //   //     this.setState({ photo: response });
  //   //   }
  //   // });
  //   // Open Image Library:

  //   ImagePicker.showImagePicker(options, (response) => {
  //     console.log('Response = ', response);

  //     if (response.didCancel) {
  //       console.log('User cancelled image picker');
  //     } else if (response.error) {
  //       console.log('ImagePicker Error: ', response.error);
  //     } else if (response.customButton) {
  //       console.log('User tapped custom button: ', response.customButton);
  //     } else {
  //       const source = { uri: response.uri };

  //       // You can also display the image using data:
  //       // const source = { uri: 'data:image/jpeg;base64,' + response.data };

  //       this.setState({
  //         avatarSource: source,
  //       });
  //     }
  //   });
  // }
  render() {

    return (


      <View style={{ flex: 1}}>
        <HeaderCustom tituloHeader="Inicio" esInicio={true} navigation={this.props.navigation} ></HeaderCustom>
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Button style={{marginTop:10}} light onPress={() => this.props.navigation.navigate('Formulario')}><Text>Agregar Entrega</Text><IconFont name="plus" style={{marginRight:10}} size={20}></IconFont></Button>
        </View>
        {/* <Formulario></Formulario> */}
      
      </View>

    );
  }
}

class AjustesPantalla extends React.Component {
  render() {
    return (

      <View>
        <HeaderCustom tituloHeader="Ajustes" esInicio={true}></HeaderCustom>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Settings!</Text>
        </View>
      </View>
    );
  }
}

class ConsultarViviendaPantalla extends React.Component {
  render() {
    return (

      <View>
        <HeaderCustom tituloHeader="Consultar" esInicio={true}></HeaderCustom>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Consultar</Text>
        </View>
      </View>
    );
  }
}

/* Objeto de Navegacion, acá le digo que pantalla puede navegar hacia otra PANTALLA */


const navOptionHandler = (navigation) => ({
  header: null
})

const InicioStack = createStackNavigator({
  InicioPantalla: {
    screen: InicioPantalla,
    navigationOptions: navOptionHandler
  },
  Formulario: {
    screen: Formulario,
    navigationOptions: navOptionHandler
  }
})



const ConsultaStack = createStackNavigator({
  ConsultarViviendaPantalla: {
    screen: ConsultarViviendaPantalla,
    navigationOptions: navOptionHandler
  },
  Consultar: {
    screen: consultar,
    navigationOptions: navOptionHandler
  }
})

/* Objeto del TAB NAVIGATION */

const TabNavigator = createBottomTabNavigator({
  Inicio: {
    screen: InicioStack,
    navigationOptions: {
      tabBarLabel: 'Inicio',
      tabBarIcon: ({ tintColor }) => (
        <IconFont name="home" size={30} ></IconFont>
      )
    }
  },
  Consultar: {
    screen: ConsultarViviendaPantalla,
    navigationOptions: {
      tabBarLabel: 'Consultar',
      tabBarIcon: ({ tintColor }) => (
        <IconFont name="search" size={30} ></IconFont>
      )
    }
  },
  Ajustes: {
    screen: AjustesPantalla,
    navigationOptions: {
      tabBarLabel: 'Ajustes',
      tabBarIcon: ({ tintColor }) => (
        <IconFont name="cog" size={30} ></IconFont>
      )
    }
  },
});

export default createAppContainer(TabNavigator);
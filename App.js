import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, RefreshControl } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { Container, Header, Title, Button, Left, Right, Body, Icon, Text, Form } from 'native-base';
import { createStackNavigator } from 'react-navigation-stack';

import Formulario from './componentes/formularioVivienda';
import Consultar from './componentes/consultarVivienda';
import HeaderCustom from './componentes/header';
import IconFont from 'react-native-vector-icons/FontAwesome';
import IconFeather from 'react-native-vector-icons/Feather';
import ImagePicker from 'react-native-image-picker';
import AsyncStorage from '@react-native-community/async-storage';
import { ScrollView } from 'react-native-gesture-handler';
const wait = (timeout) => {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
}

function InicioPantalla({ navigation }) {

  const [registros, setRegistros] = useState([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const [mostrarForm, guardarMostrarForm] = useState(false);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);

    wait(2000).then(() => setRefreshing(false));
  }, []);

  useEffect(() => {
    const obtenerData = async () => {
      try {
        const registroStorage = await AsyncStorage.getItem('registroAsync');
        console.log(registroStorage)
        if (registroStorage) {
          setRegistros(JSON.parse(registroStorage));
        }
      } catch (e) {
        // saving error
      }
    }
    obtenerData();
  }, []);
  //Muestra el formulario
  mostrarFormulario =() => {
    guardarMostrarForm(!mostrarForm);
  }
  return (


    <View style={{ flex: 1 }}>
      <HeaderCustom tituloHeader="Inicio" esInicio={true} /*  navigation={this.props.navigation} */ ></HeaderCustom>
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <Button style={{ marginTop: 5 }} light onPress={() => mostrarFormulario() }  ><Text style={{fontSize:10}}>Nueva Entrega</Text><IconFont name="plus" style={{ marginRight: 10 }} size={20}></IconFont></Button>
      </View>
      <View>
        {mostrarForm ? (
          <Formulario></Formulario>
        ) : (
<ScrollView refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
        {registros.map(registro => (
          <View style={styles.registroAsyn}>

            <Text style={styles.label}>Casa:</Text>
            <Text>{registro.selectCasa}</Text>


            <Text style={styles.label}>Recinto:</Text>
            <Text>{registro.selectRecinto}</Text>


            <Text style={styles.label}>Observación:</Text>
            <Text>{registro.observationText}</Text>


            <Text style={styles.label}>Estado:</Text>
            <Text>{registro.selectEstado}
            </Text>

          </View>
        ))}
      </ScrollView>
      )}
      </View>
      


    </View>

  );
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
        {/* <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}> */}
        <Consultar></Consultar>
        {/* </View> */}
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
    screen: Consultar,
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
        <IconFeather name="home" size={30} ></IconFeather>
      ),
      tabBarOptions: {
        activeTintColor: 'black',
        labelStyle: {
          fontSize: 13,

        },
        style: {
          backgroundColor: 'white',
          color: 'white',

        },
      }
    }
  },
  Consultar: {
    screen: ConsultarViviendaPantalla,
    navigationOptions: {
      tabBarLabel: 'Consultar',
      tabBarIcon: ({ tintColor }) => (
        <IconFeather name="search" size={30} ></IconFeather>
      ), tabBarOptions: {
        activeTintColor: 'black',
        labelStyle: {
          fontSize: 13,

        },
        style: {
          backgroundColor: 'white',
          color: 'white',

        },
      }
    }
  },
  Ajustes: {
    screen: AjustesPantalla,
    navigationOptions: {
      tabBarLabel: 'Ajustes',
      tabBarIcon: ({ tintColor }) => (
        <IconFont name="cog" size={30} ></IconFont>
      ), tabBarOptions: {
        activeTintColor: 'black',
        labelStyle: {
          fontSize: 13,

        },
        style: {
          backgroundColor: 'white',
          color: 'white',

        },
      }
    }
  },
});

const styles = StyleSheet.create({
  registroAsyn: {
    backgroundColor: '#fff',
    marginBottom: 10,
    borderBottomColor: '#e1e1e1',
    borderBottomWidth: 1,
    paddingVertical: 20,
    paddingRight: 10,
    paddingLeft: 10,
    marginTop: 10
  },
  label: {
    fontWeight: 'bold',
  },
  text: {

  }
})
export default createAppContainer(TabNavigator);
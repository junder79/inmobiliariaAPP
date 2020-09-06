import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, RefreshControl, ToastAndroid } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Right, Body } from 'native-base';
import { createStackNavigator } from 'react-navigation-stack';

import Formulario from './componentes/formularioVivienda';
import Consultar from './componentes/consultarVivienda';
import HeaderCustom from './componentes/header';
import IconFont from 'react-native-vector-icons/FontAwesome';
import IconFeather from 'react-native-vector-icons/Feather';
import ImagePicker from 'react-native-image-picker';
import AsyncStorage from '@react-native-community/async-storage';
import { ScrollView, FlatList } from 'react-native-gesture-handler';
const wait = (timeout) => {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
}

function InicioPantalla({ navigation }) {

  // Definir los sets 


  const [registroArray, setRegistroArray] = useState([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const [mostrarForm, guardarMostrarForm] = useState(false);
  // const [registroArray, setRegistrosArray] = useState([]);
  const [nombreBoton, setNombreBoton] = useState('Nueva Entrega');
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);

    wait(2000).then(() => setRefreshing(false));
  }, []);

  // TOAST 
  const toastMensajeEliminarRegistro = () => {
    ToastAndroid.show("Eliminado", ToastAndroid.SHORT);
  };


  // Cargar Registros de AsyncStyorage

  useEffect(() => {
    const obtenerData = async () => {
      try {
        const registroStorage = await AsyncStorage.getItem('registroAsync');

        if (registroStorage) {
          setRegistroArray(JSON.parse(registroStorage));
        }
      } catch (e) {
        // saving error
        console.log(e);
      }
    }
    obtenerData();
  }, []);
  //Muestra el formulario
  mostrarFormulario = (textoBoton) => {

    guardarMostrarForm(!mostrarForm);
    if (mostrarForm === false) {
      setNombreBoton("Listar Registros Pendientes");
    } else {
      setNombreBoton('Nueva Entrega');
    }
  }

  // ASYNC STORAGE 

  const guardarStorage = async (registroJson) => {
    try {
      /* Guardar Datos de manera local */
      await AsyncStorage.setItem('registroAsync', registroJson);


    } catch (e) {
      console.log(e);

    }
  }

  const eliminarRegistro = async () => {
    try {
      await AsyncStorage.removeItem('registroAsync');
      setRegistroArray('');
      guardarStorage('');

    } catch (error) {
      console.log(error);
    }
  }

  const eliminarItemRegistro = async (idItem) => {
    try {

      const registroFiltrado = registroArray.filter(registro => registro.id !== idItem);
      setRegistroArray(registroFiltrado);
      guardarStorage(JSON.stringify(registroFiltrado));
      toastMensajeEliminarRegistro();
    }
    catch (error) {
      console.log(error)
    }
  };



  return (


    <View style={{ flex: 1 }}>
      <HeaderCustom eliminarItemRegistro={eliminarItemRegistro}  eliminarRegistro = {eliminarRegistro} registroArray={registroArray}  tituloHeader="Inicio" esInicio={true} /*  navigation={this.props.navigation} */ ></HeaderCustom>
      <View >
        <Button style={{ marginTop: 5, backgroundColor:'#00909e'  }} light onPress={() => mostrarFormulario(nombreBoton)}  ><Text style={{ fontSize: 10 , color:'white'}}>{nombreBoton}</Text><IconFont name="plus" style={{ marginRight: 10 }} color={'white'} size={20}></IconFont></Button>
      </View>
      <ScrollView>

        {mostrarForm ? (
          <Formulario
            guardarMostrarForm={guardarMostrarForm}
            cambiarNombreBoton={setNombreBoton}
            setRegistroArray={setRegistroArray}
            registroArray={registroArray}
            guardarStorage={guardarStorage}
          ></Formulario>
        ) : (

            registroArray.length > 0 ? (
              <FlatList
                data={registroArray}
                keyExtractor={registro => registroArray.id}
                renderItem={({ item }) => (


                  <View style={styles.registroAsyn}>
                    {/* <Card style={{ flex: 0,backgroundColor:'#dae1e7',borderRadius:40 }}> */}
                     <View style={{ backgroundColor:'white',borderRadius:40 }}>
                     <CardItem style={{ backgroundColor:'white',borderRadius:40 }}>
                        <Left>
                          <Icon name="link" />
                          <Body>
                            <Text>{item.selectCasa}</Text>
                            <Text>{item.selectRecinto}</Text>
                            <Text>{item.selectedValue}</Text>
                          </Body>
                        </Left>
                      </CardItem>
                      <CardItem style={{ backgroundColor:'white',borderRadius:40 }}>
                        <Body>
                          {
                            item.fotoUrl.length == 0 ?
                              <Text style={{
                                fontSize: 20
                              }} >No Hay Imagen Elegida</Text> :
                              <Image source={item.fotoUrl} style={{ height: 200,  width: '100%', flex: 1 ,borderRadius:40}} />
                          }
                          {/* <Image source={{ uri: 'Image URL' }} style={{ height: 200, width: 200, flex: 1 }} /> */}
                          <Text style={{ marginTop: 5 }}>{item.observationText}</Text>
                        </Body>
                      </CardItem>
                      <CardItem style={{ backgroundColor:'white',borderRadius:40 }}>
                        <Left>
                          <Button transparent>
                            <IconFeather color={'black'} size={25} name="info"></IconFeather>
                            <Text style={{color:'black'}}>Estado: {item.selectEstado}</Text>
                          </Button>
                        </Left>
                        <Right>
                          <Button transparent>
                            <IconFeather onPress={() => eliminarItemRegistro(item.id)} color={'red'} size={20} name="trash-2"></IconFeather>

                          </Button>
                        </Right>
                      </CardItem>
                     </View>
                    {/* </Card> */}

                  </View>
                )

                }

              />
            ) : (
                <Text style={{ textAlign: 'center', marginTop: 5 }}>No tienes registros pendientes por subir.</Text>
              )

          )}

      </ScrollView>



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
        <IconFeather name="home" size={20} ></IconFeather>
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
        <IconFeather name="search" size={20} ></IconFeather>
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
  // Ajustes: {
  //   screen: AjustesPantalla,
  //   navigationOptions: {
  //     tabBarLabel: 'Ajustes',
  //     tabBarIcon: ({ tintColor }) => (
  //       <IconFont name="cog" size={30} ></IconFont>
  //     ), tabBarOptions: {
  //       activeTintColor: 'black',
  //       labelStyle: {
  //         fontSize: 13,

  //       },
  //       style: {
  //         backgroundColor: 'white',
  //         color: 'white',

  //       },
  //     }
  //   }
  // },
});

const styles = StyleSheet.create({
  registroAsyn: {
    backgroundColor: '#fff',
    marginBottom: 5,
    borderBottomColor: '#e1e1e1',
    borderBottomWidth: 1,
    paddingVertical: 20,
    paddingRight: 10,
    paddingLeft: 10,
    marginTop: 10,
    borderRadius:30,
    backgroundColor:'#dae1e7'
  },
  label: {
    fontWeight: 'bold',
  },
  fotografia: {
    borderColor: 'black',
    borderWidth: 1,
    width: 300,
    height: 200,
    marginLeft: 30,
    marginTop: 10
  },
})
export default createAppContainer(TabNavigator);
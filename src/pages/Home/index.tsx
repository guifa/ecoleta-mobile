import React, { ChangeEvent, useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native'
import { Feather as Icon } from '@expo/vector-icons';
import { View, Image, StyleSheet, Text, ImageBackground } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import RNPickerSelect from 'react-native-picker-select';
 
interface IbgeUf {
  sigla: string
}

interface IbgeCity {
  nome: string
}

const Home = () => {
    const navigation = useNavigation();

    const [ufs, setUfs] = useState<string[]>([]);
    const [cities, setCities] = useState<string[]>([]);
    const [selectedUf, setSelectedUf] = useState('0');
    const [selectedCity, setSelectedCity] = useState('0');

    function handleNavigationToPoints() {
        navigation.navigate('Points', {
          selectedUf,
          selectedCity
        });
    }

    useEffect(() => {
      axios.get<IbgeUf[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => {
          const ufsInitials = response.data.map(uf => uf.sigla);
          
          setUfs(ufsInitials);
      })
  }, []);
  
  useEffect(() => {
      if (selectedUf === '0') {
          return;
      }
      axios.get<IbgeCity[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`).then(response => {
          const cities = response.data.map(city => city.nome);
          
          setCities(cities);
      })
  }, [selectedUf]);

  function handleSelectUf(event: string) {
      const uf = event;

      setSelectedUf(uf);
  }
  
  function handleSelectCity(event: string) {
      const city = event;

      setSelectedCity(city);
  }

    return (
        <ImageBackground source={require('../../assets/home-background.png')} style={styles.container}
            imageStyle={{ width: 274, height: 368 }}>
            <View style={styles.main}>
                <Image source={require('../../assets/logo.png')}></Image>
                <Text style={styles.title}>Seu marketplace de coleta de resíduos.</Text>
                <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</Text>
            </View>

            <View style={styles.footer}>
              <RNPickerSelect onValueChange={handleSelectUf} value={selectedUf}
                placeholder={{ label: 'Selecione uma UF', value: 0 }}
                items={ufs.map(uf => (
                  { label: uf, value: uf }
                ))}/>
              <RNPickerSelect onValueChange={handleSelectCity} value={selectedCity}
                placeholder={{ label: 'Selecione uma Cidade', value: 0 }}
                items={cities.map(city => (
                  { label: city, value: city }
                ))}/>
              <RectButton style={styles.button} onPress={handleNavigationToPoints}>
                  <View style={styles.buttonIcon}>
                  <Text>
                      <Icon name="arrow-right" color="#FFF" size={24}></Icon>
                  </Text>
                  </View>
                  <Text style={styles.buttonText}>Entrar</Text>
              </RectButton>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 32
    },
  
    main: {
      flex: 1,
      justifyContent: 'center',
    },
  
    title: {
      color: '#322153',
      fontSize: 32,
      fontFamily: 'Ubuntu_700Bold',
      maxWidth: 260,
      marginTop: 64,
    },
  
    description: {
      color: '#6C6C80',
      fontSize: 16,
      marginTop: 16,
      fontFamily: 'Roboto_400Regular',
      maxWidth: 260,
      lineHeight: 24,
    },
  
    footer: {},
  
    select: {},
  
    input: {
      height: 60,
      backgroundColor: '#FFF',
      borderRadius: 10,
      marginBottom: 8,
      paddingHorizontal: 24,
      fontSize: 16,
    },
  
    button: {
      backgroundColor: '#34CB79',
      height: 60,
      flexDirection: 'row',
      borderRadius: 10,
      overflow: 'hidden',
      alignItems: 'center',
      marginTop: 8,
    },
  
    buttonIcon: {
      height: 60,
      width: 60,
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      justifyContent: 'center',
      alignItems: 'center'
    },
  
    buttonText: {
      flex: 1,
      justifyContent: 'center',
      textAlign: 'center',
      color: '#FFF',
      fontFamily: 'Roboto_500Medium',
      fontSize: 16,
    }
  });

export default Home;
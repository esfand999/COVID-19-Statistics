import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ImageBackground,
  StatusBar
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { EvilIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';

import { PieChart } from 'react-native-svg-charts';
import { Circle, G, Line } from 'react-native-svg';


const background = {
  uri:
    'https://www.constructionexec.com/assets/site_18/images/article/050620030611.jpg?width=1280',
};

const HomeScreen = () => {
  const [covid, setCovid] = useState([]);
  const [population, setPopulation] = useState([]);

  useEffect(() => {
    fetch('https://covid-19-data.p.rapidapi.com/totals', {
      method: 'GET',
      headers: {
        'x-rapidapi-key': '01e1e2412cmsh1a99abc653070bfp1637abjsnf8d81400dcb8',
        'x-rapidapi-host': 'covid-19-data.p.rapidapi.com',
      },
    })
      .then((response) => response.json())
      .then((json) => setCovid(json[0]))
      .catch((err) => {
        console.error(err);
      });
  }, []);

  useEffect(() => {
    fetch('https://world-population.p.rapidapi.com/worldpopulation', {
      method: 'GET',
      headers: {
        'x-rapidapi-key': '01e1e2412cmsh1a99abc653070bfp1637abjsnf8d81400dcb8',
        'x-rapidapi-host': 'world-population.p.rapidapi.com',
      },
    })
      .then((response) => response.json())
      .then((json) => setPopulation(json.body))
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const data = [population.world_population, covid.confirmed];
  const data2 = [covid.recovered, covid.critical, covid.deaths];


  const colors = [ 'white', '#64aaa4']
  const colors2 = [ '#bc5090', '#ffa600', 'steelblue']


  const pieData = data
    .filter((value) => value > 0)
    .map((value, index) => ({
      value,
      svg: {
        fill: colors[index],
        onPress: () => console.log('press', index),
      },
      key: `pie-${index}`,
    }));

  const pieData2 = data2
    .filter((value) => value > 0)
    .map((value, index) => ({
      value,
      svg: {
        fill: colors2[index],
        onPress: () => console.log('press', index),
      },
      key: `pie-${index}`,
    }));

  const Labels = ({ slices }) => {
    return slices.map((slice, index) => {
      const { labelCentroid, pieCentroid, data } = slice;
      return (
        <G key={index}>
          <Line
            x1={labelCentroid[0]}
            y1={labelCentroid[1]}
            x2={pieCentroid[0]}
            y2={pieCentroid[1]}
            stroke={data.svg.fill}
          />
          <Circle
            cx={labelCentroid[0]}
            cy={labelCentroid[1]}
            r={15}
            fill={data.svg.fill}
          />
        </G>
      );
    });
  };


  return (
    <View style={{ flex: 1 }}>
    <StatusBar barStyle="light-content"/>
      <ImageBackground source={background} style={styles.background}>
        <Text style={styles.title}>COVID 19 | Statistics</Text>

        <View style={styles.view}>
          <View style={styles.contentContainer}>
            <Text style={styles.text}>
              <Ionicons name="ios-earth-outline" size={12} color="white" />{' '}
              World Population: {population.world_population}
            </Text>

            <Text style={styles.text}>
              <FontAwesome5 name="briefcase-medical" size={12} color="white" />{' '}
              Confirmed Cases: {covid.confirmed}
            </Text>

            <Text style={styles.text}>
              <AntDesign name="areachart" size={12} color="white" /> Affected
              Population:{' '}
              {((covid.confirmed / population.world_population) * 100).toFixed(
                2
              )}
              %
            </Text>

            <PieChart
              style={{ height: 200 }}
              data={pieData}
              innerRadius={20}
              outerRadius={55}
              labelRadius={80}>
              <Labels />
            </PieChart>

            <Text style={styles.text}>
              <EvilIcons name="refresh" size={18} color="white" /> Recovered:{' '}
              {((covid.recovered / covid.confirmed) * 100).toFixed(2)}% (
              {covid.recovered})
            </Text>

            <Text style={styles.text}>
              <Ionicons name="ios-warning" size={12} color="white" /> Critical
              Cases: {((covid.critical / covid.confirmed) * 100).toFixed(2)}% (
              {covid.critical})
            </Text>

            <Text style={styles.text}>
              <Ionicons name="skull-outline" size={12} color="white" /> Deaths:{' '}
              {((covid.deaths / covid.confirmed) * 100).toFixed(2)}% (
              {covid.deaths})
            </Text>

            <PieChart
              style={{ height: 200 }}
              data={pieData2}
              innerRadius={20}
              outerRadius={55}
              labelRadius={80}>
              <Labels />
            </PieChart>
          </View>

          <View>
            <Text style={styles.text}>Last Updated: {covid.lastUpdate}</Text>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 25,
    marginBottom: 20,
    fontWeight: 'bold',
    color: '#d4af37',
    justifyContent: 'center',
    textAlign: 'center',
    textShadowColor: 'black',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
    marginTop: 30,
  },
  view: {
    backgroundColor: 'rgba(52, 52, 52, 0.8)',
    borderColor: '#d4af37',
    borderWidth: 2,
    width: '85%',
    height: '60%',
    paddingVertical: 10,
    flex: 1,
    marginBottom: 30,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    padding: 5,
    marginRight: 10,
    color: 'white',
    textAlign: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    flex: 1,
  },
};

export default HomeScreen;
               
      
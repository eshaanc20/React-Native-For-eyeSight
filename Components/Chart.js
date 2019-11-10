import React from 'react';
import { Text, View, TouchableOpacity, Dimensions, Image, Modal, ActivityIndicator, shadowColor } from 'react-native';
import PieChart from 'react-native-pie'

const Chart = (props) => {
  return(
    <View>
      <PieChart
        radius={80}
        series={props.pieChart}
        colors={props.colors}
      />
    </View>
  )
}

export default Chart;
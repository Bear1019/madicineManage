import React, { Component } from 'react'
import {Card} from 'antd'
import ReactEcharts from 'echarts-for-react'
import {reqCovid_19} from '../../api'
import {reqGps} from '../../api';

export default class Pie extends Component {
  state = {
    cityData: [],
    cityName: ''
  } 
  getGps = async() => {
    await reqGps().then(async res => {
      const result= await reqCovid_19()
      const pData = result.data.list.filter(it => it.name.slice(0,2) === res.province.slice(0,2))
      const cityData = pData[0].city.filter(it => it.name.slice(0,2) === res.city.slice(0,2))
      this.pieData(cityData)
     
    })
  }

 pieData = (cityData) => {
  const {conNum, cureNum, deathNum, econNum, zerodays, mapName} = cityData[0]
  this.setState({
    cityData:[
      {value: conNum, name: '累计确诊'},
      {value: cureNum, name: '累计治愈'},
      {value: deathNum, name: '累计死亡'},
      {value: econNum, name: '现存确诊'},
      {value: zerodays, name: '多少天内0新增'}
    ],
    cityName:mapName 
  })
 }

 componentDidMount = () => {
    this.getGps()
  }


getCustomizeOption = () => {
  return {
    backgroundColor: '#2c343c',

    title: {
        text: '疫情实时大数据报告',
        left: 'center',
        top: 20,
        textStyle: {
            color: '#ccc'
        }
    },

    tooltip: {
        trigger: 'item'
    },

    visualMap: {
        show: false,
        min: 80,
        max: 600,
        inRange: {
            colorLightness: [0, 1]
        }
    },
    series: [
        {
            name: '访问来源',
            type: 'pie',
            radius: '55%',
            center: ['50%', '50%'],
            data: this.state.cityData.sort(function (a, b) { return a.value - b.value; }),
            roseType: 'radius',
            label: {
                color: 'rgba(16,192,219, 0.3)'
            },
            labelLine: {
                lineStyle: {
                    color: 'rgba(25, 255, 255, 0.3)'
                },
                smooth: 0.2,
                length: 10,
                length2: 20
            },
            itemStyle: {
                // color: '#10AEB7',
                color: (params) => {
                  const colorList = ['#E87C25','#E83132','#E83132','#E83132','#10AEB7']
                  return colorList[params.dataIndex]
                },
                shadowBlur: 200,
                shadowColor: 'rgba(0,0,0 0.5)'
            },
            animationType: 'scale',
            animationEasing: 'elasticOut',
            animationDelay: function (idx) {
                return Math.random() * 200;
            }
        }
    ]
  }
}


  render() {
    const {cityName} = this.state
    return (
      <>
      <Card title={cityName + '疫情图'} style={{textAlign: 'center', color: 'cadetblue'}}>
      <ReactEcharts style={{ height: "800px" }} option={this.getCustomizeOption()}/>
      </Card>
    </>
    )
  }
}

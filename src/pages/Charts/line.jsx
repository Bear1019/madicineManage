import React, { Component } from 'react';
import ReactEcharts from 'echarts-for-react';
import jsonp from "jsonp" // 接口jsonp实现跨域
import 'echarts/map/js/world';
import jsonData from '../../api/world.json';


export default class Line extends Component {

  state = {
    mapData: [],
    nameMap:{}
  }
  getOption = () => {
    return {
      title: {
        text: "世界疫情地图",
        x: "center",
        textStyle: {
          color: "#9fb5ea"
        }
      },
      tooltip: { // 提示框
        trigger: "item",
        formatter: "省份: {b} <br/> 累计确诊：{c}" // a 系列名称 b 区域名称 c 合并数值
      },
      series: [
        {
          type: 'map',
          map: "world",
          mapType: 'world',
          nameMap:this.state.nameMap,
          data: this.state.mapData,
          label: {
            show: false,
            color: "black",
            fontStyle: 10,
            align: "center"
          },
          zoom: 1, // 当前缩放比例
          roam: true, // 是否支持拖拽
          itemStyle: {
            borderColor: "blue", // 区域边框线
          },
          emphasis: { // 高亮显示
            label: {
              color: "black",
              fontSize: 10
            },
            itemStyle: {
              areaColor: "lightyellow" // 区域高亮颜色
            }
          }
        },
      ],
       // 视觉映射组件
       visualMap: {
        type: 'continuous', // continuous 类型为连续型  piecewise 类型为分段型
        show: true, // 是否显示 visualMap-continuous 组件 如果设置为 false，不会显示，但是数据映射的功能还存在
        // 指定 visualMapContinuous 组件的允许的最小/大值。'min'/'max' 必须用户指定。
        // [visualMap.min, visualMax.max] 形成了视觉映射的『定义域』
        min: 0,
        max: 1000000,
        // 文本样式
        textStyle: {
          fontSize: 14,
          color: '#fff'
        },
        realtime: false, // 拖拽时，是否实时更新
        calculable: true, // 是否显示拖拽用的手柄
        // 定义 在选中范围中 的视觉元素
        inRange: {
          color: ['#9fb5ea', '#e6ac53', '#74e2ca', '#85daef', '#9feaa5', '#5475f5'] // 图元的颜色
        }
      },
    }
  }
  getDate = () => {
    let self = this;
    jsonp("https://interface.sina.cn/news/wap/fymap2020_data.d.json?_=1580892522427", (err, data) => {
      var lists = data.data.worldlist.map(item => {
        return {
          name: item.name,
          value: item.value
        }
      })
      
     let nameMap = jsonData.namemap

      self.setState({
        mapData: lists,
        nameMap
      })
    })
  }
  componentDidMount() {
    this.getDate()
  }

  render() {
    return (
      <div style={{padding:30, backgroundImage:"url('./styles/bg.png')"}}>
      <ReactEcharts option={this.getOption()} style={{height: 800}}></ReactEcharts> 
    </div>
    );
  }
}


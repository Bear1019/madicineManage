import React, { Component } from 'react'
import { Chart, Geom, Axis, Tooltip, Coord } from 'bizcharts'
import numeral from 'numeral'
import './index.less'
// import { assembleFont } from '@antv/g-base';
// import instance from '../../api/axios';
// import global from '../../api/global';

export default class Home extends Component {

  // yq = async () => {
  //   const res = await instance.get(global.yq)
  //   console.log(res)
  // }
componentDidMount = () => {
  // this.covid_19()
  // this.yq()
}
  render() {
  
    const data = [
      {
        college: '计算机信息工程学院',
        count: 0.2,
      },
      {
        collage: '外国语学院',
        count: 0.08,
      },
      {
        collage: '电子与信息工程学院',
        count: 0.13,
      },
      {
        collage: '建筑工程学院',
        count: 0.12,
      },
      {
        collage: '工商管理学院',
        count: 0.08,
      },
      {
        collage: '财经学院',
        count: 0.09,
      },
      {
        collage: '国际交流学院',
        count: 0.02,
      },
      {
        collage: '高级护理学院',
        count: 0.09,
      },
      {
        collage: '人文学院',
        count: 0.03,
      },
      {
        collage: '航天航空学院',
        count: 0.06,
      },
      {
        collage: '体育学院',
        count: 0.04,
      },
      {
        collage: '传媒学院',
        count: 0.05,
      },
      {
        collage: '政法学院',
        count: 0.05,
      },
      {
        collage: '美术与设计学院',
        count: 0.04,
      },
      {
        collage: '新能源与环境工程学院',
        count: 0.11,
      },
    ]

    const cols = {}

    return (
      <>
        <Chart
        height={800}
        data={data}
        scale={cols}
        padding="auto"
        autoFit
      >
        <Coord transpose />
        <Axis name="collage" />
        <Axis name="count" visible={false} />
        <Tooltip />
        {/* 凸显类型 color={['collage', '#E6F6C8-#3376CB']} */}
        <Geom
          type="interval"
          position="collage*count"
          color={['count', '#E6F6C8-#3376CB']}
          label={['collage*count', (name, value) => numeral(value || 0).format('0.0%')]}
        >
        </Geom>
      </Chart>
      </>
    )
  }
}

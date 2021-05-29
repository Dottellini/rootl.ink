<template>
  <div class="chartWrapper" :style="`max-width:${chartWidth}`">
    <!--<div class="controlPanel" :style="`width:${chartWidth}`">
      <div class="controlPanelItem" @mouseenter="dropdownShown = 'Link ID'" @mouseleave="dropdownShown = ''">
        <p class="controlPanelText">Link ID</p>
        <svg style="margin: auto" width="10" height="18" fill="none" viewBox="0 0 10 18" :class="{rotated: dropdownShown === 'Link ID'}">
          <path stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M1 1l8 8-8 8"></path>
        </svg>
      </div>
      <div class="controlPanelItem" @mouseenter="dropdownShown = 'Timeframe'" @mouseleave="dropdownShown = ''">
        <p class="controlPanelText">Timeframe</p>
        <svg style="margin: auto" width="10" height="18" fill="none" viewBox="0 0 10 18" :class="{rotated: dropdownShown === 'Timeframe'}">
          <path stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M1 1l8 8-8 8"></path>
        </svg>
      </div>
    </div>-->
    <svg :width="chartWidth" :height="chartHeight" >
      <svg :width="chartWidth" :height="chartHeight" class="svgWrapper" >
      </svg>
      <svg id="tooltip" width="73px" height="73px" :class="{svgHidden: tooltipHidden}" pointer-events="none">
        <path id="tooltipPath" d="m 6 0 h 60 a 6 6 90 0 1 6 6 v 60 a 6 6 90 0 1 -6 6 h -60 a 6 6 90 0 1 -6 -6 v -60 a 6 6 90 0 1 6 -6 z"></path>
        <text x="50%" y ="60%" id="tooltipX">X</text>
        <text x="50%" y ="60%" id="tooltipY">Y</text>
      </svg>
    </svg>
  </div>
</template>

<script>
import * as d3 from "d3";

export default {
  name: "D3Bar",
  props:['data', 'chartWidth', 'chartHeight', 'title'],
  data(){
    return{
      Data:undefined,
      xScale: undefined,
      yScale: undefined,
      xAxis: undefined,
      yAxis: undefined,
      tooltipHidden: true,
      dropdownShown: ''
    }
  },
  mounted() {
    //Load Props
    this.Data = this.$props.data
    let yMax=0;
    for (const [key, value] of Object.entries(this.Data)) {
      yMax = Math.max(value.y, yMax)
    }
    let vueInstance = this
    let labelHeight = 60;

    //D3 Stuff
    //Container
    const container = d3.select('.svgWrapper').classed('container', true);

    //Scales
    this.xScale = d3
      .scaleBand()
      .domain(this.Data.map((dataPoint) => dataPoint.x))
      .rangeRound([0, parseInt(this.$props.chartWidth.replace('px',''))])
      .padding(0.1);
    this.yScale = d3
      .scaleLinear()
      .domain([0, yMax])
      .range([parseInt(this.$props.chartHeight.replace('px',''))-labelHeight, 0]);


    //Bars
    container
      .selectAll('.bar')
      .data(this.Data)
      .enter()
      .append('rect')
      .on("mouseover", function(){
        d3.select(this)
            .style("fill", "orange")
        let x = parseInt(this.getAttributeNS(null, 'x'))+parseInt(vueInstance.xScale.bandwidth())/2-36.5;
        let y = parseInt(this.getAttributeNS(null, 'y'))+ parseInt(this.getAttributeNS(null, 'height')/2)-36.5
        document.getElementById('tooltip').setAttribute('x', x);
        document.getElementById('tooltip').setAttribute('y', y);
        document.getElementById('tooltipX').textContent='ID: '+this.__data__.x;
        document.getElementById('tooltipY').textContent='Y: '+this.__data__.y;
        vueInstance.tooltipHidden = false;

      })
      .on("mouseout", function(){
        d3.select(this)
            .style("fill", "steelblue")

        vueInstance.tooltipHidden = true;

      })
      .classed('bar', true)
      .attr('width', this.xScale.bandwidth())
      .attr('y', parseInt(this.$props.chartHeight.replace('px','')-labelHeight))
      .attr('x', data => this.xScale(data.x))
      .transition()
      .duration(500)
      .attr('height', (data) => parseInt(this.$props.chartHeight.replace('px',''))-labelHeight - this.yScale(data.y))
      .attr('y', data => this.yScale(data.y))



    //Axis Text
    this.xAxis = container
      .selectAll('text.xAxisLabel')
      .data(this.data.map(data=>data.x))
      .enter()
      .append('text')
      .classed('xAxisLabel', true)
      .text(data=>data)
      .attr('x', data => this.xScale(data)+this.xScale.bandwidth()/2+40)
      .attr('y', parseInt(this.$props.chartHeight.replace('px',''))-25.7)
      .attr('transform', data => `rotate(-50,${this.xScale(data)+this.xScale.bandwidth()/2},${parseInt(this.$props.chartHeight.replace('px',''))})`)

    let gridY = []
    let lines =Math.round(yMax/10)
    for(let i=Math.round(yMax/lines)*lines-lines;i>0; i-=lines){
      gridY.push(i)
    }
    gridY = gridY.reverse()

    this.yAxis = container
      .selectAll('text.yAxisLabel')
      .data(gridY)
      .enter()
      .append('text')
      .classed('yAxisLabel', true)
      .text(data=>data)
      .attr('x', 0)
      .attr('y', data=>this.$props.chartHeight.replace('px','')-labelHeight-(data/(yMax))*(this.$props.chartHeight.replace('px','')-labelHeight))

    //Grid Lines
    container
      .selectAll('line.yAxisGrid')
      .data(gridY)
      .enter()
      .append('line')
      .classed('yAxisGrid', true)

      .attr('x1', 0)
      .attr('y1', data=>this.$props.chartHeight.replace('px','')-labelHeight-(data/(yMax))*(this.$props.chartHeight.replace('px','')-labelHeight))
      .attr('x2', this.$props.chartWidth)
      .attr('y2', data=>(this.$props.chartHeight.replace('px','')-labelHeight)-(data/(yMax))*(this.$props.chartHeight.replace('px','')-labelHeight))

    //Title
    container
      .selectAll('text.title')
      .data([this.$props.title])
      .enter()
      .append('text')
      .classed('title', true)
      .text(data=>data)
      .attr('font-family','Montserrat, sans-serif')
      .attr('font-size','3em')
      .attr('x',this.$props.chartWidth.replace('px','')/2)
      .attr('y',50)
      .attr('text-anchor', 'middle')


    //Controls
    //Link IDs


  }
}
</script>

<style> /*Scoped funktioniert mit d3 nicht*/

svg.rotated{
  transform: rotate(90deg);
}

.controlPanelItem{
  margin: 0 10px 0 10px;
  line-height: 30px;
  font-family: Montserrat, sans-serif;
  max-width: 150px;
  display:flex;
  flex-direction: row;
  justify-content: space-around;
  align-content: center;
  padding: 0 10px 0 10px;
}

.controlPanelItem:hover{
  background-color: #d6d6d6;
  vertical-align: center;
}

.controlPanel:hover ~ .svgArrow{
  transform: rotate(90deg);
}

.chartWrapper{
  margin:auto;
  display: flex;
  flex-direction: column;
  align-content: center;
  }

p.controlPanelText{
  margin: 0 10px 0 0;
}

.controlPanel{
  background-color: #f6f6f6;
  /*box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.2);*/
  height: 30px;
  align-self: center;
  display: flex;
  flex-direction: row;
}

#tooltip{
  text-anchor: middle;
  fill: #183949;
}

#tooltipSeries, #tooltipY{
  stroke: #ffffff;
  fill: #ffffff;
  font-family: Montserrat, sans-serif;
  font-size: 0.7em;
}

.yAxisLabel{
  font-family: Montserrat, sans-serif;
}

.xAxisLabel{
  text-anchor: end;
  dominant-baseline: text-top;
  font-family: Montserrat, sans-serif;
  font-size: 0.85em;
}

.svgHidden{
  display: none;
  transform: rotate(90deg);
}

.yAxisGrid{
  stroke-opacity: 1;
  stroke: #bbb;
}

.bar{
  stroke: #0c587f;
  fill: #46a2d4;
  fill-opacity: 0.2;
}

</style>
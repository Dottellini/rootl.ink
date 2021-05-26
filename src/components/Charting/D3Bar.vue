<template>
  <div class="chartWrapper">
    <svg :width="chartWidth" :height="chartHeight"/>
  </div>

</template>

<script>
import * as d3 from "d3";

export default {
  name: "D3Bar",
  props:['data', 'chartWidth', 'chartHeight'],
  data(){
    return{
      Data:undefined,
      xScale: undefined,
      yScale: undefined,
      xAxis: undefined,
      yAxis: undefined
    }
  },
  mounted() {
    this.Data = this.$props.data

    this.xScale = d3
        .scaleBand()
        .domain(this.Data.map((dataPoint) => dataPoint.id))
        .rangeRound([0, parseInt(this.$props.chartWidth.replace('px',''))])
        .padding(0.1);

    let yMin = 0;
    let yMax= 50;

    this.yScale = d3.scaleLinear().domain([yMin, yMax]).range([parseInt(this.$props.chartHeight.replace('px',''))-20, 0]);

    const container = d3.select('svg').classed('container', true);

    const bars = container
        .selectAll('.bar')
        .data(this.Data)
        .enter()
        .append('rect')
        .on("mouseover", function(){
          d3.select(this)
              .style("fill", "orange");
        })
        .on("mouseout", function(){
          d3.select(this)
              .style("fill", "steelblue")
        })
        .classed('bar', true)
        .attr('width', this.xScale.bandwidth())
        .attr('height', (data) => parseInt(this.$props.chartHeight.replace('px',''))-20 - this.yScale(data.value))
        .attr('x', data => this.xScale(data.id))
        .attr('y', data => this.yScale(data.value));

    this.xAxis = container
        .selectAll('text.xAxisLabel')
        .data(this.data.map(data=>data.id))
        .enter()
        .append('text')
        .classed('xAxisLabel', true)
        .text(data=>data)
        .attr('text-anchor','middle')
        .attr('font-family','Montserrat, sans-serif')
        .attr('x', data => this.xScale(data)+this.xScale.bandwidth()/2)
        .attr('y', parseInt(this.$props.chartHeight.replace('px','')));

    let gridValues = []
    let lines =10

    for(let i=Math.round(yMax/lines)*lines-lines;i>0; i-=lines){
      gridValues.push(i)
      console.log(gridValues)
    }

    gridValues = gridValues.reverse()
    console.log(gridValues)

    this.yAxis = container
        .selectAll('text.yAxisLabel')
        .data(gridValues)
        .enter()
        .append('text')
        .classed('yAxisLabel', true)
        .text(data=>data)
        .attr('font-family','Montserrat, sans-serif')
        .attr('x', 0)
        .attr('y', data=>this.$props.chartHeight.replace('px','')-20-(data/(yMax))*(this.$props.chartHeight.replace('px','')-20))

    container
        .selectAll('line.yAxisGrid')
        .data(gridValues)
        .enter()
        .append('line')
        .classed('yAxisGrid', true)
        .attr('stroke-opacity', 1)
        .attr('stroke', '#bbb')
        .attr('x1', 0)
        .attr('y1', data=>this.$props.chartHeight.replace('px','')-20-(data/(yMax))*(this.$props.chartHeight.replace('px','')-20))
        .attr('x2', this.$props.chartWidth)
        .attr('y2', data=>(this.$props.chartHeight.replace('px','')-20)-(data/(yMax))*(this.$props.chartHeight.replace('px','')-20))

    container
        .selectAll('text.title')
        .data(['Title'])
        .enter()
        .append('text')
        .classed('title', true)
        .text(data=>data)
        .attr('font-family','Montserrat, sans-serif')
        .attr('font-size','3em')
        .attr('x',this.$props.chartWidth.replace('px','')/2)
        .attr('y',50)
        .attr('text-anchor', 'middle')

  }
}
</script>

<style> /*Scoped funktioniert mit d3 nicht*/

  .chartWrapper{
    margin: 50px;
    border: 1px solid purple;
  }

  .bar{
    stroke: #0c587f;
    fill: #46a2d4;
    fill-opacity: 0.2;
  }


</style>
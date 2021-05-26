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
    this.yScale = d3.scaleLinear().domain([0, 15]).range([parseInt(this.$props.chartHeight.replace('px',''))-20, 0]);
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


    console.log(this.data.map(data=>data.id))
    this.xAxis = container
        .selectAll('text')
        .data(this.data.map(data=>data.id))
        .enter()
        .append('text')
        .classed('xAxisLabel', true)
        .text(data=>data)
        .attr('height', 10)
        .attr('width', 10)
        .attr('x', data => this.xScale(data))
        .attr('y', parseInt(this.$props.chartHeight.replace('px','')));

  }
}
</script>

<style scoped>

  .chartWrapper{
    margin: 50px;
    border: 1px solid purple;
  }


</style>
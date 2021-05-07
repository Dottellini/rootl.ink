<template>
  <div>
    Raw Data: {{JSON.stringify(Analytics)}}<br>
    ID<select name="ID" size="5" id="ID" @change="convertData(Analytics)" >
      <option :value="linkID" v-for="linkID in linkIDs" :key="linkID">{{linkID}}</option>
    </select>
    Timeframe<select name="timeframe" size="5" id="timeframe" @change="convertData(Analytics)">
      <option value="Daily">Daily</option>
      <option value="Monthly">Monthly</option>
      <option value="Yearly">Yearly</option>
    </select>
    <!--<Chart v-if="loaded" :chartOptions="chartOptions" :series="series" />-->
    <BetterChart/>
  </div>
</template>

<script>
import Chart from "./Chart.vue"
import BetterChart from "./BetterChart";

export default {
    name: "Analytics",
    components:{BetterChart, Chart},
    data(){
      return {
        loaded: false,
        CchartOptions: undefined,
        Cseries: undefined,
        linkIDs: []
      }
    },
    mounted: function() {
      
    },
    computed:{
      chartOptions: function(){
        return this.CchartOptions
      },
      series: function(){
        return this.Cseries
      },
      linkIDs: function(){

      }
    },
    created(){
      fetch(`/api/analytics/get/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: "cors"
      }).then(response => response.json())
        .then(data => {
          console.log("HÄÄÄ", data)
          this.Analytics = data          
        });

      fetch("https://d26k63xuikc78y.cloudfront.net/timm.json", {
        'mode': "cors"
      })
      .then(data =>data.json())
      .then(data => {
        console.log(data)
        console.log(data.url_list)
        let linkIds = []
        data.url_list.forEach(element => {
          linkIds.push(element.id)
        });
        this.linkIDs = linkIds
      })
    },
    methods:{
      sortParallel: function(primaryList,secondaryList){
        for (let i = 0; i < primaryList.length; i++) {
          if (primaryList[i] > primaryList[i + 1]) {
            const a = primaryList[i]
            primaryList[i] = primaryList[i + 1]
            primaryList[i + 1] = a

            const b = secondaryList[i]
            secondaryList[i] = secondaryList[i + 1]
            secondaryList[i + 1] = b
          }
        }
        return [primaryList, secondaryList]
      },
      convertData: function(data){
        let timeframeRegex
        let timeframe = document.getElementById('timeframe').value
        switch(timeframe){
          case 'Daily':
            timeframeRegex = RegExp('^.{4}-.{1,2}.{1,2}$')
            break;
          case 'Monthly':
            timeframeRegex = RegExp('^.{4}-.{1,2}$')
            break;
          case 'Yearly':
            timeframeRegex = RegExp('^.{4}$')
            break;
        }
        let id = document.getElementById("ID").value
        let xAxis = []
        let yAxis = []
        Object.keys(data.Item).forEach((k)=>{
          if(k.match(timeframeRegex)){
            if(data.Item[k].M[id]){
              xAxis.push(k)
              yAxis.push(data.Item[k].M[id].N)
            }
          }
        })

        console.log(this.sortParallel(xAxis.map(x=>Date.parse(x)),yAxis));

        [xAxis,yAxis] = this.sortParallel(xAxis.map(x=>Date.parse(x)),yAxis);

        console.log(xAxis,yAxis);

        xAxis = xAxis.map(x=>{
          console.log("XXX",new Date(x).getTime())
          x = new Date(x)
          x = x.toISOString()
          x = x.slice(0,10)
          if(timeframe === 'Yearly'){
            return x.split('-')[0]
          }
          if(timeframe === 'Monthly'){
            console.log(x,x.split('-'))
            return x.split('-')[0]+'-'+x.split('-')[1]
          }
          return x
        });

        console.log(xAxis,yAxis);

        this.CchartOptions={
          title: {text: "LinkClicks"},
          chart: {
            id: 'LickClicks-Chart'
          },
          xaxis: {
            categories: xAxis//[1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998]
          }
        }
        this.Cseries=[{
          name: 'Link1',
          data: yAxis//[30, 40, 45, 50, 49, 60, 70, 91]
        }]
        this.loaded = false
        this.loaded = true
      }
    }
  }
</script>

<style scoped>

</style>
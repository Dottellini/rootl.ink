<template>
  <div>
    <UltimateChart v-if="LinkClicksData!==undefined" :yAxis="LinkClicksData.yAxis" :xAxis="LinkClicksData.xAxis" title="LinkClicks"/>
    <br>
    <UltimateChart v-if="BrowsersData!==undefined" :yAxis="BrowsersData.yAxis" :xAxis="BrowsersData.xAxis" title="Browsers"/>
    <br>
    <UltimateChart v-if="OSData!==undefined" :yAxis="OSData.yAxis" :xAxis="OSData.xAxis" title="Operating Systems"/>
  </div>
</template>

<script>
import Chart from "./Chart.vue"
import UltimateChart from "./UltimateChart";

export default {
    name: "Analytics",
    components:{UltimateChart, Chart},
    data(){
      return {
        CchartOptions: undefined,
        Cseries: undefined,
        linkIDs: [],
        LinkClicksData: undefined,
        BrowsersData: undefined,
        OSData: undefined
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
      }
    },
    created(){
      fetch("https://d26k63xuikc78y.cloudfront.net/timm.json", {
        'mode': "cors"
      })
      .then(data =>data.json())
      .then(data => {
        let linkIds = []
        data.url_list.forEach(element => {
          linkIds.push(element.id)
        });
        this.linkIDs = linkIds
        fetch(`/api/analytics/get/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          mode: "cors"
        }).then(response => response.json())
            .then(data => {
              this.LinkClicksData = this.convertLinkClicksData(data, this.linkIDs[0])
              this.BrowsersData = this.convertBrowsersData(data)
              this.OSData = this.convertOSData(data)
            });
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
      convertLinkClicksData: function(data, linkID){
        let timeframeRegex
        let timeframe =  "Daily" //document.getElementById('timeframe').value
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
        let id = linkID //document.getElementById("ID").value
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
        xAxis = xAxis.map(x=>{
          x = new Date(x)
          x = x.toISOString()
          x = x.slice(0,10)
          if(timeframe === 'Yearly'){
            return x.split('-')[0]
          }
          if(timeframe === 'Monthly'){
            return x.split('-')[0]+'-'+x.split('-')[1]
          }
          return x
        });

        return {
          "yAxis": yAxis,
          "xAxis": xAxis,
        }
      },
      convertBrowsersData: function (data){
        let xAxis = []
        let yAxis = []
        Object.keys(data.Item.browsers.M).forEach((k)=>{
          xAxis.push(k)
          yAxis.push(data.Item.browsers.M[k].N)
        })
        return {
          "yAxis": yAxis,
          "xAxis": xAxis
        }
      },
      convertOSData: function (data) {
        let xAxis = []
        let yAxis = []
        Object.keys(data.Item.operatingSystems.M).forEach((k)=>{
          xAxis.push(k)
          yAxis.push(data.Item.operatingSystems.M[k].N)
        })
        return {
          "yAxis": yAxis,
          "xAxis": xAxis
        }

      }
    }
  }
</script>

<style scoped>

</style>
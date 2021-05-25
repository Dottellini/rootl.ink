<template>
  <div class="wrapper">
    <div class="bigChart">
      <Chart v-if="LinkClicksData.length!==0" :xAxis="LinkClicksData[0].xAxis" :yAxis="LinkClicksData[0].yAxis" chartWidth="800px" chartHeight="300px"/>
    </div>
    <div class="chartGrid">
      <div class="GridItem">
        <Chart v-if="LinkClicksData.length!==0" :xAxis="LinkClicksData[0].xAxis" :yAxis="LinkClicksData[0].yAxis" chartWidth="400px" chartHeight="200px"/>
      </div>
    </div>
    <Dropdown  :Options='dropdownOptions' text='Link' class="Settings" />

  </div>
</template>

<script>
import Chart from "./Chart";
import Dropdown from "@/components/Utilities/Dropdown";

export default {
    name: "Analytics",
    components:{Dropdown, Chart},
    data(){
      return {
        CchartOptions: undefined,
        Cseries: undefined,
        linkIDs: [],
        LinkClicksData: [],
        BrowsersData: undefined,
        OSData: undefined,
        dropdownOptions: [],
        linkList: []
      }
    },
    computed:{
      chartOptions(){
        return this.CchartOptions
      },
      series(){
        return this.Cseries
      }
    },
    created(){
      fetch("https://d35cozwh7dkec2.cloudfront.net/timm.json", {
        'mode': "cors"
      })
      .then(data =>data.json())
      .then(data => {
        data.urlList.forEach(element => {
          this.linkIDs.push(element.id)
          if(element.title===""){
            element.title = "No Title Set"
          }
          this.linkList.push({title: element.title, img: element.img})
          this.dropdownOptions.push(this.linkList[this.linkList.length-1])
        });
        fetch(`/api/analytics/get/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          mode: "cors"
        }).then(response => response.json())
            .then(data => {
              if(data.Item !== undefined){
                for(let i=0;i<this.linkIDs.length;i++){
                  this.LinkClicksData.push(this.convertLinkClicksData(data, this.linkIDs[i]))
                }
                this.BrowsersData = this.convertBrowsersData(data)
                this.OSData = this.convertOSData(data)
              }

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
              yAxis.push( parseInt(data.Item[k].M[id].N))

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
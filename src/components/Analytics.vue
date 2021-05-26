<template>
  <div class="wrapper">
    <div class="bigChart">
      <D3Bar v-if="LinkClicksData.length!==0" :data="LinkClicksData[0]" chart-width="1400px" chart-height="400px"></D3Bar>
    </div>
    <Dropdown  :Options='dropdownOptions' text='Link' class="Settings"/>

  </div>
</template>

<script>
import Chart from "./Charting/Chart";
import Dropdown from "@/components/Utilities/Dropdown";
import D3Bar from "@/components/Charting/D3Bar";

export default {
    name: "Analytics",
    components:{D3Bar, Dropdown, Chart},
    data(){
      return {
        linkIDs: [],
        LinkClicksData: [],
        BrowsersData: undefined,
        OSData: undefined,
        dropdownOptions: [],
        linkList: []
      }
    },
    computed:{
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
      bubbleSortObjectList(list, key=undefined){
        let switched = false
        for(let i=list.length-1;i>0;i--){
          for(let j=0; j<i;j++){
            if(list[j][key] > list[j+1][key]){
              let temp = list[j][key]
              list[j][key] = list[j+1][key]
              list[j+1][key] = temp
              switched = true
            }
          }
          if(!switched){
            return list;
          }
        }
        return list;
      },
      convertLinkClicksData(data, linkID){
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
        console.log(id)
        let series = []
        Object.keys(data.Item).forEach((k)=>{
          console.log(k)
          console.log(data.Item[k])
          console.log("0")
          if(k.match(timeframeRegex)){
            console.log("1")
            if(data.Item[k].M[id]){
              console.log("2")
              let dataPoint = {}
              dataPoint.id=Date.parse(k)
              dataPoint.value=parseInt(data.Item[k].M[id].N)
              series.push(dataPoint)
              console.log("hah", series)
            }
          }
        })

        console.log("Series0",series)


        this.bubbleSortObjectList(series, "id")
        series = series.map(x=>{
          x.id = new Date(x.id)
          x.id = x.id.toISOString()
          x.id = x.id.slice(0,10)
          if(timeframe === 'Yearly'){
            return x.id.split('-')[0]
          }
          if(timeframe === 'Monthly'){
            return x.id.split('-')[0]+'-'+x.id.split('-')[1]
          }
          return x
        });
        console.log("Series",series)
        return series
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

.chartGrid{
  display: flex;
  flex-direction: column;
}

.horizontalContainer{
  display: flex;
  flex-direction: row;
}

.bigChart, .GridItem{
  border: 1px solid black;
}


</style>
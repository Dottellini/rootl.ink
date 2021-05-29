<template>
  <div class="wrapper">
    <fieldset class="allTimeBar">
      <legend>Lifetime Statistics</legend>
      <div class="fieldsetContent">
        <div style="display: flex; flex-direction: row">
          <svg style="display: block; margin: auto;" width="16" height="16">
            <circle r="8"  cy="8" cx="8" fill="#256EFF"></circle>
          </svg>
          <p class="ieineKlasse" style="margin: 0;">Views: {{ viewsAllTime }}</p>
        </div>
        <div style="display: flex; flex-direction: row">
          <svg style="display: block; margin: auto;" width="16" height="16">
            <circle r="8"  cy="8" cx="8" fill="#C05746"></circle>
          </svg>
          <p class="ieineKlasse" style="margin: 0;">Clicks: {{ linkClicksAllTime }}</p>
        </div>
      </div>
    </fieldset>
    <div class="bigChart">
      <D3Bar v-if="LinkClicksData.length!==0" :data="LinkClicksData[0]" chartHeight="500px" chartWidth="1300px" title="Link Clicks"/>
    </div>
    <div></div>
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
        linkList: [],
        linkClicksAllTime: 0,
        viewsAllTime: 0
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
                  console.log("OLD",this.LinkClicksData)
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
              dataPoint.x=Date.parse(k)
              dataPoint.y=parseInt(data.Item[k].M[id].N)
              series.push(dataPoint)
              console.log("hah", series)
            }
          }
        })

        console.log("Series0",series)


        this.bubbleSortObjectList(series, "id")
        series = series.map(item=>{
          item.x = new Date(item.x)
          item.x = item.x.toISOString()
          item.x = item.x.slice(0,10)
          if(timeframe === 'Yearly'){
            return item.x.split('-')[0]
          }
          if(timeframe === 'Monthly'){
            return item.x.split('-')[0]+'-'+x.id.split('-')[1]
          }
          return item
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

div.fieldsetContent{
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  width: 100% ;

}


p.ieineKlasse{
  margin: 0;
  padding: 0;
  align-self: center;
  line-height: 50px;
}

legend{
  background-color: white;
  border: 1px solid white;
  font-size: 1.2em;
}

.bigChart{
  margin-top: 100px;
}

fieldset.allTimeBar {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-content: stretch;
  color: var(--text-color);
  width: 30vw;
  height: 50px;
  padding-bottom: 0.6em;
  padding-top: 0;
  font-family: Montserrat, sans-serif;
  border-radius: 10px;
  box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2), 0 1px 5px 0 rgba(0, 0, 0, 0.2);
  border: var(--editor-items-border);
}

</style>
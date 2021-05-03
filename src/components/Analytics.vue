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
    <Chart v-if="loaded" :chartOptions="chartOptions" :series="series" />
  </div>
</template>

<script>
  import Chart from "./Chart.vue"
  export default {
    name: "Analytics",
    components:{Chart},
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
      fetch(`/api/analytics/get/timm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: "cors"
      }).then(response => response.json())
        .then(data => {
          this.Analytics = data          
        });

      fetch("http://d26k63xuikc78y.cloudfront.net/timm.json", {
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
        for (var i = 0; i < primaryList.length; i++) {
          if (primaryList[i] > primaryList[i + 1]) {
            var a = primaryList[i]
            var b = primaryList[i + 1]
            primaryList[i] = b
            primaryList[i + 1] = a

            var c = secondaryList[i]
            var d = secondaryList[i + 1]
            secondaryList[i] = d
            secondaryList[i + 1] = c
          }
        }
        return [primaryList, secondaryList]
      },
      convertData: function(data){
        var timeframe
        switch(document.getElementById('timeframe').value){
          case 'Daily':
            timeframe = RegExp('^.{4}-.{1,2}.{1,2}$')
            break;
          case 'Monthly':
            timeframe = RegExp('^.{4}-.{1,2}$')
            break;
          case 'Yearly':
            timeframe = RegExp('^.{4}$')
            break;
        }
        var id = document.getElementById("ID").value
        var xaxis = []
        var yaxis = []
        Object.keys(data.Item).forEach((k)=>{
          if(k.match(timeframe)){
            if(data.Item[k].M[id]){
              xaxis.push(k)
              yaxis.push(data.Item[k].M[id].N)
            }
          }
        })

        console.log(this.sortParallel(xaxis.map(x=>Date.parse(x)),yaxis));

        [xaxis,yaxis] = this.sortParallel(xaxis.map(x=>Date.parse(x)),yaxis);

        console.log(xaxis,yaxis);

        xaxis = xaxis.map(x=>{
          console.log("XXX",new Date(x).getTime())
          x = new Date(x)
          x = x.toISOString()
          x = x.slice(0,10)
          return x
        });
        
        console.log(xaxis,yaxis);

        this.CchartOptions={
          title: {text: "LinkClicks"},
          chart: {
            id: 'LickClicks-Chart'
          },
          xaxis: {
            categories: xaxis//[1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998]
          }
        },
        this.Cseries=[{
          name: 'Link1',
          data: yaxis//[30, 40, 45, 50, 49, 60, 70, 91]
        }]
        this.loaded = false
        this.loaded = true
      }
    }
  }
</script>

<style scoped>
  div{
    background-color: aquamarine;
  }
</style>
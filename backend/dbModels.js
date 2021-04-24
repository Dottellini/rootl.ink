/* This example adds a new item to the Music table. */

var params = {
    Item: {
     "AlbumTitle": {
       S: "Somewhat Famous"
      }, 
     "Artist": {
       S: "No One You Know"
      }, 
     "SongTitle": {
       S: "Call Me Today"
      }
    }, 
    ReturnConsumedCapacity: "TOTAL", 
    TableName: "Music"
   };
   dynamodb.putItem(params, function(err, data) {
     if (err) console.log(err, err.stack); // an error occurred
     else     console.log(data);           // successful response
     /*
     data = {
      ConsumedCapacity: {
       CapacityUnits: 1, 
       TableName: "Music"
      }
     }
     */
   });
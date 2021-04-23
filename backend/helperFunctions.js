function checkItemExistanceFind(ServiceObject,Item, Table){
    return new Promise((resolve,reject)=>{
        let params = {"Key":{},"TableName":""}
        params["Key"][Item.Key]={S: Item.Value};
        params["TableName"] = Table
        ServiceObject.getItem(params, (err,data)=>{
            if(err){
                console.log(err)
                return;
            }
            if(Object.keys(data).length == 0){
                resolve(false)
                return;
            }
            resolve(true)
        })    
    })
}

function checkItemExistanceQuery(ServiceObject,Item, Table, Index){
    return new Promise((resolve,reject)=>{
        let params = {
            "TableName":Table,
            "IndexName":Index, 
            "Select":"ALL_PROJECTED_ATTRIBUTES",
            "KeyConditionExpression": `${Item.Key}` = : `{Item.Key}`,
            "ExpressionAttributeValues":{
                [":${Item.Key}"]:  {S:Item.Value}
            }
        }
        ServiceObject.query(params, (err,data)=>{
            if(err){
                console.log(err)
                return;
            }
            if(data.Items.length==0){
                resolve(false)
                return;
            }
            resolve(true)
        })    
    })
}
exports.checkItemExistanceFind = checkItemExistanceFind;
exports.checkItemExistanceQuery = checkItemExistanceQuery;
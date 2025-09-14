# Trip(date: jsonRes.date,  destination: jsonRes.destination, mode: jsonRes.mode, id:  jsonRes.id, , errormsg: jsonRes.errormsg)
    json response {
        date: jsonRes.date, 
        destination: jsonRes.destination, 
        mode: jsonRes.mode, 
        id:  jsonRes.id , 
        errormsg: jsonRes.errormsg  
    }
    fields should be null if creation failed. and errormsh should be the error message

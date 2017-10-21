var DDDrawing = {}
DDDrawing.create = function(id, 
                            task,
                            status,
                            creator, 
                            creatTime,
                            like,
                            row, 
                            column, 
                            parts) {
    return {
        "id": id,      //string
        "task": task,  //task obj
        "status": status,  //start | finish
        "creator": creator, //user obj
        "creatTime": creatTime,//"2017-10-21T05:55:19Z"
        "like", like, //int
        "row": row, //int
        "column": column, //int
        "parts":parts //array or parts objs
    };
}

part = {
        "id": id,
        "position": {
                     "row":row,
                     "column": column
                    }, 
        "creator": creator, 
        "imageUrl": imageUrl,
        "createTime": creatTime,//"2017-10-21T05:55:19Z"
};

module.exports = DDDrawing;

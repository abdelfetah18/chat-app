var { room: { get_room },auth: { get_session } } = require("../../../lib/db_querys");

export default function handler(req, res) {
    if(req.method === 'POST'){
        var { access_token } = req.body;
        var { id } = req.query;
        get_session(access_token,(err,data)=>{
            if(err){
                throw err;
            }else{
                if(data.length > 0){
                    var { user_id } = data[0];
                    var r = { user_id,name:id }
                    get_room(r,(qerr,room)=>{
                        if(qerr){
                            throw qerr;
                        }else{
                            if(room.length > 0){
                                res.status(200).json({status:"success",room:room[0]});
                            }else{
                                res.status(200).json({status:"fail",message:"you are not allowed!"});
                            }
                        }
                    });
                }else{
                    res.status(200).json({status:"fail",message:"you are not allowed!"});
                }
            }
        });
        
    }else{
        res.status(200).json({message:"you are in the wrong place!"});
    }
}




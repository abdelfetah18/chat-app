var { room: { get_chat } } = require("../../../../lib/db_querys");

export default function handler(req, res) {
    if(req.method === 'POST'){
        var { access_token } = req.body;
        var { id } = req.query;
        var data = { access_token , room_id:id };
            get_chat(data,(qerr,chat)=>{
                if(qerr){
                    throw qerr;
                }else{
                    if(chat.length > 0){
                        res.status(200).json({status:"success",chat});
                    }else{
                        res.status(200).json({status:"fail",message:"you are not allowed!"});
                    }
                }
            });
    }else{
        res.status(200).json({message:"you are in the wrong place!"});
    }
}




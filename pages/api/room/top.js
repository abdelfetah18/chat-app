var { room:{ get_top_rooms } } = require("../../../lib/db_querys");

export default function handler(req, res) {
    if(req.method === 'POST'){
        var { access_token } = req.body;
        get_top_rooms(access_token,(qerr,qres)=>{
            if(qerr){
                throw qerr;
            }else{
                res.status(200).json({status:"success",rooms:qres});
            }
        });
    }else{
        res.status(200).json({message:"you are in the wrong place!"});
    }
}




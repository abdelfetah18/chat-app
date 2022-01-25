var { room:{ get_members } } = require("../../../lib/db_querys");

export default function handler(req, res) {
    if(req.method === 'POST'){
        var { access_token,id } = req.body;
        get_members(id,(qerr,members)=>{
            if(qerr){
                throw qerr;
            }else{
                res.status(200).json({status:"success",members});
            }
        });
    }else{
        res.status(200).json({message:"you are in the wrong place!"});
    }
}




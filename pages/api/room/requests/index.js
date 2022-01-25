var { auth: { get_user },room:{ get_requests } } = require("../../../../lib/db_querys");

export default function handler(req, res) {
    if(req.method === 'POST'){
        var { access_token,room_id } = req.body;
        var data = { access_token,room_id };
        get_requests(data,(qerr,requests)=>{
            if(qerr){
                throw qerr;
            }else{
                res.status(200).json({status:"success",requests});
            }
        });
    }else{
        res.status(200).json({message:"you are in the wrong place!"});
    }
}




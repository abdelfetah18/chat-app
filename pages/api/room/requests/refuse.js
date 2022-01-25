var { auth: { get_user },room:{ update_requests,add_member } } = require("../../../../lib/db_querys");

export default function handler(req, res) {
    if(req.method === 'POST'){
        var { room_id,user_id } = req.body;
        var data = { room_id,user_id,status:'refuse' };
        update_requests(data,(qerr,qres)=>{
            if(qerr){
                throw qerr;
            }else{
                if(qres.affectedRows > 0){
                    res.status(200).json({status:"success",message:"user not accepted!"});
                }else{
                    res.status(200).json({status:"fail",message:"something wrong!"});
                }
            }
        });
    }else{
        res.status(200).json({message:"you are in the wrong place!"});
    }
}




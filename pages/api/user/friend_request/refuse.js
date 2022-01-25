var { user: { update_friend_request,insert_friend } } = require("../../../../lib/db_querys");
import Cookies from 'cookies';

export default function handler(req, res) {
    if(req.method === 'POST'){
        var { user_id } = req.body;
        var { access_token } = req.cookies;
        var data = { status:"refuse",access_token,user_id };
        update_friend_request(data,(err,qres)=>{
            if(err){
                throw err;
            }else{
                if(qres.affectedRows > 0){
                    res.status(200).json({status:"success",message:"idk what to say!"});
                }else{
                    res.status(200).json({status:"fail",message:"something wrong!"});
                }
            }
        });
        
    }else{
        res.status(200).json({message:"you are in the wrong place!"});
    }
}

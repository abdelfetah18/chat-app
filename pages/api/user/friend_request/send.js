var { user: { add_request } } = require("../../../../lib/db_querys");
import Cookies from 'cookies';

export default function handler(req, res) {
    if(req.method === 'POST'){
        var { request_user_id } = req.body;
        var { access_token } = req.cookies;
        var data = { request_user_id,access_token }
        add_request(data,(err,qres)=>{
            if(err){
                throw err;
            }else{
                if(qres.affectedRows > 0){
                    res.status(200).json({ status:"success",message:"request sent successfuly!" });
                }else{
                    res.status(200).json({ status:"fail",message:"something wrong!" });
                }
            }
        });
        
    }else{
        res.status(200).json({message:"you are in the wrong place!"});
    }
}

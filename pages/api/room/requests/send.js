var { room: { add_request } } = require("../../../../lib/db_querys");
import Cookies from 'cookies';

export default function handler(req, res) {
    if(req.method === 'POST'){
        var { room_id } = req.body;
        var { access_token } = req.cookies;
        var data = { room_id,status:'request',access_token }
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

var { user: { get_online_friends } } = require("../../../lib/db_querys");
import Cookies from 'cookies';

export default function handler(req, res) {
    if(req.method === 'POST'){
        var { user_id } = req.body;
        get_online_friends(user_id,(err,data)=>{
            if(err){
                throw err;
            }else{
                res.status(200).json({ data });
            }
        });
        
    }else{
        res.status(200).json({message:"you are in the wrong place!"});
    }
}

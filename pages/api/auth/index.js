var { auth: { get_session } } = require("../../../lib/db_querys");
import Cookies from 'cookies';

export default function handler(req, res) {
    if(req.method === 'POST'){
        var { access_token } = req.body;
        get_session(access_token,(err,data)=>{
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




var { user: { get_user } } = require("../../../lib/db_querys");
import Cookies from 'cookies';

export default function handler(req, res) {
    if(req.method === 'POST'){
        var { access_token } = req.body;
        get_user(access_token,(err,data)=>{
            if(err){
                throw err;
            }else{
                res.status(200).json({ user:data[0] });
            }
        });
        
    }else{
        res.status(200).json({message:"you are in the wrong place!"});
    }
}

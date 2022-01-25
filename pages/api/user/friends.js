var { user: { get_friends } } = require("../../../lib/db_querys");
import Cookies from 'cookies';

export default function handler(req, res) {
    if(req.method === 'POST'){
        var { access_token } = req.body;
        get_friends(access_token,(err,friends)=>{
            if(err){
                throw err;
            }else{
                res.status(200).json({ friends });
            }
        });
        
    }else{
        res.status(200).json({message:"you are in the wrong place!"});
    }
}

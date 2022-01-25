var { user: { get_friend_requests } } = require("../../../../lib/db_querys");
import Cookies from 'cookies';

export default function handler(req, res) {
    if(req.method === 'POST'){
        var { access_token } = req.body;
        get_friend_requests(access_token,(err,requests)=>{
            if(err){
                throw err;
            }else{
                res.status(200).json({requests});
            }
        });
        
    }else{
        res.status(200).json({message:"you are in the wrong place!"});
    }
}

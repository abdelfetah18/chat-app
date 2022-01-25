var { user: { get_users } } = require("../../../lib/db_querys");
import Cookies from 'cookies';

export default function handler(req, res) {
    if(req.method === 'POST'){
        var { access_token } = req.body;
        get_users(access_token,(err,users)=>{
            if(err){
                throw err;
            }else{
                res.status(200).json({ users });
            }
        });   
    }else{
        res.status(200).json({message:"you are in the wrong place!"});
    }
}

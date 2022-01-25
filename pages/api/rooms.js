// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
var { room: { get_rooms } } = require("../../lib/db_querys");

export default function handler(req, res) {
    if(req.method === 'POST'){
        var { access_token } = req.body;
        get_rooms(access_token,(err,rooms)=>{
            if(err){
                throw err;
            }else{
                res.status(200).json({ rooms });
            }
        });
    }else{
        res.status(200).json({message:"you are in the wrong place!"});
    }
}

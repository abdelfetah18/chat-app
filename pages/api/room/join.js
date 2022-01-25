var { auth: { get_user,get_session },room:{ get_room,get_room,add_request } } = require("../../../lib/db_querys");

export default function handler(req, res) {
    if(req.method === 'POST'){
        var { room_id } = req.body;
        var { access_token } = req.cookies;
        get_session(access_token,(err,user)=>{
            if(err){
                throw err;
            }else{
                if(user.length > 0){
                    var user_id = user[0].user_id;
                    var data = {user_id,room_id}
                    add_request(data,(qerr,qres)=>{
                        if(err){
                            throw err;
                        }else{
                            if(qres.affectedRows > 0){
                                res.status(200).json({status:"success",message:"request added_successfuly!"});
                            }else{
                                res.status(200).json({status:"fail",message:"something wrong!"});
                            } 
                        }
                    });

                }else{
                    res.status(200).json({status:"fail",message:"user not found!"});
                }
            }
        })
        
    }else{
        res.status(200).json({message:"you are in the wrong place!"});
    }
}




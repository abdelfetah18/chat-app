var { room:{ add_room,add_room_member,add_chat } } = require("../../../lib/db_querys");

export default function handler(req, res) {
    if(req.method === 'POST'){
        var { name } = req.body;
        var { access_token } = req.cookies;
        var data = { name,access_token };
        add_room(data,(qerr,qres)=>{
            if(qerr){
                throw qerr;
            }else{
                if(qres.affectedRows > 0){
                    var d = {access_token,room_id:qres.insertId,role:'admin'}
                    add_room_member(d,(q_err,q_res)=>{
                        if(q_err){
                            throw q_err;
                        }else{
                            if(q_res.affectedRows > 0){
                                add_chat(data,(_err,_res)=>{
                                    if(_err){
                                        throw _err;
                                    }else{
                                        if(_res.affectedRows > 0){
                                            res.status(200).json({ status:"success",message:"room created successffuly!"});
                                        }else{
                                            res.status(200).json({ status:"fail",message:"something wrong!"});
                                        }
                                    }
                                }); 
                            }else{
                                res.status(200).json({ status:"fail",message:"something wrong!"});
                            }
                        }
                    });
                }else{
                    res.status(200).json({ status:"fail",message:"something wrong!"});
                }
            }
        })
        
    }else{
        res.status(200).json({message:"you are in the wrong place!"});
    }
}




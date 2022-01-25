var { auth: { get_user,new_session } } = require("../../../lib/db_querys");
const bcrypt = require("bcryptjs");
import Cookies from 'cookies';
const crypto = require('crypto');

export default function handler(req, res) {
    if(req.method === 'POST'){
        var { username,password } = req.body;
        get_user(username,(err,data)=>{
            if(err){
                throw err;
            }else{
                if(data.length > 0){
                    bcrypt.compare(password, data[0].password, function(err, isMatch) {
                        if (err) {
                          throw err
                        } else if (!isMatch) {
                            res.status(200).json({status:"fail",message:"wrong password!"});
                        } else {
                            var ip_adress = req.connection.remoteAddress
                            var device = req.headers['user-agent'];
                            var access_token = crypto.randomBytes(48).toString('hex');
                            var data = { ip_adress,device,access_token,username };
                            var cookies = new Cookies(req,res);
                            cookies.set("access_token",access_token,{ httpOnly:false });
                            new_session(data,(qerr,qres)=>{
                                if(qerr){
                                    throw qerr;
                                }else{
                                    res.status(200).json({status:"success",message:"login successfuly!"});
                                }
                            });
                        }
                    });
                }else{
                    res.status(200).json({status:"fail",message:"wrong user!"});
                }
                
            }
        })
        
    }else{
        res.status(200).json({message:"you are in the wrong place!"});
    }
}




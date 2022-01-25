var { auth: { new_user,get_user } } = require("../../../lib/db_querys");
const bcrypt = require("bcryptjs");

export default function handler(req, res) {
    if(req.method === 'POST'){
        var { username,email,password,gender,birthdate } = req.body;
        var err = [];
        username = is_valid(username,"username").status == "valid" ? is_valid(username,"username").value : err.push({username:"username is not valid"});
        email = is_valid(email,"email").status == "valid" ? is_valid(email,"email").value : err.push({email:"email is not valid"});
        password = is_valid(password,"password").status == "valid" ? is_valid(password,"password").value : err.push({password:"Weak Password!"});
        gender = is_valid(gender,"gender").status == "valid" ? is_valid(gender,"gender").value : err.push({gender:"gender is not valid"});
        birthdate = is_valid(birthdate,"birthdate").status == "valid" ? is_valid(birthdate,"birthdate").value : err.push({birthdate:"birthdate is not valid"});
        if(err.length > 0){
            res.status(200).json({ status:"fail",err });
        }else{
            //check if user exist
            get_user(username,(q_err,q_res)=>{
                if(q_err){
                    throw q_err;
                }else{
                    if(q_res.length > 0){
                        res.status(200).json({status:"fail",message:"username already exist!"});
                    }else{
                        req.body.birthdate = req.body.birthdate.split("/").reverse();
                        console.log(req.body)
                        const saltRounds = 10;
                        bcrypt.genSalt(saltRounds, function (err, salt) {
                            if (err) {
                                throw err
                            } else {
                                bcrypt.hash(password, salt, function(err, hash) {
                                    if (err) {
                                        throw err
                                    }else{
                                        req.body.password = hash;
                                        new_user(req.body,(err,data)=>{
                                            if(err){
                                                throw err;
                                            }else{
                                                res.status(200).json({status:"success",message:"register success!"});
                                            }
                                        });
                                    }
                                })
                            }
                        });
                    }
                }
            });
        }
    }else{
        res.status(200).json({message:"you are in the wrong place!"});
    }
}


function is_valid(value,type){
    switch(type){
        case "username":
            return  (value.match(/^[A-Za-z0-9]+(?:[_][A-Za-z0-9]+)*$/g) != null ) ? { status:"valid",type,value } : { status:"not_valid",type,value }
        case "email":
            return value.match(/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/g) != null ? { status:"valid",type,value } : { status:"not_valid",type,value } 
        case "password":
            return  (value.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/g) != null ) ? { status:"valid",type,value } : { status:"not_valid",type,value }
        case "gender":
            return value.match(/(male)|(female)/g) != null ? { status:"valid",type,value } : { status:"not_valid",type,value }
        case "birthdate":
            return value.match(/^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/g) != null ? { status:"valid",type,value } : { status:"not_valid",type,value }
    }
}
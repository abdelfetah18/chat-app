var { room:{ update_name } } = require("../../../lib/db_querys");
import formidable from "formidable";
import fs from "fs";

export const config = {
    api: {
      bodyParser: false
    }
};


export default function handler(req, res) {
    if(req.method === 'POST'){
        const form = new formidable.IncomingForm();
        form.parse(req, async function (err, fields, files) {
            var { name,room_id } = fields;
            var { access_token } = req.cookies;
            var data = { name,access_token,room_id };
            update_name(data,(qerr,qres)=>{
                if(qerr){
                    throw qerr;
                }else{
                    if(qres.affectedRows > 0){
                        res.status(200).json({status:"success",message:"name updated successfuly!"});
                    }else{
                        res.status(200).json({status:"fail",message:"failed!"});
                    } 
                }
            });
        });     
    }else{
        res.status(200).json({message:"you are in the wrong place!"});
    }
}


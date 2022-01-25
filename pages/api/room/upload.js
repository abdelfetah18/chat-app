var { room:{ update_cover_img,update_profile_img } } = require("../../../lib/db_querys");
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
            var is_valid = files.file.mimetype === "image/png" || files.file.mimetype === "image/jpeg";
            console.log(files.file.mimetype);
            if(is_valid){
                var { type } = req.query;
                switch(type){
                    case "cover":
                        var { access_token } = req.cookies;
                        var filename = generateFileName()+"."+files.file.originalFilename.split(".")[1];
                        await saveFile(files.file,filename);
                        var { room_id } = fields;
                        var data = { access_token,filename,room_id };
                        update_cover_img(data,(qerr,qres)=>{
                            if(qerr){
                                throw qerr;
                            }else{
                                if(qres.affectedRows > 0){
                                    return res.status(200).send({status:"success",name:filename});
                                }else{
                                    res.status(200).json({status:"fail",message:"failed!"});
                                } 
                            }
                        });     
                    case "profile":
                        var { access_token } = req.cookies;
                        var filename = generateFileName()+"."+files.file.originalFilename.split(".")[1];
                        await saveFile(files.file,filename);
                        var { room_id } = fields;
                        var data = { access_token,filename,room_id };
                        update_profile_img(data,(qerr,qres)=>{
                            if(qerr){
                                throw qerr;
                            }else{
                                if(qres.affectedRows > 0){
                                    return res.status(200).send({status:"success",name:filename});
                                }else{
                                    res.status(200).json({status:"fail",message:"failed!"});
                                }     
                            }
                        }); 
                    case "chat":
                        var filename = generateFileName()+"."+files.file.originalFilename.split(".")[1];
                        await saveFile(files.file,filename);
                        res.status(200).json({status:"success",filename})
                }
            }else{
                return res.status(200).send({status:"fail",message:"file type must be a image png or jpeg!"});
            } 
        });     
    }else{
        res.status(200).json({message:"you are in the wrong place!"});
    }
}

const saveFile = async (file,filename) => {
    const data = fs.readFileSync(file.filepath);
    fs.writeFileSync(`./public/images/rooms/${filename}`, data);
    await fs.unlinkSync(file.filepath);
    return;
};

var generateFileName = () => { 
    var filename = new Date().toLocaleString("en",{hour12:false,hour:"2-digit",minute:"2-digit",second:"2-digit",day:"2-digit",month:"2-digit",year:"numeric"}).replace(",","").replace(/\:/g,"").replace(/\//g,"").split(" ").reverse().join("_"); 
    return filename;
}


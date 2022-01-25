var { user: { get_chat_by_id } } = require("../../../../lib/db_querys");

export default function handler(req, res) {
  if(req.method === 'POST'){
    var { access_token } = req.body;
    var { id } = req.query;
    get_chat_by_id({user_id:id,access_token},(qerr,data)=>{
        if(qerr){
          throw qerr;
        }else{
          res.status(200).json({status:"success",chat:data});
        }
    });
  }else{
      res.status(200).json({message:"you are in the wrong place!"});
  }
}

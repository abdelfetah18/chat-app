var { user: { get_recent_chat } } = require("../../../../lib/db_querys");

export default function handler(req, res) {
  if(req.method === 'POST'){
    var { access_token } = req.body;
    get_recent_chat(access_token,(qerr,data)=>{
        if(qerr){
          throw qerr;
        }else{
          res.status(200).json({status:"success",recent_chat:data});
        }
    });
  }else{
      res.status(200).json({message:"you are in the wrong place!"});
  }
}

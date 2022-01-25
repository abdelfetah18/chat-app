var { user: { get_last_chat,get_chat } } = require("../../../../lib/db_querys");

export default function handler(req, res) {
  if(req.method === 'POST'){
    var { access_token } = req.body;
    get_chat(access_token,(qerr,chat)=>{
      if(qerr){
        throw qerr;
      }else{
        get_last_chat(access_token,(q_err,last_chat)=>{
          if(q_err){
            throw q_err;
          }else{
            res.status(200).json({ chat,last_chat })
          }
        });
      }
    });
  }else{
      res.status(200).json({message:"you are in the wrong place!"});
  }
}

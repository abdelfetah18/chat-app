var { user: { get_user_by_id } } = require("../../../lib/db_querys");

export default function handler(req, res) {
  if(req.method === 'POST'){
    var { access_token } = req.body;
    var { id } = req.query;
    get_user_by_id(id,(qerr,data)=>{
        if(qerr){
          throw qerr;
        }else{
          res.status(200).json({status:"success",user:data[0]});
        }
    });
  }else{
      res.status(200).json({message:"you are in the wrong place!"});
  }
}

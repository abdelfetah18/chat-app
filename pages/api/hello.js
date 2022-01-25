// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
var { auth: { Login } } = require("../../lib/db_querys");

export default function handler(req, res) {
  Login("Abdelfetah",(err,data)=>{
    res.status(200).json(data) 
  })
}

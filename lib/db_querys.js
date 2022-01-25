var mysql = require("mysql");
const connection = require("./db_connect");
var { DB_HOST,DB_USER,DB_PASSWORD,DB_PORT,DB_DATABASE } = process.env;
var pool = mysql.createPool({
    host:DB_HOST,
    user:DB_USER,
    password:DB_PASSWORD,
    database:DB_DATABASE,
    port:DB_PORT
});

exports.auth = {
    new_user : function(data,callback){
        var { username,email,password,birthdate,gender } = data;
        pool.getConnection((err,connection)=>{
            if(err){
                throw err;
            }else{
                pool.query("insert into users (username,email,password,birthdate,gender) values ('"+username+"','"+email+"','"+password+"','"+birthdate+"','"+gender+"') ;",(qerr,data)=>{
                    callback(qerr,data);
                    connection.release();
                });
            }
        });  
    },
    get_user : function(username,callback){
        pool.getConnection((err,connection)=>{
            if(err){
                throw err;
            }else{
                pool.query("select * from users where username='"+username+"' or email='"+username+"';",(qerr,data)=>{
                    callback(qerr,data);
                    connection.release();
                });
            }
        });  
    },
    new_session : function(data,callback){
        var { device,ip_adress,access_token,username } = data;
        pool.getConnection((err,connection)=>{
            if(err){
                throw err;
            }else{
                pool.query("insert into user_sessions (user_id,device,ip,access_token) select id,'"+device+"','"+ip_adress+"','"+access_token+"' from users where username = '"+username+"';",(qerr,data)=>{
                    callback(qerr,data);
                    connection.release();
                });
            }
        });  
    },
    get_session : function(access_token,callback){
        pool.getConnection((err,connection)=>{
            if(err){
                throw err;
            }else{
                pool.query("select user_id from user_sessions where access_token='"+access_token+"';",(qerr,data)=>{
                    callback(qerr,data);
                    connection.release();
                });
            }
        });  
    },
}

exports.room = {
    add_room : function(data,callback){
        var { access_token,name } = data;
        pool.getConnection((err,connection)=>{
            if(err){
                throw err;
            }else{
                pool.query("insert into rooms (name,created_by,admin_id) select '"+name+"',user_id,user_id from user_sessions where access_token = '"+access_token+"' ;",(qerr,data)=>{
                    callback(qerr,data);
                    connection.release();
                });
            }
        });  
    },
    add_room_member : function(data,callback){
        var { access_token,room_id,role } = data;
        pool.getConnection((err,connection)=>{
            if(err){
                throw err;
            }else{
                pool.query("insert into room_members (room_id,member_id,role) select '"+room_id+"',user_id,'"+role+"' from user_sessions where access_token = '"+access_token+"' ;",(qerr,data)=>{
                    callback(qerr,data);
                    connection.release();
                });
            }
        });  
    },
    get_room : function(data,callback){
        var { user_id,name } = data;
        pool.getConnection((err,connection)=>{
            if(err){
                throw err;
            }else{
                pool.query("select * from rooms where id = '"+name+"' or name='"+name+"' and admin_id = '"+user_id+"' ;",(qerr,data)=>{
                    callback(qerr,data);
                    connection.release();
                });
            }
        });  
    },

    add_request : function(data,callback){
        var { access_token,room_id,status } = data;
        pool.getConnection((err,connection)=>{
            if(err){
                throw err;
            }else{
                pool.query("insert into room_requests (user_id,room_id,status) select user_id,'"+room_id+"','"+status+"' from user_sessions where access_token = '"+access_token+"' ;",(qerr,data)=>{
                    callback(qerr,data);
                    connection.release();
                });
            }
        });  
    },
    update_cover_img : function(data,callback){
        var { filename,access_token,room_id } = data;
        pool.getConnection((err,connection)=>{
            if(err){
                throw err;
            }else{
                pool.query("update rooms set cover_img = '"+filename+"'where admin_id = (select user_id from user_sessions where access_token='"+access_token+"') and id = '"+room_id+"';",(qerr,data)=>{
                    callback(qerr,data);
                    connection.release();
                });
            }
        }); 
    },
    update_profile_img : function(data,callback){
        var { filename,access_token,room_id } = data;
        pool.getConnection((err,connection)=>{
            if(err){
                throw err;
            }else{
                pool.query("update rooms set profile_img = '"+filename+"'where admin_id = (select user_id from user_sessions where access_token='"+access_token+"') and id = '"+room_id+"';",(qerr,data)=>{
                    callback(qerr,data);
                    connection.release();
                });
            }
        }); 
    },
    update_name : function(data,callback){
        var { name,access_token,room_id } = data;
        pool.getConnection((err,connection)=>{
            if(err){
                throw err;
            }else{
                pool.query("update rooms set name = '"+name+"'where admin_id = (select user_id from user_sessions where access_token='"+access_token+"') and id = '"+room_id+"';",(qerr,data)=>{
                    callback(qerr,data);
                    connection.release();
                });
            }
        }); 
    },
    get_members : function(room_id,callback){
        pool.getConnection((err,connection)=>{
            if(err){
                throw err;
            }else{
                pool.query("select * from room_members where room_id = '"+room_id+"' ;",(qerr,data)=>{
                    callback(qerr,data);
                    connection.release();
                });
            }
        }); 
    },
    get_chat : function(data,callback){
        var { access_token,room_id } = data;
        pool.getConnection((err,connection)=>{
            if(err){
                throw err;
            }else{
                pool.query("select room_chat.*,username from room_members,room_chat join users on room_chat.sender_id = users.id where room_members.member_id = (select user_id from user_sessions where access_token = '"+access_token+"') and room_members.room_id = "+room_id+" and room_chat.room_id = "+room_id+" order by created_at asc limit 10;",(qerr,data)=>{
                    callback(qerr,data);
                    connection.release();
                });
            }
        }); 
    },
    add_msg : function(data,callback){
        var { room_id,sender_id,type,content } = data;
        pool.getConnection((err,connection)=>{
            if(err){
                throw err;
            }else{
                pool.query("insert into room_chat (room_id,sender_id,type,content) value ("+room_id+","+sender_id+",'"+type+"','"+content+"');",(qerr,data)=>{
                    callback(qerr,data);
                    connection.release();
                });
            }
        }); 
    },
    get_members : function(room_id,callback){
        pool.getConnection((err,connection)=>{
            if(err){
                throw err;
            }else{
                pool.query("select room_members.*,username,profile_img from room_members join users on users.id = member_id where room_id = (select id from rooms where name = '"+room_id+"' or id = "+room_id+") ;",(qerr,data)=>{
                    callback(qerr,data);
                    connection.release();
                });
            }
        }); 
    },
    get_top_rooms : function(access_token,callback){
        pool.getConnection((err,connection)=>{
            if(err){
                throw err;
            }else{
                pool.query("select rooms.id as room_id,rooms.name,rooms.profile_img,count(room_members.room_id) as members from rooms left join room_members on rooms.id = room_members.room_id where rooms.id not in (select room_members.room_id from room_members where member_id = (select user_id from user_sessions where access_token = '"+access_token+"')) and rooms.id not in (select room_requests.room_id from room_requests where user_id = (select user_id from user_sessions where access_token = '"+access_token+"')) group by room_members.room_id order by members desc limit 5;",(qerr,data)=>{
                    callback(qerr,data);
                    connection.release();
                });
            }
        }); 
    },
    get_rooms : function(access_token,callback){
        pool.getConnection((err,connection)=>{
            if(err){
                throw err;
            }else{
                pool.query("select rooms.id as room_id,rooms.name,rooms.profile_img,room_requests.user_id,room_requests.status from rooms left join room_requests on rooms.id = room_requests.room_id where room_requests.user_id = (select user_id from user_sessions where access_token  = '"+access_token+"') or rooms.id in (select room_id from room_members where member_id = (select user_id from user_sessions where access_token  = '"+access_token+"')) group by name;",(qerr,data)=>{
                    callback(qerr,data);
                    connection.release();
                });
            }
        }); 
    },
    add_chat : function(data,callback){
        var { access_token,name } = data;
        pool.getConnection((err,connection)=>{
            if(err){
                throw err;
            }else{
                pool.query("insert into room_chat (room_id,sender_id,type,content,seen) select (select id from rooms where name = '"+name+"'),user_id,'message','Welcom To The Chat!',false from user_sessions where access_token = '"+access_token+"';",(qerr,data)=>{
                    callback(qerr,data);
                    connection.release();
                });
            }
        }); 
    },
    get_requests : function(data,callback){
        var { access_token,room_id } = data;
        pool.getConnection((err,connection)=>{
            if(err){
                throw err;
            }else{
                pool.query("select room_requests.*,users.username,users.profile_img from room_requests join users on users.id = room_requests.user_id where room_id = (select room_id from room_members where room_id = (select rooms.id from rooms where id = '"+room_id+"' or name = '"+room_id+"') and member_id = (select user_id from user_sessions where access_token = '"+access_token+"') and role = 'admin') and room_requests.status='request';",(qerr,data)=>{
                    callback(qerr,data);
                    connection.release();
                });
            }
        }); 
    },
    update_requests : function(data,callback){
        var { access_token,room_id,user_id,status } = data;
        pool.getConnection((err,connection)=>{
            if(err){
                throw err;
            }else{
                pool.query("update room_requests set status = '"+status+"' where room_id = '"+room_id+"' and user_id = '"+user_id+"';",(qerr,data)=>{
                    callback(qerr,data);
                    connection.release();
                });
            }
        }); 
    },
    add_member : function(data,callback){
        var { room_id,user_id } = data;
        pool.getConnection((err,connection)=>{
            if(err){
                throw err;
            }else{
                pool.query("insert into room_members (room_id,member_id,role) values ('"+room_id+"','"+user_id+"','member');",(qerr,data)=>{
                    callback(qerr,data);
                    connection.release();
                });
            }
        }); 
    },

}

exports.user = {
    get_online_friends : function(user_id,callback){
        pool.getConnection((err,connection)=>{
            if(err){
                throw err;
            }else{
                pool.query("select users.id as user_id,users.username,users.profile_img,users.online_time from users join user_friends on users.id = user_friends.friend_id where users.status = 'online' and user_friends.user_id = '"+user_id+"'; ",(qerr,data)=>{
                    callback(qerr,data);
                    connection.release();
                });
            }
        });  
    },
    get_user : function(access_token,callback){
        pool.getConnection((err,connection)=>{
            if(err){
                throw err;
            }else{
                pool.query("select id as user_id,username,profile_img from users where id = (select user_id from user_sessions where access_token = '"+access_token+"');",(qerr,data)=>{
                    callback(qerr,data);
                    connection.release();
                });
            }
        });  
    },
    get_chat : function(access_token,callback){
        pool.getConnection((err,connection)=>{
            if(err){
                throw err;
            }else{
                pool.query("select id as user_id,username,profile_img from users where id = (select user_id from user_sessions where access_token = '"+access_token+"');",(qerr,data)=>{
                    callback(qerr,data);
                    connection.release();
                });
            }
        }); 
    },
    get_friends : function(access_token,callback){
        pool.getConnection((err,connection)=>{
            if(err){
                throw err;
            }else{
                pool.query("select id as user_id,username,profile_img from users where id in (select friend_id from user_friends where user_id = (select user_id from user_sessions where access_token = '"+access_token+"'));",(qerr,data)=>{
                    callback(qerr,data);
                    connection.release();
                });
            }
        }); 
    },
    get_users : function(access_token,callback){
        pool.getConnection((err,connection)=>{
            if(err){
                throw err;
            }else{
                pool.query("select id as user_id,username,profile_img from users where id not in (select friend_id from user_friends where user_id = (select user_id from user_sessions where access_token = '"+access_token+"')) and id not in (select request_user_id from user_friend_requests where user_id = (select user_id from user_sessions where access_token = '"+access_token+"')) and id not in (select user_id from user_friend_requests where request_user_id = (select user_id from user_sessions where access_token = '"+access_token+"')) and id != (select user_id from user_sessions where access_token = '"+access_token+"');",(qerr,data)=>{
                    callback(qerr,data);
                    connection.release();
                });
            }
        }); 
    },

    add_request : function(data,callback){
        var { access_token,request_user_id } = data;
        pool.getConnection((err,connection)=>{
            if(err){
                throw err;
            }else{
                pool.query("insert into user_friend_requests (user_id,request_user_id,status) values ((select user_id from user_sessions where access_token  = '"+access_token+"'),"+request_user_id+",'request');",(qerr,data)=>{
                    callback(qerr,data);
                    connection.release();
                });
            }
        }); 
    },
    get_friend_requests : function(access_token,callback){
        pool.getConnection((err,connection)=>{
            if(err){
                throw err;
            }else{
                pool.query("select users.id as user_id,users.username,users.profile_img from users where id in (select user_id from user_friend_requests where request_user_id = (select user_id from user_sessions where access_token = '"+access_token+"')  and status = 'request')",(qerr,data)=>{
                    callback(qerr,data);
                    connection.release();
                });
            }
        }); 
    },
    update_friend_request : function(data,callback){
        var { status,user_id,access_token } = data;
        pool.getConnection((err,connection)=>{
            if(err){
                throw err;
            }else{
                pool.query("update user_friend_requests set status = '"+status+"' where request_user_id = (select user_id from user_sessions where access_token = '"+access_token+"') and user_id = '"+user_id+"';",(qerr,data)=>{
                    callback(qerr,data);
                    connection.release();
                });
            }
        }); 
    },
    insert_friend : function(data,callback){
        var { user_id,access_token } = data;
        pool.getConnection((err,connection)=>{
            if(err){
                throw err;
            }else{
                pool.query("insert into user_friends (user_id,friend_id) select user_id,'"+user_id+"' from user_sessions where access_token = '"+access_token+"';",(qerr,data)=>{
                    callback(qerr,data);
                    connection.release();
                });
            }
        }); 
        pool.getConnection((err,connection)=>{
            if(err){
                throw err;
            }else{
                pool.query("insert into user_friends (user_id,friend_id) select '"+user_id+"',user_id from user_sessions where access_token = '"+access_token+"';",(qerr,data)=>{
                    callback(qerr,data);
                    connection.release();
                });
            }
        });
    },
    get_last_chat : function(access_token,callback){
        pool.getConnection((err,connection)=>{
            if(err){
                throw err;
            }else{
                pool.query("select user_chat_messages.*,users.username,users.profile_img from user_chat_messages join users on users.id = user_chat_messages.sender_id where chat_id = (select chat_id from user_chat_messages where created_at = (select max(created_at) from user_chat_messages where chat_id in (select id from user_chat where user_id = (select user_id from user_sessions where access_token = '"+access_token+"'))));",(qerr,data)=>{
                    callback(qerr,data);
                    connection.release();
                });
            }
        }); 
    },
    get_chat : function(access_token,callback){
        pool.getConnection((err,connection)=>{
            if(err){
                throw err;
            }else{
                pool.query("select user_chat_messages.*,users.username,users.profile_img from user_chat_messages join users on user_chat_messages.sender_id = users.id where user_chat_messages.id in (select  MAX(user_chat_messages.id) as id from user_chat_messages where user_chat_messages.chat_id in (select user_chat.id from user_chat where user_chat.user_id = (select user_id from user_sessions where access_token = '"+access_token+"'))  group by user_chat_messages.chat_id order by user_chat_messages.created_at desc);",(qerr,data)=>{
                    callback(qerr,data);
                    connection.release();
                });
            }
        }); 
    },
    get_chat_by_id : function(data,callback){
        var { access_token,user_id } = data;
        pool.getConnection((err,connection)=>{
            if(err){
                throw err;
            }else{
                pool.query("select user_chat_messages.*,users.profile_img,users.username from user_chat_messages join users on sender_id = users.id where user_chat_messages.chat_id in (select id from user_chat where user_id in ((select user_id from user_sessions where access_token = '"+access_token+"'),(select id from users where users.id = '"+user_id+"' or username = '"+user_id+"')) and sender_id in ((select user_id from user_sessions where access_token = '"+access_token+"'),(select id from users where users.id = '"+user_id+"' or username = '"+user_id+"'))) order by created_at desc limit 10;",(qerr,data)=>{
                    callback(qerr,data);
                    connection.release();
                });
            }
        }); 
    },
    get_user_by_id : function(user_id,callback){
        pool.getConnection((err,connection)=>{
            if(err){
                throw err;
            }else{
                pool.query("select users.id as user_id,users.username,users.profile_img,users.status from users where id='"+user_id+"' or username = '"+user_id+"';",(qerr,data)=>{
                    callback(qerr,data);
                    connection.release();
                });
            }
        }); 
    },
    get_recent_chat : function(access_token,callback){
        pool.getConnection((err,connection)=>{
            if(err){
                throw err;
            }else{
                pool.query("select * from (select user_chat_messages.*,users.id as user_id,users.username,users.profile_img from user_chat_messages join user_chat on user_chat_messages.chat_id = user_chat.id join users on user_chat.user_id = users.id or user_chat_messages.sender_id = users.id where user_chat_messages.id in (select max(data.id) from (select user_chat_messages.*,users.id as user_id,users.username,users.profile_img from user_chat_messages join user_chat on chat_id = user_chat.id join users on user_chat.user_id = users.id or user_chat_messages.sender_id = users.id where user_chat_messages.id in (select max(id) from user_chat_messages where chat_id in (select id from user_chat where user_id = (select user_id from user_sessions where access_token = '"+access_token+"')) or sender_id = (select user_id from user_sessions where access_token = '"+access_token+"') group by chat_id)) as data where data.user_id != (select user_id from user_sessions where access_token = '"+access_token+"') group by user_id)) as recent where recent.user_id != (select user_id from user_sessions where access_token = '"+access_token+"') order by created_at desc;",(qerr,data)=>{
                    callback(qerr,data);
                    connection.release();
                });
            }
        }); 
    },
}


//select user_chat_messages.*,users.username,users.profile_img from user_chat_messages join users on sender_id = users.id where chat_id = (select id from user_chat where user_id = (select user_id from user_sessions where access_token = '"+access_token+"')) group by sender_id order by created_at desc;


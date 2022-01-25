import Head from 'next/head'
import { useEffect, useState } from 'react';
import Cookies from 'universal-cookie';
import Nav from '../../components/nav';
import { io } from "socket.io-client";
import Link from "next/link";
import Script from 'next/script';
import Footer from "../../components/footer";
import Image from "next/image";

export async function getServerSideProps({ params,req,res }){
    var { cookies } = req;
    var { access_token } = cookies;

	const recent_chat_req = await fetch("http://127.0.0.1:3000/api/user/chat/recent",{method:"POST",headers: {'Content-Type': 'application/json'},body:JSON.stringify({access_token,id:params.id})});
    const recent_chat = await recent_chat_req.json();
	const user_req = await fetch("http://127.0.0.1:3000/api/user/",{method:"POST",headers: {'Content-Type': 'application/json'},body:JSON.stringify({access_token})});
    const user = await user_req.json();
    const target_user_req = await fetch("http://127.0.0.1:3000/api/user/"+params.id,{method:"POST",headers: {'Content-Type': 'application/json'},body:JSON.stringify({access_token})});
    const target_user = await target_user_req.json();
	const chat_req = await fetch("http://127.0.0.1:3000/api/user/chat/"+params.id,{method:"POST",headers: {'Content-Type': 'application/json'},body:JSON.stringify({access_token})});
    const chat = await chat_req.json();
	console.log(recent_chat);
	if(target_user.status == "success" && chat.status == "success"){
      	return { props:{ target_user:target_user.user,chat:chat.chat,user:user.user,recent_chat:recent_chat.recent_chat } }
    }else{ 
      return {
        redirect: {
          destination: '/',
          permanent: false
        }
      }
    }  
}

export default function Home( { target_user,chat,user,recent_chat } ) {
	const [tab,setTab] = useState('.container');
	var [recent,setRecent] = useState(recent_chat);

	var socket;
	
	useEffect(()=>{
		socket = io("127.0.0.1:4000").emit("new_user",{ user_id:user.user_id });
	

		socket.on("user_message",(data)=>{
			console.log(data);
			switch(data.type){
				case "message":
					$(".messages").children()[0].innerHTML += ('<li key={msg.id} class="message"><span class="recv-msg">'+data.content+'</span></li>');
					break;
				case "image":
					$(".messages").children()[0].innerHTML += ('<li key={msg.id} class="message"><div class="recv_img_msg"><img src="/images/rooms/'+data.content+'" width="100%" /></div></li>');
					break;
			}
		});

	},[]);

	function uploadImg(e){
		var file = e.target.files[0];
		var f = new FormData();
		f.append("file",file);
		$.ajax({
			type : "POST",
			contentType : false,
			processData:false,
			url : "/api/room/upload?type=chat",
			data : f,
			success : (data)=>{
			  var { filename } = data;
			  $(".messages")[0].style.height = "68%";
			  $(".img-preview")[0].innerHTML = '<img src="/images/rooms/'+filename+'" filename="'+filename+'" width=100 />';
			  $(".img-preview").fadeIn();
			  /*if(data.status == 'success'){
				$(".alert-danger").fadeOut(100);
				$(".alert-success")[0].innerText = "Room Cover Image Uploaded Successfuly!";
				$(".alert-success").fadeIn(500);
				$(".cover_img")[0].src = "/images/rooms/"+data.name;
				$(".alert-success").fadeOut(3000);
			  }else{
				$(".wrong").fadeOut(100);
				$(".wrong")[0].innerText = data.message;
				$(".wrong").fadeIn(500);
			  }*/
			},
			error : function(e) {
			  alert("Error!")
			  console.log("ERROR: ", e);
			}  
		  });
	}
	
	function send_msg(e){
		if(document.getElementById("msg").value.length > 0){
			var msg = document.getElementById("msg").value;
			var data = { user_id:user.user_id,target_user_id:target_user.user_id,content:msg,type:"message"};
			socket.emit("user_message",data);
			document.getElementById("msg").value = "";
			$(".messages").children()[0].innerHTML += ('<li key={msg.id} class="message"><span class="send-msg">'+data.content+'</span></li>');
		}
		if($(".img-preview")[0].children.length > 0){
			var filename = $(".img-preview")[0].children[0].getAttribute("filename");
			var data = { user_id:user.user_id,target_user_id:target_user.user_id,content:filename,type:"image"};
			socket.emit("user_message",data);
			$(".img-preview").fadeOut();
			$(".messages")[0].style.height = "75%";
			$(".img-preview")[0].children[0].remove();
			$(".messages").children()[0].innerHTML += ('<li key={msg.id} class="message"><div class="send_img_msg"><img src="/images/rooms/'+data.content+'" width="100%" /></div></li>');
		}
	}

	function TabSelect(e){
		document.getElementsByClassName('active')[0].classList.remove('active');
		e.target.classList.add('active');
		switch(e.target.innerText){
			case "Requests":
				$(tab).fadeOut();
				$(".room-requests").fadeIn();
				setTab('.room-requests');
				break;
			case "Chat":
				$(tab).fadeOut();
				$(".container").fadeIn();
				setTab(".container")
				break;	
		}
	}





  return (
    <div className='bg'>
        <Head>
			<title>{ target_user.username }</title>
			<style type="text/css">
				{`
				body {
					margin: 0;
					padding: 0;
					font-family: monospace;
				}

				ul {
					list-style: none;
				}
				.App {
					display: block;
					width: 100%;
					margin: 0;
					padding: 0;
				}

				.logo {
					display: grid;
					justify-items: center;
					align-items: center;
					justify-content: center;
					align-content: center;
					color: white;
					padding: 10px;
					font-size: 28px;
					font-weight: bold;
					float: left;
				}

				footer {
					display: flex;
					position: absolute;
					height: 50px;
					bottom: 0;
					width: 100%;
					justify-content: center;
					align-items: center;
					background-color: #0080bd;
				}

				.chat-box {
					display: block;
					background: white;
					box-shadow: 0 0 0.3rem;
					width: 45%;
					float: left;
					height: 97%;
					padding: 0.5rem;
				}

				.messages {
					display: block;
					height: 75%;
					overflow: auto;
					overflow-x: hidden;
				}

				.recent-chat {
					display: block;
					background: white;
					box-shadow: 0 0 0.3rem;
					width: 45%;
					float: right;
					height: 100%;
				}

				.chat-user {
					width: 100%;
					height: fit-content;
					background-color: #24a9d7;
					display: flex;
					align-items: center;
				}

				.user-img {
					float: left;
					width: 3rem;
					filter: drop-shadow(0px 0px 0.2rem black);
					height: 3rem;
					margin: 10px;
				}

				.user-img img{
					width: 100%;
					height: 100%;
				}

				.user-name {
					width: 89%;
					float: left;
					color: white;
					font-weight: bold;
					font-size: 0.875rem;
					margin: 5px;
				}

				.user-info {
					float: right;
					color: white;
					font-size: 1.5rem;
					text-align: center;
					width: 3em;
				}

				.send-msg {
					float: right;
					background-color: #0083ff;
					border-radius: 5px;
					padding: 5px;
					margin-right: 20px;
					color: white;
					font-family: arial;
				}

				.recv-msg {
					float: left;
					background-color: #c9c9c9;
					border-radius: 5px;
					padding: 5px;
					margin-right: 20px;
					color: #2a2a2a;
					font-family: arial;
				}

				.message {
					width : 100%;
					font-size: 0.9rem;
					margin: 0.2rem;
				}

				.messages ul {
					display: grid;
				}

				.send-box {
					display: flex;
					align-items: center;
				}

				.send-img {
					width: 7%;
					float: left;
				}

				.msg {
					width: 80%;
					float: left;
				}

				.msg input {
					width: 100%;
					font-size: 20px;
				}

				.send-btn {
					float: right;
					width: 13%;
					text-align: center;
					font-weight: bold;
					font-size: 0.875rem;
					background-color: #005fff;
					margin: 1em;
					padding: 0.3rem;
					border-radius: 18px;
					color: wheat;
				}

				.recent-chat-head {
					width: 100%;
					font-size: 0.975rem;
					font-weight: 700;
					margin: 1em;
				}

				.recent-chat-body {
					height: 100%;
					display: flex;
					flex-direction: column;
				}

				.container {
					border: 0.5px solid;
					margin-top: 1rem;
					width: 95%;
					margin-left: auto;
					margin-right: auto;
					height: 75vh;
				}

				.room-requests {
					display: none;
					border: 0.5px solid;
					margin-top: 1rem;
					width: 95%;
					margin-left: auto;
					margin-right: auto;
					height: 75vh;
				}

				.recent-user-img {
					height: 40px;
					width: 40px;
				}

				.recent-user-img img {
					width: 40px;
					height: 40px;
				}
				.recent-user {
					display: flex;
					flex-direction: row;
					margin: 1rem;
					align-items: center;
					padding: 1em;
					transition: 0.5s;
				}

				.recent-user:hover {
					box-shadow: 0 0 6px;
					padding: 1.5em;
					cursor: pointer;
				}

				.recent-user-name {
					font-weight: 700;
					font-size: 0.9rem;
					margin: 0.8em;
					position: relative;
					top: -0.6em;
				}

				.last-msg {
					position: relative;
					top: 0.5em;
					width: 100%;
					font-size: 0.7rem;
				}

				.unread-status {
					color: #0066ff;
					font-size: 0.5rem;
				}

				.send-img {
					float: left;
					padding: 1em;
					color: green;
					width: 7%;
					text-align: center;
					cursor: pointer;
				}

				.credit {
					float: right;
					width: 50%;
					display: grid;
					justify-items: center;
					align-items: center;
					color: white;
					font-size: 14px;
				}

				.info {
					float: left;
					width: 50%;
				}

				.info ul {
					display: flex;
				}

				.info ul li a {
					margin: 15px;
					text-decoration: none;
					color: white;
					font-size: 14px;
				}

				.room-settings {
					display: none;
					width: 80%;
					height: 80vh;
					background-color: #d0cfd7;
					position: fixed;
					top: 10%;
					left: 10%;
					box-shadow: 0 0 10px;
				}

				.tab-list {
					display: flex;
					flex-direction: row;
					background-color: white;
					width: 95%;
					margin-left: auto;
					margin-right: auto;
					margin-top: 15px;
					border-bottom: 0.5px solid;
				}

				.tab-item {
					color: black;
					font-weight: bold;
					padding: 10px;
					margin-left: 2px;
					cursor: pointer;
					border-right: 0.5px solid;
				}

				.active {
					box-shadow: 0px 0px 2px;
					background: bisque;
				}

				

				.accept-btn {
					color: lime;
					margin: 20px;
					font-weight: bold;
					font-size: 1.3rem;
					transition:1s;
				}
				.accept-btn:hover {
					cursor: pointer;
				}
	
				.remove-btn {
					color: orangered;
					margin: 20px;
					font-weight: bold;
					font-size: 1.3rem;
					transition:1s;
				}
				.remove-btn:hover {
					cursor: pointer;
				}


				

				@media all and (max-width: 1000px) {
					.container {
						height: fit-content;
						display: flex;
						flex-wrap: nowrap;
						justify-items: center;
						flex-direction: column;
						align-items:center;
					}
					.chat-box {
							display: block;
							background: white;
							box-shadow: 0 0 15px;
							width: 95%;
							margin-left: auto;
							margin-right: auto;
							height: 70vh;
					}
					.recent-chat {
						display: block;
						background: white;
						box-shadow: 0 0 0.875rem;
						float: right;
						height: 100%;
						width: 95%;
						margin-bottom: 5rem;
					}

					footer {
						position: relative;
					}

				}


				`
				}
			</style>
			
        </Head>
        <input type="hidden" value={ target_user.id } id="room_id" />
        <div className="App">
        <Nav />
			<div className='tab-list'>
				<div className='tab-item active' onClick={ TabSelect } >Chat</div>
				{ (target_user.admin_id == user.user_id) ? ( 
				<div className='tab-item' onClick={ TabSelect } >Requests</div>
				) : "" }
			</div>
            <div className="container">
                <div className="chat-box">
                    <div className="chat-user">
                        <div className="user-img"><Image layout='fill' src={ target_user.profile_img != null ? "/images/users/"+target_user.profile_img : "/images/users/profile_img.png"} /></div>
                        <div className="user-name">{ target_user.username }</div>
                        <div className="user-info"><i aria-hidden className="fas fa-info"></i></div>
                    </div>
                    <div className="messages">
                        <ul>
							{ chat.slice(0).reverse().map((msg)=> {
								return((msg.username === user.username) ? <li key={msg.id} className="message">{ msg.type == "message" ?  (<span className="send-msg">{msg.content}</span>) : (<div className='send_img_msg'><img src={"/images/rooms/"+msg.content} width="100%" /></div> )}</li> : <li key={msg.id} className="message">{ msg.type == "message" ?  (<span className="recv-msg">{msg.content}</span>) : (<div className='recv_img_msg'><img src={"/images/rooms/"+msg.content} width="100%" /></div> )}</li> )
							}) }
                        </ul>
                    </div>
					<div className='img-preview'></div>
					<input type="file" id="send_img" onChange={uploadImg} style={{display:'none'}} />
                    <div className="send-box">
                        <div className="send-img" onClick={ () => $("#send_img").click() }><i aria-hidden className="fas fa-images"></i></div>
                        <div className="msg"><input type="text" id="msg"  name="msg"/></div>
                        <div className="send-btn" onClick={send_msg}>send</div>
                    </div>
                </div>
                <div className="recent-chat">
                    <div className="recent-chat-head">Chat Members:</div>
                    <div className="recent-chat-body">
					{recent_chat.map((u)=>{
						if(u.user_id == target_user.user_id){
							return (
								<Link href={"/chat/"+u.user_id} >
									<div className={"recent-user"+( u.user_id == target_user.user_id ? " user_hover" : "")}>
										<div className="recent-user-img"><img src={ u.profile_img != null ? "/images/users/"+u.profile_img : "/images/users/profile_img.png"}/></div>
										<div className="recent-user-name">{ u.username }</div>
										<div className='last-msg'>{ u.content }</div>
										<div className="unread-status"><i aria-hidden className="fas fa-circle"></i></div>
									</div>
								</Link>
							)
						}	
					})}
					{recent_chat.map((u)=>{
						if(u.user_id != target_user.user_id){
							return (
								<Link href={"/chat/"+u.user_id} >
									<div className={"recent-user"+( u.user_id == target_user.user_id ? " user_hover" : "")}>
										<div className="recent-user-img"><img src={ u.profile_img != null ? "/images/users/"+u.profile_img : "/images/users/profile_img.png"}/></div>
										<div className="recent-user-name">{ u.username }</div>
										<div className='last-msg'>{ u.content }</div>
										<div className="unread-status"><i aria-hidden className="fas fa-circle"></i></div>
									</div>
								</Link>
							)
						}
					})}
                    </div>
                </div>
            </div>
			<div className="room-requests">
				{/* room_requests.map((u)=>{
					return (
						<div className="recent-user">
							<div className="friend-img"><img src={ u.profile_img != null ? "/images/users/"+u.profile_img : "/images/users/profile_img.png"} /></div>
							<div className="friend-name">{ u.username }</div>
							<div className="accept-btn" user_id={u.user_id} onClick={ accept } >accept <i aria-hidden className="fas fa-user-plus"></i></div>
							<div className='remove-btn' user_id={u.user_id} onClick={ refuse } >remove <i aria-hidden className="fas fa-user-times"></i></div>
						</div>
					)
				})*/}
			</div>
            
			<Footer />

        </div>

		
		
        <Script src="https://kit.fontawesome.com/8a452308ed.js" crossorigin="anonymous"></Script>
		<Script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></Script>
    </div>
  )
}

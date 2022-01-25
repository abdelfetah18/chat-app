import Head from 'next/head'
import Nav from '../components/nav';
import Link from "next/link";
import Script from 'next/script';
import Footer from '../components/footer';

export async function getServerSideProps(context) {
    var { req,res } = context;
    var { cookies } = req;
    var { access_token } = cookies;
    const friends_request = await fetch("http://127.0.0.1:3000/api/user/friend_request",{method:"POST",headers: {'Content-Type': 'application/json'},body:JSON.stringify({access_token})});
    const friends = await friends_request.json();
    return { props: { friends:friends.requests }}
}

export default function Home({ friends }) {

	function accept(e){
		var user_id = e.target.getAttribute("user_id");
		$.ajax({
			type : "POST",
			contentType : "application/json",
			url : "/api/user/friend_request/accept",
			data : JSON.stringify({user_id}),
			dataType : 'json',
			success : (data)=>{
				if(data.status == 'success'){
					$(".alert-danger").fadeOut(100);
					$(".alert-success").fadeIn(500);
				}else{
					$(".wrong").fadeOut(100);
					$(".wrong")[0].innerText = data.message;
					$(".wrong").fadeIn(500);
				}
			},
			error : function(e) {
				alert("Error!")
				console.log("ERROR: ", e);
			}
		});
	}

	function refuse(e){
		var user_id = e.target.getAttribute("user_id");
		$.ajax({
			type : "POST",
			contentType : "application/json",
			url : "/api/user/friend_request/refuse",
			data : JSON.stringify({user_id}),
			dataType : 'json',
			success : (data)=>{
				if(data.status == 'success'){
					$(".alert-danger").fadeOut(100);
					$(".alert-success").fadeIn(500);
				}else{
					$(".wrong").fadeOut(100);
					$(".wrong")[0].innerText = data.message;
					$(".wrong").fadeIn(500);
				}
			},
			error : function(e) {
				alert("Error!")
				console.log("ERROR: ", e);
			}
		});
	}
  
  return (
    <div className="App">
      <Head>
		<title>Friends</title>
		<style type="text/css">{`
			.friend-name {
				float: left;
				color: white;
				font-weight: bold;
				font-size: 20px;
				height: 100%;
				display: grid;
				align-items: center;
				margin-left: 15px;
			}

			.friend-name a {
				text-decoration: none;
				color: white;
			}

			.friend-add-btn {
				float: right;
				color: white;
				font-weight: bold;
				font-size: 20px;
				text-transform: uppercase;
				height: 100%;
				display: grid;
				align-items: center;
				margin-left: 15px;
			}



			.accept-btn {
				color: white;
				font-weight: bold;
				font-size: 1rem;
				transition: 1s;
				padding: 10px;
				place-self: center;
				background-color: #24a5e3de;
				border-radius: 5px;
			}

			.accept-btn:hover {
				cursor: pointer;
			}

			.remove-btn {
				color: #c5c5c5;
				font-weight: bold;
				font-size: 1rem;
				transition: 1s;
				padding: 10px;
				place-self: center;
				border-radius: 5px;
				margin: 5px;
				border: 0.5px solid;
			}
			
			.remove-btn:hover {
				cursor: pointer;
			}
		`}
		</style>
      </Head>
      <Nav />
		
    <div className="container">
        <div className="online-friends">
            <div className="head">Friend Requests:</div>
            <ul>
                { friends.map((friend)=>{
                    return(
                    <li key={friend.user_id}>
                        <div className="friend-img"><img src={ friend.profile_img != null ? "/images/users/"+friend.profile_img : "/images/users/profile_img.png"} /></div>
                        <div className="friend-name">{ friend.username }</div>
                        <div className="accept-btn" user_id={friend.user_id} onClick={ accept } >accept <i className="fas fa-user-plus"></i></div>
                        <div className='remove-btn' user_id={friend.user_id} onClick={ refuse } >remove <i className="fas fa-user-times"></i></div>
                    </li>
                    )
                })}
            </ul>
        </div>
    </div>
    <Footer />
	  
	<Script src="https://kit.fontawesome.com/8a452308ed.js" crossOrigin="anonymous"></Script>
	<Script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></Script>
    
  </div>
  )
}

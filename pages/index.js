import Head from 'next/head'
import Nav from '../components/nav';
import Link from "next/link";
import Script from 'next/script';
import Footer from "../components/footer";

export async function getServerSideProps(context) {
  var { req,res } = context;
  var { cookies } = req;
  var { access_token } = cookies;
  const auth = await fetch("http://127.0.0.1:3000/api/auth",{method:"POST",headers: {'Content-Type': 'application/json'},body:JSON.stringify({access_token})});
  const data = await auth.json();
  const rooms_request = await fetch("http://127.0.0.1:3000/api/room/top",{method:"POST",headers: {'Content-Type': 'application/json'},body:JSON.stringify({access_token})});
  const rooms = await rooms_request.json();
  const users_request = await fetch("http://127.0.0.1:3000/api/user/may_know",{method:"POST",headers: {'Content-Type': 'application/json'},body:JSON.stringify({access_token})});
  const users = await users_request.json();
  
  if(!data){
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      }
    }
  }else{
    if(data.data.length > 0){
      var { user_id } = data.data[0];
      const get_online_friends = await fetch("http://127.0.0.1:3000/api/user/online_friends",{method:"POST",headers: {'Content-Type': 'application/json'},body:JSON.stringify({user_id})});
      const online_friends = await get_online_friends.json() 
      return { props: { online_friends:online_friends.data,rooms:rooms.rooms,users:users.users }}
    }else{
      return {
        redirect: {
          destination: '/login',
          permanent: false,
        }
      }
    }
  }
}

export default function Home({ online_friends,rooms,users }) {
  function addFriend(e){
    var request_user_id = e.target.getAttribute("user_id");
    $.ajax({
        type : "POST",
        contentType : "application/json",
        url : "/api/user/friend_request/send",
        data : JSON.stringify({request_user_id}),
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

  function sendRequest(e){
    var room_id = e.target.getAttribute("room_id");
    $.ajax({
      type : "POST",
      contentType : "application/json",
      url : "/api/room/requests/send",
      data : JSON.stringify({room_id}),
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
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"/>
        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.6.1/css/all.css" integrity="sha384-gfdkjb5BdAXd+lj+gudLWI+BXq4IuLW5IT+brZEZsLFm++aCMlF1V92rMkPaX4PP" crossOrigin="anonymous"/>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" integrity="sha384-JcKb8q3iqJ61gNV9KGb8thSsNjpSL0n8PARn9HuZOnIxN0hoP+VmmDGMN5t9UJ0Z" crossOrigin="anonymous"/>
        <link rel="stylesheet" type="text/css" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" crossOrigin="anonymous"/>
        <title>Home</title>
      </Head>
      <Nav />
    
    <div className="container">
      <div className="home-box">
      <div className="room-suggestions">
        <div className="head">Rooms You May Join:</div>
        <ul>
        {
          rooms.map((room)=>{
            return (
              <li key={room.room_id} >
                <div className="room-img"><img src={ room.profile_img != null ? "/images/rooms/"+room.profile_img : "/images/rooms/profile_img.png"} /></div>
                <div className="room-name">{room.name}</div>
                <div className="room-join-btn" room_id={room.room_id} onClick={ sendRequest }><i room_id={room.room_id} aria-hidden className="fas fa-sign-in-alt"></i></div>
              </li>
            )
          })}
        </ul>
      </div>
      <div className="friends-suggestions">
        <div className="head">Friends You May Know:</div>
        <ul>
          { users.map((user)=>{
            return (
              <li key={user.user_id}>
                <div className="friend-img"><img src={ user.profile_img != null ? "/images/users/"+user.profile_img : "/images/users/profile_img.png"}/></div>
                <div className="friend-name">{ user.username }</div>
                <div className="friend-add-btn" user_id={ user.user_id } onClick={ addFriend } ><i user_id={ user.user_id } aria-hidden className="fas fa-plus"></i></div>
              </li>
            )
          }) }
        </ul>
      </div>
    </div>
    <aside>
      <div className="online-friends">
        <div className="head">Online Friends:</div>
        <ul>
          {
          online_friends.map((friend)=>{
            return (
              <li key={friend.user_id} >
                <div className="friend-img"><img src={ friend.profile_img != null ? "/images/users/"+friend.profile_img : "/images/users/profile_img.png"} /></div>
                <div className="friend-name"><Link href={"/dm/"+friend.username} >{friend.username}</Link></div>
              </li>
            )
          })}
        </ul>
      </div>
    </aside>
    </div>

    <Footer />
    <Script src="https://kit.fontawesome.com/8a452308ed.js" crossOrigin="anonymous"></Script>
    <Script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></Script>
  </div>
  )
}

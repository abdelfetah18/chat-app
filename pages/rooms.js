import Head from 'next/head'
import Nav from '../components/nav';
import Link from "next/link";
import Script from 'next/script';
import Footer from '../components/footer';

export async function getServerSideProps(context) {
    var { req,res } = context;
    var { cookies } = req;
    var { access_token } = cookies;
    const rooms_request = await fetch("http://127.0.0.1:3000/api/rooms",{method:"POST",headers: {'Content-Type': 'application/json'},body:JSON.stringify({access_token})});
    const rooms = await rooms_request.json();

	const user_request = await fetch("http://127.0.0.1:3000/api/user",{method:"POST",headers: {'Content-Type': 'application/json'},body:JSON.stringify({access_token})});
    const user = await user_request.json();

	console.log(user)
    return { props: { rooms:rooms.rooms,user:user.user }}
}

export default function Home({ rooms,user }) {
  
  return (
    <div className="App">
      <Head>
      	<title>Rooms</title>
		<style type="text/css">{`
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

			

			.head {
				font-size: 3rem;
				font-weight: bold;
				box-shadow: 0 0 10px;
				padding: 10px;
				width: 100%;
			}
			.online-friends {
				width: 100%;
				display: grid;
				justify-content: center;
				justify-items: center;
				margin-top: 1em;
			}

			.online-friends ul {
				display: grid;
				justify-items: center;
				padding: 0;
				width: 100%;
			}

			.online-friends ul li {
                display: flex;
                width: 100%;
                background-color: #007a80;
                box-shadow: 0 0 5px;
                margin: 5px;
                padding: 10px;
                flex-direction: row;
                justify-content: space-between;
            }

			aside {
				float: right;
				display: grid;
				justify-items: center;
				justify-content: center;
				width: 45%;
				background-color: #e7e7e7;
				box-shadow: 0 0 5px;
				margin: 10px;
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

			.friend-img {
				float: left;
				box-shadow: 0 0 10px;
				object-fit: cover;
				border-radius: 50%;
				height: 50px;
				width: 50px;
			}

			.friend-img img {
				height: 100%;
				width:100%;
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

            .room-status {
                color: white;
                align-self: center;
                font-size: 1.5rem;
            }
		`}
		</style>
    </Head>
	<Nav />
		
    <div className="container">
        <div className="online-friends">
            <div className="head">Rooms:</div>
            <ul>
                { rooms.map((room)=>{
                    return(
                    <li key={room.room_id}>
                        <div className="friend-img"><img src={ room.profile_img != null ? "/images/rooms/"+room.profile_img : "/images/rooms/profile_img.png"} /></div>
                        <div className="friend-name"><a href={'/room/'+room.room_id }>{ room.name }</a></div>
                        <div className='room-status'>{ room.status == 'request' && room.user_id == user.user_id ? (<i className="fas fa-user-clock"></i>) : "" }</div>
                    </li>
                    )
                })}
            </ul>
        </div>
    </div>
    
	<Footer />

    <Script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></Script>
	<Script src="https://kit.fontawesome.com/8a452308ed.js" crossOrigin="anonymous"></Script>
  </div>
  )
}

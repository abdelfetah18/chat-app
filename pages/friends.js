import Head from 'next/head'
import Nav from '../components/nav';
import Link from "next/link";
import Script from 'next/script';
import Footer from '../components/footer';

export async function getServerSideProps(context) {
    var { req,res } = context;
    var { cookies } = req;
    var { access_token } = cookies;
    const friends_request = await fetch("http://127.0.0.1:3000/api/user/friends",{method:"POST",headers: {'Content-Type': 'application/json'},body:JSON.stringify({access_token})});
    const friends = await friends_request.json();
    return { props: { friends:friends.friends }}
}

export default function Home({ friends }) {
  
  return (
    <div className="App">
      <Head>
      	<title>Friends</title>
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
				width: 100%;
				background-color: #007a80;
				box-shadow: 0 0 5px;
				margin: 5px;
				padding: 10px;
				cursor:pointer;
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
		`}
		</style>
    </Head>
	<Nav />
		
    <div className="container">
        <div className="online-friends">
            <div className="head">Friends:</div>
            <ul>
                { friends.map((friend)=>{
                    return(
						<Link key={friend.user_id} href={"/chat/"+friend.user_id}>
							<li  >
								<div className="friend-img"><img src={ friend.profile_img != null ? "/images/users/"+friend.profile_img : "/images/users/profile_img.png"} /></div>
								<div className="friend-name">{ friend.username }</div>
							</li>
						</Link>
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

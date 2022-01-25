export async function getServerSideProps({ params,req,res }) {

	var { cookies } = req;
    var { access_token } = cookies;
	const recent_chat_req = await fetch("http://127.0.0.1:3000/api/user/chat/recent",{method:"POST",headers: {'Content-Type': 'application/json'},body:JSON.stringify({access_token})});
    const recent_chat = await recent_chat_req.json();
	console.log(recent_chat)

	if(recent_chat.recent_chat.length > 0){
		return {
			redirect: {
			destination: '/chat/'+recent_chat.recent_chat[0].user_id,
			permanent: false,
			}
		}
	}else{
		return {
			redirect: {
			destination: '/friends/',
			permanent: false,
			}
		}
	}
}

export default function Home() {
    return(
        <h1>Welcom To My Chat App!</h1>
    )
}
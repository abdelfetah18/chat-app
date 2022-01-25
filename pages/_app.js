import '../styles/globals.css';
//import { Server } from 'socket.io';

export async function getServerSideProps(cx){
  console.log(cx);
}


function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}

export default MyApp

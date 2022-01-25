export async function getServerSideProps(context) {
    return {
        redirect: {
        destination: '/',
        permanent: false,
        }
    }
}

export default function Home() {
    return(
        <h1>Welcom To My Chat App!</h1>
    )
}
import Head from 'next/head'
import Link from "next/link";
import Script from 'next/script';

export async function getServerSideProps(context) {
  var { req,res } = context;
  var { cookies } = req;
  var { access_token } = cookies;
  const auth = await fetch("http://127.0.0.1:3000/api/auth",{method:"POST",headers: {'Content-Type': 'application/json'},body:JSON.stringify({access_token})});
  const data = await auth.json();
  
  if(!data){
    return { props:{}}
  }else{
    return {
      redirect: {
        destination: '/',
        permanent: false,
      }
    }
  }
}

export default function Home() {
  return (
    <div className='bg'>
        <Head>
            <meta charset="utf-8"/>
            <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"/>

            <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.6.1/css/all.css" integrity="sha384-gfdkjb5BdAXd+lj+gudLWI+BXq4IuLW5IT+brZEZsLFm++aCMlF1V92rMkPaX4PP" crossOrigin="anonymous"/>

            <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" integrity="sha384-JcKb8q3iqJ61gNV9KGb8thSsNjpSL0n8PARn9HuZOnIxN0hoP+VmmDGMN5t9UJ0Z" crossOrigin="anonymous"/>

            <link rel="stylesheet" type="text/css" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" crossOrigin="anonymous"/>

            <style type="text/css">
                {`.bg{ margin: 0; padding: 0; background-color: #f0f2f5; height:100vh; }
                .formdiv{ background-color: white; }`}
            </style>

            <title>Login !</title>

            

        </Head>
        <div className="row align-items-center justify-content-center h-100">
            <div className="col-lg-6 ml-auto mr-auto p-5">
                <div className="col-lg-6 float-left mt-5">
                    <h1 className="text-primary"><b>Chat App</b></h1>
                    <h3>Welcom to my chat app!</h3>
                </div>
                <div className="shadow col-lg-6 float-right border p-5 rounded formdiv">
                    <form method="post">
                      <div className="form-group">
                        <input type="text" id="username" className="form-control" name="username" aria-describedby="emailHelp" placeholder="Enter your email or password"/>
                      </div>
                      <div className="form-group">
                        <input type="password" id="password" className="form-control" name="password" placeholder="Password"/>
                      </div>
                        <div className="alert alert-success" style={{display: "none"}} role="alert">
                            Login Success!
                        </div>
                        <div className="alert alert-danger wrong" style={{display: "none"}} role="alert"></div>
                      <button type="submit" className="btn btn-primary w-100"><b>Log in</b></button>
                      <hr/>
                      <a href="/register" className="btn btn-success w-100"><b>Create a New Account</b></a>
                    </form>
                </div>
            </div>
        </div>
        <Script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></Script>
        <Script src="https://kit.fontawesome.com/8a452308ed.js" crossOrigin="anonymous"></Script>
        <Script type="text/javascript" src="/js/l.js"></Script>
    </div>
  )
}

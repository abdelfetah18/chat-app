import Head from 'next/head'
import Cookies from 'universal-cookie';
import Link from "next/link";
import Script from 'next/script';

export default function Home() {
    function Submit(e){
        var cookies = new Cookies();
        var access_token = cookies.get('access_token');
        var name = $('#room-name')[0].value;
        if(name == ""){
            $(".wrong").fadeOut(100);
            $(".wrong")[0].innerHTML = "You must enter a name !";
            $(".wrong").fadeIn(500);
        }else{
            var formData = {name,access_token}
            e.preventDefault();
            

            $.ajax({
                type : "POST",
                contentType : "application/json",
                url : "/api/room/create",
                data : JSON.stringify(formData),
                dataType : 'json',
                success : (data)=>{
                    if(data.status == 'success'){
                        $(".alert-danger").fadeOut(100);
                        $(".alert-success").fadeIn(500);
                        setTimeout(()=>{ window.location.pathname='/room/setup/'+data.name ; }, 1000);
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
        return false;
    }
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

            <title>Create a Room</title>


        </Head>
        <div className="row align-items-center justify-content-center h-100">
            <div className="col-lg-6 ml-auto mr-auto">
                <div className="col-lg-6 float-left mt-5">
                    <h1 className="text-primary"><b>Chat App</b></h1>
                    <h3>Welcom to my chat app!</h3>
                </div>
                <div className="shadow col-lg-6 float-right border p-5 rounded formdiv">
                    <form method="post" onSubmit={Submit}>
                        <div className="form-group">
                            <input type="text" id="room-name" className="form-control" name="name" aria-describedby="emailHelp" placeholder="room name"/>
                        </div>
                        <div className="alert alert-success" style={{display: "none"}} role="alert">
                            Create Success!
                        </div>
                        <div className="alert alert-danger wrong" style={{display: "none"}} role="alert"></div>
                      <button type="submit" className="btn btn-primary w-100"><b>Create</b></button>
                      <hr/>
                      <Link href="/register" className="btn btn-success w-100"><b>Join a room</b></Link>
                    </form>
                </div>
            </div>
        </div>
        <Script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></Script>
        <Script src="https://kit.fontawesome.com/8a452308ed.js" crossOrigin="anonymous"></Script>

    </div>
  )
}

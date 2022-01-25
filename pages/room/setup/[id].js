import Head from 'next/head'
import Cookies from 'universal-cookie';
import Link from "next/link";
import Script from 'next/script';

export async function getServerSideProps({ params,req,res }){
    var { cookies } = req;
    var { access_token } = cookies;
    const room_req = await fetch("http://127.0.0.1:3000/api/room/"+params.id,{method:"POST",headers: {'Content-Type': 'application/json'},body:JSON.stringify({access_token})});
    const room = await room_req.json() 
    if(room.status == "success"){
      return { props:{ room:room.room } }
    }else{ 
      return {
        redirect: {
          destination: '/',
          permanent: false
        }
      }
    }  
}

export default function Home( { room } ) {
  function edit_name(e){
    $(".room_name")[0].style.display = "none";
    $("#room_name")[0].style.display = "block";
    $("#room_name_save_btn")[0].style.display = "block"; 
  }

  function save_name(e){
    var newName =  $("#room_name")[0].value;
    $("#room_name")[0].style.display = "none";
    $("#room_name_save_btn")[0].style.display = "none"; 
    $(".room_name")[0].innerText = newName;
    $(".room_name")[0].style.display = "block";
    var fd = new FormData();
    fd.append("name",newName);
    fd.append("room_id",$("#room_id")[0].value);
    $.ajax({
      type : "POST",
      contentType : false,
      processData:false,
      url : "/api/room/edit",
      data : fd,
      success : (data)=>{
        if(data.status == 'success'){
          $(".alert-danger").fadeOut(100);
          $(".alert-success")[0].innerText = "Room Name Updated Successfuly!";
          $(".alert-success").fadeIn(500);
          $(".alert-success").fadeOut(3000);
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

  function upload_cover_img(e){
    console.log(e.target.files);
    var fd = new FormData();
    fd.append("file",e.target.files[0]);
    fd.append("room_id",$("#room_id")[0].value);
    $.ajax({
      type : "POST",
      contentType : false,
      processData:false,
      url : "/api/room/upload?type=cover",
      data : fd,
      success : (data)=>{
        console.log(data)
        if(data.status == 'success'){
          $(".alert-danger").fadeOut(100);
          $(".alert-success")[0].innerText = "Room Cover Image Uploaded Successfuly!";
          $(".alert-success").fadeIn(500);
          $(".cover_img")[0].src = "/images/rooms/"+data.name;
          $(".alert-success").fadeOut(3000);
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

  function upload_profile_img(e){
    console.log(e.target.files[0]);
    var fd = new FormData();
    fd.append("file",e.target.files[0]);
    fd.append("room_id",$("#room_id")[0].value);
    $.ajax({
      type : "POST",
      contentType : false,
      processData:false,
      url : "/api/room/upload?type=profile",
      data : fd,
      success : (data)=>{
        if(data.status == 'success'){
          $(".alert-danger").fadeOut(100);
          $(".alert-success")[0].innerText = "Room Profile Image Uploaded Successfuly!";
          $(".alert-success").fadeIn(500);
          $(".profile_img")[0].src = "/images/rooms/"+data.name;
          $(".alert-success").fadeOut(3000);
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

  function Continue(e){
    e.preventDefault();
    window.location.pathname = "/room/"+room.id;
    return false;
  }

  return (
    <div className='bg'>
        <Head>
            <meta charSet="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"/>

            <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.6.1/css/all.css" integrity="sha384-gfdkjb5BdAXd+lj+gudLWI+BXq4IuLW5IT+brZEZsLFm++aCMlF1V92rMkPaX4PP" crossOrigin="anonymous"/>

            <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" integrity="sha384-JcKb8q3iqJ61gNV9KGb8thSsNjpSL0n8PARn9HuZOnIxN0hoP+VmmDGMN5t9UJ0Z" crossOrigin="anonymous"/>

            <link rel="stylesheet" type="text/css" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" crossOrigin="anonymous"/>

            <style type="text/css">
                {`.bg{ margin: 0; padding: 0; background-color: #f0f2f5; height:100vh; }
                .formdiv{ background-color: white; }
                .change_profile_img {
                  margin-left: auto;
                  margin-right: auto;
                  margin-top: -40px;
                  border: 0.5px solid white;
                  border-radius: 50%;
                  font-size: 1.3em;
                  width: 40px;
                  height: 40px;
                  padding: 5px;
                  background-color: white;
                  text-align: center;
                  position: relative;
                  left: 49px;
                  top: -10px;
              }
              .room_name{
                font-size: 2rem;
                font-weight: bold;
                text-transform: capitalize;
              }
              .change_cover_img {
                margin-top: -35px;
                background-color: gray;
                height: 35px;
                text-align: center;
                font-size: 15px;
                color: white;
                border-top-right-radius: 5px;
                padding: 7px;
                transition:0.5s;
              }
              .change_cover_img:hover {
                background-color: red;
                cursor: pointer;
              }

              .change_profile_img {
                margin-left: auto;
                margin-right: auto;
                margin-top: -40px;
                border: 2px solid white;
                border-radius: 50%;
                font-size: 22px;
                width: 55px;
                height: 55px;
                padding: 12px;
                background-color: gray;
                text-align: center;
                position: relative;
                color: white;
                left: 49px;
                top: -10px;
                transition:0.5s;
              }
              .change_profile_img:hover {
                background-color: red;
                cursor: pointer;
              }

              .edit_name {
                font-size: 22px;
                cursor: pointer;
                color: blue;
                transition: 0.5s;
              }
              .edit_name:hover{
                color:red;
              }
              #room_name {
                margin-left: auto;
                margin-right: auto;
              }
              #room_name_save_btn{
                display:none;
                margin-left: auto;
                margin-right: auto;
                margin-top: 5px;
                margin-bottom: 5px;
              }

              .profile_img {
                object-fit: cover;
                width: 15vw;
                height: 15vw;
                filter: drop-shadow(0px 0px 10px black);
              }
              `}
            </style>

            <title>{ room.name }</title>


        </Head>
        
        <input type="hidden" value={ room.id } id="room_id" />
        <div className="row align-items-center justify-content-center h-100">
            <div className="col-lg-6 ml-auto mr-auto">
                <div className="col-lg-12  mt-5">
                    <h1 className="text-primary"><b>Chat App</b></h1>
                    <h3>Welcom to my chat app!</h3>
                </div>
                <div className="shadow col-lg-12  border p-5 rounded formdiv">
                    <form method="post" >
                      <div className='row'>
                        <img src={ room.cover_img != null ? "/images/rooms/"+room.cover_img : "/images/rooms/cover_img.png"} className="card-img-top cover_img" alt="..."/>
                        <div className='change_cover_img' onClick={()=>{ document.getElementById("cover_img").click(); }} ><i className="fas fa-images"></i> change cover image</div>
                        <input type="file" id="cover_img" onChange={ upload_cover_img } style={{display:"none"}}/>
                      </div>
                      <div className='row mx-auto align-items-end col-lg-5' style={{top: "-8vw"}}>
                        <img src={ room.profile_img != null ? "/images/rooms/"+room.profile_img : "/images/rooms/profile_img.png"} className="rounded-circle card-img-top profile_img" alt="..."/>
                        <div className='change_profile_img' onClick={()=>{ document.getElementById("profile_img").click(); }}><i className="fas fa-images"></i></div>
                        <input type="file" id="profile_img" onChange={ upload_profile_img } style={{display:"none"}}/>
                      </div>
                      <div className='text-center' style={{marginTop: "-7vw"}}>
                        <input type="text" name="room_name" id="room_name" defaultValue={ room.name } style={{ display:"none" }} />
                        <button type="button" id="room_name_save_btn" className="btn btn-info" onClick={save_name}>Save</button>
                        <div className='room_name'>{ room.name }</div><i className="edit_name fas fa-edit" onClick={edit_name}></i></div>
                        <div className="alert alert-success" style={{display: "none"}} role="alert">
                          Upload Success!
                        </div>
                        <div className="alert alert-danger wrong" style={{display: "none"}} role="alert"></div>
                      <button type="submit" onClick={ Continue } className="mt-5 btn btn-primary w-100"><b>Continue</b></button>
                      <hr/>
                      <Link href={ "/room/"+room.id } className="btn btn-success w-100"><b>Skip</b></Link>
                    </form>
                </div>
            </div>
        </div>
        <Script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></Script>
        <Script src="https://kit.fontawesome.com/8a452308ed.js" crossOrigin="anonymous"></Script>

    </div>
  )
}

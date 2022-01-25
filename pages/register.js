import Head from 'next/head'
import Image from 'next/image'
import { useState } from 'react';
import styles from '../styles/Home.module.css'
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

function getDays(month,year){
    if(month == "February"){
        if(year % 4 == 0){
            var days = [];
            for(var i=1;i<30;i++){
                days.push(i.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false }));
            }
            return days;
        }else{
            var days = [];
            for(var i=1;i<29;i++){
                days.push(i.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false }));
            }
            return days;
        }
    }else if(month == "January" || month == "March" || month == "May" || month == "July" || month == "August" || month == "October" || month == "December"){
        var days = [];
        for(var i=1;i<32;i++){
            days.push(i.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false }));
        }
        return days;
    }else{
        var days = [];
        for(i=1;i<31;i++){
            days.push(i.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false }));
        }
        return days;
    }
}

function init(){
    var mounths = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    var years = [];
    var now = new Date().getFullYear();
    for(var i=1933;i<now+1;i++){ years.push(i.toLocaleString('en-US', { minimumIntegerDigits: 4, useGrouping: false }))}; 
    return { mounths,years }
}

var birthday_data = init();

export default function Register() {
    var now = new Date().getFullYear();
    var [day,set_day] = useState("01");
    var [month,set_month] = useState("January");
    var [year,set_year] = useState(now);

    /*document.querySelector(".day")[0].onclick = (e)=>{
        alert(year)
    }*/
    
    /*document.querySelector(".year").onchange = (e)=>{
        set_mounth(e.target.value);
    }*/

    return (
    <div className='bg'>
        <Head>
        <meta charSet="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"/>

        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.6.1/css/all.css" integrity="sha384-gfdkjb5BdAXd+lj+gudLWI+BXq4IuLW5IT+brZEZsLFm++aCMlF1V92rMkPaX4PP" crossOrigin="anonymous"/>

        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" integrity="sha384-JcKb8q3iqJ61gNV9KGb8thSsNjpSL0n8PARn9HuZOnIxN0hoP+VmmDGMN5t9UJ0Z" crossOrigin="anonymous"/>

        <link rel="stylesheet" type="text/css" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" crossOrigin="anonymous"/>

        <style type="text/css">
        {`.bg{
            margin: 0;
            padding: 0;
            background-color: #f0f2f5;
            height:100vh;
        }
        .formdiv{
            background-color: white;
        }`}
        </style>

        <title>Register !</title>

        

        </Head>
        
        <div className="row align-items-center justify-content-center h-100">
            <div className="col-lg-6 ml-auto mr-auto p-5">
                <div className="col-lg-6 float-left mt-5">
                    <h1 className="text-primary"><b>Chat App</b></h1>
                    <h3>Welcom to my chat app!</h3>
                </div>
                <div className="col-lg-6 float-right border p-5 rounded formdiv">
                    <div className="alert alert-danger" style={{display: "none"}} role="alert">
                      You Must Fill all the data !
                    </div>
                    <form>
                        <div className="row form-group">
                            <input type="text" name="username" id="username" className="form-control" aria-describedby="username" placeholder="Enter username"/>
                        </div>
                        <div className="row form-group">
                            <input type="email" id="email" name="email" className="form-control" aria-describedby="emailHelp" placeholder="Enter email"/>
                        </div>
                        <div className="row form-group">
                            <div className="col">
                                 <select  onChange={ (e)=>{ e.target.blur(); set_day(e.target.value); } } onFocus={ (e)=>{ e.target.innerHTML = (getDays(month,year).map((i)=>("<option  key='"+i+"'>"+i+"</option>"))).join(""); e.target.value=day; } } name="day" id="day" className="custom-select">
                                </select>
                            </div>
                            <div className="col">
                                <select onChange={(e)=>{set_month(e.target.value);}} name="month" id="month" className="custom-select" >
                                { birthday_data.mounths.map((i,index)=> (<option key={index} value={(index+1).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })}>{i}</option>) )}    
                                </select>
                            </div>
                            <div className="col">
                                <select onChange={(e)=>{set_year(e.target.value);}} name="year" id="year" className="custom-select">
                                    { birthday_data.years.map((i)=> (<option  key={i} value={i}>{i}</option>) )} 
                                    
                                </select>
                            </div>
                        </div>
                        <div className="form-group">
                            <select name="gender" id="gender" className="gender custom-select">
                                <option value="Gender">Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                        </div>
                        
                        
                        <div className="form-group">
                            <input type="password" name="password" id="password" className="form-control"  placeholder="Password"/>
                        </div>
                        <div className="alert alert-success" style={{display: "none"}} role="alert">
                            Registration Success!
                        </div>
                        <button type="submit" id="regbtn" className="btn btn-primary w-100"><b>Create a New Account</b></button>
                        <hr/>
                        <a href="/login" className="btn btn-success w-100"><b>Log in</b></a>
                    </form>
                </div>
            </div>
        </div>
        <Script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></Script>
        <Script src="https://kit.fontawesome.com/8a452308ed.js" crossOrigin="anonymous"></Script>
        <Script type="text/javascript" src="/js/r.js"></Script>
    </div>
  )
}

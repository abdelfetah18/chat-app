import Link from "next/link";

function Nav(){
    function dropDown(e){
        if($(".more-list")[0].style.display == 'block'){
            $("#more")[0].style.width = "100px";
            $(".drop-down")[0].style.width = "100px";
            $(".more-list").fadeOut(500);
        }else{
            $("#more")[0].style.width = "200px";
            $(".drop-down")[0].style.width = "200px";
            $(".more-list").fadeIn(500);
        }
        
    }

    function openNav(e){
        if(!($("nav .nav_ul")[0].style.display) || $("nav .nav_ul")[0].style.display == "none"){
            $("nav .nav_ul").fadeIn();
            $("nav .nav_ul")[0].style.display = "flex";
        }else{
            $("nav .nav_ul").fadeOut();
        }
    }
    return(
        <nav>
            <div className="logo">Chat App</div>
            <div className="open-nav" onClick={openNav}>☰</div>
            <ul className='nav_ul'>
                <li> <Link href="/home">Home</Link></li>
                <li><Link href="/chat">chat</Link></li>
                <li><Link href="/friend_requests">friend-requests</Link></li>
                <li className='drop-down'>
                <button id="more" onClick={dropDown}>More <i aria-hidden className="fas fa-chevron-down"></i></button>
                <div className='more-list'>
                    <ul>
                        <li><Link href="/friends">friends</Link></li>
                        <li><Link href="/rooms">rooms</Link></li>
                        <li><Link href="/room/create">create-room</Link></li>
                    </ul>
                </div>
                </li>
            </ul>
            </nav>
    );
}

export default Nav;
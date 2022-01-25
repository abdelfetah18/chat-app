$('form').submit((e)=>{
	var day = $('#day')[0].value;
	var month = $('#month')[0].value;
	var year = $('#year')[0].value;
	var birthdate = [day,month,year].join("/");
	var gender = $('#gender')[0].value;
	var email = $('#email')[0].value;
	var username = $('#username')[0].value;
	var password = $('#password')[0].value;
	if(day == "day" || month == "month" || year == "year" ||email == "" || username == "" || password == "" ){
		$(".alert-danger").innerText = "You Must Fill all the data !";
		$(".alert-danger").fadeOut(100);
		$(".alert-danger").fadeIn(500);
	}else{
		var formData = {
			birthdate,
			gender,
			email,
			username,
			password
		}
		e.preventDefault();
		

		$.ajax({
		type : "POST",
		contentType : "application/json",
		url : "/api/auth/new_user",
		data : JSON.stringify(formData),
		dataType : 'json',
		success : (data)=>{
			if(data.status == 'success'){
				$(".alert-danger").fadeOut(100);
				$(".alert-success").fadeIn(500);
				setTimeout(()=>{ window.location.pathname='/login'; }, 3000);
			}else{
				$(".alert-danger")[0].innerText = data.err != undefined ? (data.err.map( (i)=> { return (Object.values(i)) } )).join(" and ") : data.message;
				$(".alert-danger").fadeOut(100);
				$(".alert-danger").fadeIn(500);
			}
		},
		error : function(e) {
			alert("Error!")
			console.log("ERROR: ", e);
		}
		
		});
	}
	return false;

	
});
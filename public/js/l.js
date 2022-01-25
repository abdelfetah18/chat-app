$('form').submit((e)=>{
			var username = $('#username')[0].value;
			var password = $('#password')[0].value;

			if(username == "" || password == "" ){
				$(".wrong").fadeOut(100);
				$(".wrong")[0].innerHTML = "You must fill all the data !";
				$(".wrong").fadeIn(500);
			}else{
				var formData = {
					username:username,
					password:password
				}
				e.preventDefault();
				

				$.ajax({
				type : "POST",
				contentType : "application/json",
				url : "/api/auth/sign_in",
				data : JSON.stringify(formData),
				dataType : 'json',
				success : (data)=>{
					if(data.status == 'success'){
						$(".alert-danger").fadeOut(100);
						$(".alert-success").fadeIn(500);
						setTimeout(()=>{ window.location.pathname='/'; }, 1000);
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

			
		});
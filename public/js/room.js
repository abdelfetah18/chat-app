$('form').submit((e)=>{
			var name = $('#room-name')[0].value;

			if(name == ""){
				$(".wrong").fadeOut(100);
				$(".wrong")[0].innerHTML = "You must enter a name !";
				$(".wrong").fadeIn(500);
			}else{
				var formData = {
					name
				}
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
						setTimeout(()=>{ window.location.pathname='/room/setup'; }, 1000);
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
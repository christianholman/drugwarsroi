$(document).ready(()=>{

	updateROI("luxio")

	$( "#search-form" ).submit(( event ) => {
	  updateROI($("#search-user").val())
	  event.preventDefault();
	});


	function updateROI(username) {
		//No username supplied
		if(username == "") {
			alert("No username supplied")
		} else {
			steem.api.getAccountHistory(username.trim().replace("@", ""), -1, 10000, (err, result) => {
				if (err) alert (err)
				var finalSpent = 0
				var finalGained = 0
				for (var i = result.length - 1; i >= 0; i--) {
					// console.log(result[i][1].op)
					if(result[i][1].op[0] == "transfer" && (result[i][1].op[1].to=="drugwars-dealer" || result[i][1].op[1].from=="drugwars")) {
						if(result[i][1].op[1].to=="drugwars-dealer") {
							finalSpent += parseFloat(result[i][1].op[1].amount.replace(" STEEM", ""))
						} else if (result[i][1].op[1].from=="drugwars"){
							finalGained += parseFloat(result[i][1].op[1].amount.replace(" STEEM", ""))
						}
					}
				}
				$("#steem-spent").text(finalSpent.toFixed(3) + " STEEM")
				$("#steem-gained").text(finalGained.toFixed(3) + " STEEM")
	          	$("#steem-roi").text(`${(finalGained - finalSpent).toFixed(3)} (${((finalGained / finalSpent) * 100).toFixed(2)}%)`)
	          	$("#steem-roi").addClass(finalGained > finalSpent ? ()=>{ $(this).removeClass("text-red"); return "text-green"} : ()=>{$(this).removeClass("text-green"); return "text-red" })
	          	$("#stats-title").text(`Stats for ${"@"+username.trim().replace("@","")}`)
	        })
		}
	}
})


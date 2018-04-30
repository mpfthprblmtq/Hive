$(".label").on("click", function(e){
	resetAllLabels();
	var num = e.target.id;
	for(var i = num; i < 30; ++i){
		$("#" + i).css("background-color", "#FED718");
	}
	$("#offset").val(num);
});

function resetAllLabels(){
	$(".label").each(function(){
		$(this).css("background-color", "white");
	});
}

$("#modalSubmit").on("click", function(){
	resetAllLabels();
	$("#labelForm").submit();
});
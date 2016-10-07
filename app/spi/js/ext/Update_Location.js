Update_Location = function(){
	return {
		index: 0,
		name: "Update_Location",
        init: function() {}, //make this a dummy function as we shouldn't call Welcome init twice
        nextAction: function() { return true;},
		importId: '#import_update_location',
        selectorId: '.update_location',
        title: "Update Location"
	}
}();
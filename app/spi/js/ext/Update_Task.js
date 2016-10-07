Update_Task = function(){
	return {
		index: 0,
		name: "Update_Task",
        init: function() {}, //make this a dummy function as we shouldn't call Welcome init twice
        nextAction: function() { return true;},
		importId: '#import_update_task',
        selectorId: '.update_task',
        title: "Update Task"
	}
}();
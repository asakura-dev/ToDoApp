$(function(){
    ko.bindingHandlers.draggable_button = {
	init: function(element, valueAccessor, allBindings, viewModel, bindingContext){
	    // 初めて要素に対してBindingが行われた時の処理
	    var value = valueAccessor();
	    $(element).css({
		left: 390 * value() / 100 + 'px'
	    });
	    $(element).draggable({
		containment: 'parent',
		drag:function(event,ui){
		    value(Math.round(ui.position.left/390 * 100));
		},
		stop:function(event,ui){
		    // DBの更新処理(task.status)
		    $.ajax({			
			type: "PATCH",
			url: "/tasks/"+viewModel.id(),
			data: {
			    "progress":Math.round(ui.position.left/390 * 100)
			},
			success: function(data){
			    console.log(data);
			},
			error: function(){
			    console.log("エラー");
			}
		    });
		    console.log("update");
		},
		
	    });
	},
	update: function(element, valueAccessor, allBindings, viewModel, bindingContext){
	    // ビューモデルが更新された時
	}
    }

    function TasksViewModel(){
	var self = this;
	self.items = ko.observableArray();
	self.count = ko.computed(function(){
	    return self.items().length;
	});
	self.addTask = function(taskObject){
	    var t = taskObject;
	    var task = {};
	    task.id =  ko.observable(t.id);
	    task.button_id = ko.computed(function(){
		return 'button_'+task.id();
	    });
	    task.title = ko.observable(t.title);
	    task.deadline = ko.observable(t.deadline);
	    task.created_at = ko.observable(t.created_at);
	    task.description = ko.observable(t.description);
	    task.progress = ko.observable(t.progress);
	    task.status = ko.observable(t.status);
	    task.remaining_days = ko.computed(function(self){
		var end = new Date(task.deadline());
		var begin = new Date();
		var remaining_days = Math.floor((end.getTime() - begin.getTime()) / (1000 * 60 * 60 * 24)) + 1;
		if(remaining_days< 0){
		    return '(超過)';
		}else{
		    return '(残り'+ remaining_days + '日)';
		}
	    });
	    self.items.push(task);
	};
	$.ajax({
	    type: "GET",
	    url: "/tasks/",
	    dataType: "json",
	    success: function(data){
		var tasks = data.tasks;
		for(var i = 0; i < tasks.length; i++){
		    self.addTask(tasks[i]);
		}
	    }
	});
    }
    root_vm["tasks"] = new TasksViewModel();
});

// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require jquery-ui
//= require knockout
//= require_tree .

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

    function TaskFormViewModel(){
	current_date = new Date();
	var self = this;
	self.enable = ko.observable(true);
	self.today_btn = ko.observable(false);
	self.undecided_btn = ko.observable(true);
	self.day_after_field = ko.observable(false);
	self.year = ko.observable(current_date.getFullYear());
	self.month = ko.observable(current_date.getMonth() + 1);
	self.date = ko.observable(current_date.getDate());
	self.deadline = ko.computed(function(){
	    if(self.undecided_btn() == true){
		return "";
	    }else{
		return self.year()+"-"+self.month()+"-"+self.date();
	    }
	});
	self.deadline_text = ko.computed(function(){
	    if(self.undecided_btn() == true){
		return "未定";
	    }else{

		var w = ["日","月","火","水","木","金","土"];
		var d = new Date(self.year()+"/"+self.month()+"/"+self.date());
		return self.year()+"年"+self.month()+"月"+self.date()+"日"+"("+w[d.getDay()]+")";
	    }
	});
	self.day_after_val = ko.observable(0);
	self.clickToday = function(){
	    self.today_btn(true);
	    self.day_after_field(false);
	    self.undecided_btn(false);
	    self.day_after_val(0);
	    current_date = new Date();
	    self.year(current_date.getFullYear());
	    self.month(current_date.getMonth() + 1);
	    self.date(current_date.getDate());
	};
	self.clickDayAfter = function(){
	    if(self.day_after_val() < 0){
		self.day_after_val(0);
	    }
	    self.today_btn(false);
	    self.day_after_field(true);
	    self.undecided_btn(false);
	    current_date = new Date();
	    var dayOfMonth = current_date.getDate();
	    current_date.setDate(dayOfMonth - (- self.day_after_val()));
	    self.year(current_date.getFullYear());
	    self.month(current_date.getMonth() + 1);
	    self.date(current_date.getDate());
	};
	self.clickUndecided = function(){
	    self.day_after_val(0);
	    self.today_btn(false);
	    self.day_after_field(false);
	    self.undecided_btn(true);
	};
    }
    function DropDownViewModel(){
	var self = this;
	self.isActive = ko.observable(false);
	self.toggle = function(){
	    self.isActive(!self.isActive());
	};
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
    var task_form_vm = new TaskFormViewModel();
    var dropdown_vm = new DropDownViewModel();
    var tasks_vm = new TasksViewModel();
    ko.applyBindings({
	taskForm: task_form_vm,
	dropdown: dropdown_vm,
	tasks: tasks_vm
    });
    $('#new_task').on("ajax:send",function(){
	task_form_vm.enable(false);
    });
    $('#new_task').on("ajax:success",function(e,data, status, xhr){
	task_form_vm.enable(true);
	tasks_vm.addTask(data.task);
    });
});

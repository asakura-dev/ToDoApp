$(function(){
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
    self.reset = function(){
	self.clickUndecided();

    };
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
$('#new_task').on("ajax:send",function(){
    root_vm.taskForm.enable(false);
    root_vm.taskForm.reset();
});
$('#new_task').on("ajax:success",function(e,data, status, xhr){
    root_vm.taskForm.enable(true);
    root_vm.tasks.addTask(data.task);
});

root_vm["taskForm"] = new TaskFormViewModel();
});


$(function(){
    function DropDownViewModel(){
	var self = this;
	self.isActive = ko.observable(false);
	self.toggle = function(){
	    self.isActive(!self.isActive());
	};
    }
    root_vm["dropdown"] = new DropDownViewModel();
    ko.applyBindings(root_vm);
});

# Load the Rails application.
require File.expand_path('../application', __FILE__)

Time::DATE_FORMATS[:ymd] = "%Y-%m-%d"
# Initialize the Rails application.
ToDoApp::Application.initialize!


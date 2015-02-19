class StaticPagesController < ApplicationController
  def home
    if user_signed_in?
      @task = current_user.tasks.build
    end
  end
end

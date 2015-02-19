# -*- coding: utf-8 -*-
class TasksController < ApplicationController
  before_action :authenticate_user!, only: [:create]
  before_action :correct_user, only: [:edit, :show, :update, :destroy]
  def create
    # create 
    @task = current_user.tasks.build(task_params)
    @task.progress = 0
    @task.status = 0
    if @task.save
      @task
      render "create", :formats => [:json], :handlers => [:jbuilder]
    else
      redirect_to root_url
    end
  end
  def index
    @tasks =  current_user.tasks
    render "index", :formats => [:json], :handlers => [:jbuilder]
  end
  def show
    render "show", :formats => [:json], :handlers => [:jbuilder]
  end
  
  def edit
    
  end

  def update
    if params[:progress]
      @task.progress = params[:progress]
    end
    if params[:status]
      @task.status = params[:status]
    end
    if @task.save()
      @task
      render "create", :formats => [:json], :handlers => [:jbuilder]
    else
      redirect_to root_url
    end

  end
  private
  def correct_user
    @task = current_user.tasks.find_by(id: params[:id])
    redirect_to root_url if @task.nil?
  end
  def task_params
    params.require(:task).permit(:deadline, :title, :description)
  end
end

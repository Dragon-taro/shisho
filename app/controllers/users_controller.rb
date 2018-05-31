class UsersController < ApplicationController

  before_action :set_user, only: [:show, :update]
  before_action :set_is_current_user

  def index
    @users = User.all.limit(10) # @userはログインしてるユーザーを格納, @usersはuserをいっぱい入れた配列
  end

  def show
    gon.user_id = @user.id
    respond_to do |format|
      format.html
      format.json {}
    end
  end

  def update
    if @user == current_user
      @user.update(user_params)
    end
    render 'users/show.json.jbuilder'
  end

  def search
    @users = User.all.where(search_params)
  end

  private

  def set_user
    @user = User.find(params[:id])
  end

  def user_params
    params.require(:user).permit(:name, :email, :password, :description, :is_master, :goal, skills_attributes: [:id, :description, :language, :_destroy])
  end

  def search_params
    params.permit(:id)
  end

  def set_is_current_user
    @is_current_user = current_user?(@user)
  end
end
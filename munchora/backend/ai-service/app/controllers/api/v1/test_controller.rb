class Api::V1::TestController < ApplicationController
  before_action :authenticate_user!

  def test
    render json: @current_user
  end
end

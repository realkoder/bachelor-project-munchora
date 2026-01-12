class TestController < ApplicationController
  def test
    render json: { msg: 'TEST WORKS' }
  end
end

class Api::V1::LlmController < ApplicationController
  before_action :authenticate_user!

  MAX_PROMPT_LENGTH = 2000
  MAX_INSTRUCTIONS_LENGTH = 1000

  def prompt
    user_prompt = params[:prompt].to_s[0...MAX_PROMPT_LENGTH]
    user_instructions = params[:instructions].to_s[0...MAX_INSTRUCTIONS_LENGTH]

    output = Llm::LlmService.prompt_llm(current_user, user_prompt, user_instructions, false)

    render json: { data: output.choices[0].message.content }
  end
end

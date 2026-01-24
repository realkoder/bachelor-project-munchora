require 'rails_helper'

RSpec.describe Llm::LlmService, type: :service do
  # Arrange
  let(:user) { build(:current_user) }

  # Mocking OpenAI response
  let(:mock_openai_response) do
    double(
      'OpenAI::Response',
      choices: [double('Choice', message: double('Message', content: 'Supposed to be a recipe'))],
      usage: double('Usage', prompt_tokens: 100, completion_tokens: 500),
      model: 'gpt-4.1-mini'
    )
  end

  before do
    # Stubbing the OpenAI client
    allow(OpenAIClient.chat.completions).to receive(:create)
      .and_return(mock_openai_response)
  end

  describe '#generate_prompt' do
    context 'when generation is successful' do
      it 'creates string output' do
        output = Llm::LlmService.prompt_llm(user, 'Make me pasta', 'You are the best chef ever!', true)

        expect(output.choices[0].message.content).to eq('Supposed to be a recipe')
      end

      it 'logs LLM usage' do
        expect {
          Llm::LlmService.prompt_llm(user, 'Make me pasta', 'You are the best chef ever!', true)
        }.to change(LlmUsage, :count).by(1)

        usage = LlmUsage.last
        expect(usage.user_id).to eq(user.id)
        expect(usage.prompt).to eq('Make me pasta')
        expect(usage.model).to eq('gpt-4.1-mini')
        expect(usage.provider).to eq('openai')
        expect(usage.prompt_tokens).to eq(100)
        expect(usage.completion_tokens).to eq(500)
      end

      it 'calls OpenAI with correct parameters' do
        Llm::LlmService.prompt_llm(user, 'Make me pasta', 'You are the best chef ever!', true)

        expect(OpenAIClient.chat.completions).to have_received(:create).with(
          model: 'gpt-4.1-mini',
          response_format: { type: 'json_object' },
          messages: [
            { role: 'system', content: 'You are the best chef ever!' },
            { role: 'user', content: 'Make me pasta' }
          ],
          max_tokens: 2000
        )
      end
    end

    context 'when daily limit is exceeded' do
      before do
        # Create DAILY_LIMIT usage records for today
        create_list(:llm_usage, 11, user_id: user.user_id, created_at: Time.current)
      end

      it 'raises LlmUsageLimitExceeded error' do
        expect {
          Llm::LlmService.prompt_llm(user, 'Make me pasta', 'You are the best chef ever!', true)
        }.to raise_error(LlmUsageLimitExceeded, /Daily AI usage limit/)
      end

      it 'does not call OpenAI API' do
        Llm::LlmService.prompt_llm(user, 'Make me pasta', 'You are the best chef ever!', true) rescue nil
        expect(OpenAIClient.chat.completions).not_to have_received(:create)
      end
    end
  end
end

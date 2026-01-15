require 'open-uri'

class Llm::LlmImageService
  def initialize(user:)
    @user = user
  end

  DAILY_LIMIT = 10

  def generate_recipe_image(recipe:, request:)
    raise_limit_exceeded! if usage_limit_exceeded?

    prompt_recipe_image(recipe, request)
  rescue => e
    Rails.logger.error("Ai::ChatService error: #{e.message}")
    raise e
  end

  private

  def usage_limit_exceeded?
    if @user.email == 'alexanderbtcc@gmail.com'
      return false
    end

    LlmUsage.where(user: @user)
            .where('created_at >= ?', Time.current.beginning_of_day)
            .limit(DAILY_LIMIT + 1)
            .count > DAILY_LIMIT
  end

  def raise_limit_exceeded!
    raise LlmUsageLimitExceeded, "Daily AI usage limit (#{DAILY_LIMIT}) reached."
  end

  def log_usage(prompt, recipe, usage, model)
    return unless usage && @user

    LlmUsage.create!(
      user: @user,
      recipe: recipe,
      model: model,
      prompt: prompt,
      provider: 'openai',
      prompt_tokens: usage[:prompt_tokens],
      completion_tokens: usage[:completion_tokens],
    )
  end

  def prompt_recipe_image(recipe, request)
    prompt = 'Generate a highly realistic, high-resolution food photograph of this recipe: ' \
      "#{recipe.title} — #{recipe.description}. Capture it as if taken with a Canon DSLR in RAW (.CR2) format, " \
      'using natural lighting, soft shadows, and a shallow depth of field. ' \
      'Keep the composition simple and clean, with minimal background and no distracting elements. ' \
      'Focus on appetizing presentation, texture details, and a professional magazine-quality look. ' \
      'The dish should appear fresh, mouth-watering, and photo-realistic — not artistic or abstract.'

    model = 'dall-e-2'

    image_gen_response = OpenAIClient.images.generate(
      prompt: prompt,
      size: '1024x1024',
      model: model,
    )

    usage = { prompt_tokens: 0, completion_tokens: 0 }

    log_usage(prompt, recipe, usage, model)

    open_ai_image_url = image_gen_response.data[0].url

    uploaded_file = download_img_from_url(open_ai_image_url, filename: "recipe_#{recipe.id}.jpg")

    result = Recipes::RecipesService.call(recipe: recipe, uploaded_file: uploaded_file, request: request)

    if result.success?
      result.public_url
    else
      Rails.logger.error("AI image upload failed: #{result.error}")
      ''
    end
  end

  def download_img_from_url(url, filename: nil)
    file = Tempfile.new([SecureRandom.uuid, File.extname(URI.parse(url).path)])
    file.binmode
    URI.open(url) { |data| file.write(data.read) }
    file.rewind

    # Mimic an UploadedFile so it works with Processor
    ActionDispatch::Http::UploadedFile.new(
      filename: filename || File.basename(file.path),
      type: Marcel::MimeType.for(file),
      tempfile: file
    )
  end
end

# app/lib/rabbitmq/ai_response_consumer.rb
class AiResponseConsumer
  def self.start
    puts "[RabbitMQ] AI Response consumer starting..."

    # Ensure we only take a manageable number of messages at once
    RABBITMQ_CHANNEL.prefetch(5)

    # Subscribe to the AI response queue
    AI_PROMPT_RESPONSE_QUEUE.subscribe(manual_ack: true) do |delivery_info, properties, payload|
      begin
        puts "[RabbitMQ] Received AI response: #{payload}"
        data = JSON.parse(payload.force_encoding('UTF-8'))

        recipe = self.validate_recipe_response(data)

        recipe_attributes = {
          title: recipe['title'],
          description: recipe['description'],
          instructions: recipe['instructions'],
          is_public: false,
          cuisine: recipe['cuisine'],
          difficulty: recipe['difficulty'],
          tags: recipe['tags'],
          prep_time: recipe['prep_time'],
          cook_time: recipe['cook_time'],
          servings: recipe['servings'],
          user_id: data['user_id']
        }

        created_recipe = Recipe.create!(recipe_attributes)

        # Attach ingredients from OpenAI response
        (recipe['ingredients'] || []).each do |ingredient|
          created_recipe.ingredients.create!(
            name: ingredient['name'],
            amount: ingredient['amount'],
            category: ingredient['category']
          )
        end

        # Acknowledge the message if processed successfully
        RABBITMQ_CHANNEL.ack(delivery_info.delivery_tag)
      rescue JSON::ParserError => e
        puts "[RabbitMQ] Invalid JSON: #{e.message}"
        # Move message to a dead-letter queue or nack without requeue
        RABBITMQ_CHANNEL.nack(delivery_info.delivery_tag, false, false)
      rescue => e
        puts "[RabbitMQ] Failed to process message: #{e.message}"
        # Requeue message for retry
        RABBITMQ_CHANNEL.nack(delivery_info.delivery_tag, false, true)
      end
    end
  end

  private

  def self.validate_recipe_response(recipe_data)
    recipe_json_str = recipe_data['prompt_result']['choices'][0]['message']['content']

    recipe_hash = JSON.parse(recipe_json_str) rescue nil

    unless recipe_hash.is_a?(Hash) && recipe_hash.key?('recipe')
      raise StandardError, "Missing 'recipe' key in response."
    end

    recipe = recipe_hash['recipe']

    required_keys = %w[title description instructions ingredients cuisine difficulty tags prep_time cook_time servings]

    missing_keys = required_keys - recipe.keys
    if missing_keys.any?
      raise StandardError, "Missing keys in recipe: #{missing_keys.join(', ')}"
    end

    allowed_categories = GroceryCategories::CATEGORIES
    recipe['ingredients'].each do |ingredient|
      ingredient['category'] = 'no category 📦' unless allowed_categories.include?(ingredient['category'])
    end

    recipe
  end
end

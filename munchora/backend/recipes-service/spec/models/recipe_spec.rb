require 'rails_helper'
# ===========================================================================================
# RECIPE MODEL SPECIFICATION
# ===========================================================================================
# This spec implements comprehensive testing strategies combining:
# - BLACK-BOX TESTING: Testing without knowledge of internal implementation
# - WHITE-BOX TESTING: Testing with knowledge of internal code structure
#
# Run tests:
#   - 'bundle exec rspec spec/models/recipe_spec.rb --format documentation'
# ===========================================================================================

RSpec.describe Recipe, type: :model do
  describe 'validations' do
    let(:author) { create(:recipe_author) }

    let(:valid_attributes) do
      {
        recipe_author: author,
        title: "Sovs og Kartofler",
        image_url: nil,
        description: "Kogte kartofler med brun Sovs",
        instructions: ["Skræld kartofler", "Kog kartofler", "lav sovs"],
        ingredients: create_list(:ingredient, rand(5..10)),
        difficulty: "easy",
        servings: 4,
        tags: ["danish"],
        cuisine: ["old school"]
      }
    end

    # ======================================
    # TITLE VALIDATIONS
    # ======================================
    context 'title', :title_context do
      [
        # Invalid title partition 0 - 6: lower boundary
        { title: '', is_valid: false },
        { title: 't', is_valid: false }, # +1 char
        { title: 'ttt', is_valid: false }, # equivalence partition
        { title: 't' * 5, is_valid: false }, # -1 char from valid lower boundary

        # Valid title partition 6-150
        { title: 't' * 6, is_valid: true }, # valid lower
        { title: 't' * 7, is_valid: true }, # +1 char
        { title: 't' * 75, is_valid: true }, # equivalence partition
        { title: 't' * 149, is_valid: true }, # -1 char from valid upper
        { title: 't' * 150, is_valid: true }, # valid upper

        # Invalid title partition > 150
        { title: 't' * 151, is_valid: false }, # +1 char
        { title: 't' * 450, is_valid: false }, # equivalence partition

        # Edge cases: unexpected data type
        { title: nil, is_valid: false },
        { title: 1, is_valid: false },
        { title: 123456, is_valid: false },
        { title: true, is_valid: false }
      ].each do |example|
        title = example[:title]
        size_or_datatype = title.is_a?(String) ? "length #{title.size}" : title.class

        it "#{example[:is_valid] ? 'accepts ' : 'rejects in'}valid title with #{size_or_datatype}" do
          recipe = Recipe.new(valid_attributes.merge(title: title))
          example[:is_valid] ? (expect(recipe).to be_valid) : (expect(recipe).to_not be_valid)
        end
      end
    end

    # ==========================
    # IMAGE_URL VALIDATIONS
    # ==========================
    context 'image_url', :image_url_context do
      [
        # Invalid image_url partition 0 - 14: lower boundary
        { image_url: '', is_valid: true }, # valid since nil is acceptable for image_url
        { image_url: 'h', is_valid: false }, # +1 char
        { image_url: 'http://s.d', is_valid: false }, # equivalence partition
        { image_url: 'http://img.dk', is_valid: false }, # -1 char from valid lower boundary

        # Valid image_url partition 14-400
        { image_url: 'http://img.dk/', is_valid: true }, # valid lower
        { image_url: 'http://img.dk/1', is_valid: true }, # +1 char
        { image_url: 'https://munchora.pro/uploads/recipes/3r93xhue938383.jpg', is_valid: true }, # equivalence partition
        { image_url: "http://img.dk/uploads/#{'x' * 377}", is_valid: true }, # -1 char from valid upper
        { image_url: "http://img.dk/uploads/#{'x' * 378}", is_valid: true }, # valid upper

        # Invalid image_url partition > 400
        { image_url: "http://img.dk/uploads/#{'x' * 379}", is_valid: false }, # +1 char
        { image_url: "http://img.dk/uploads/#{'x' * 778}", is_valid: false }, # equivalence partition

        # Edge cases: unexpected data type, wrong http/https URL format
        { image_url: nil, is_valid: true },
        { image_url: 1, is_valid: false },
        { image_url: true, is_valid: false },
        { image_url: 'a.com', is_valid: false },
        { image_url: 'invalid_url', is_valid: false },
        { image_url: 'http://a.co', is_valid: false },
        { image_url: 'htp://site.com/uploads/x.jpg', is_valid: false }
      ].each do |example|
        image_url = example[:image_url]
        size_or_datatype = image_url.is_a?(String) ? "length #{image_url.size}" : image_url.class

        it "#{example[:is_valid] ? 'accepts ' : 'rejects in'}valid image_url with #{size_or_datatype}" do
          recipe = Recipe.new(valid_attributes.merge(image_url: image_url))
          example[:is_valid] ? (expect(recipe).to be_valid) : (expect(recipe).to_not be_valid)
        end
      end
    end

    # ======================================
    # DESCRIPTION VALIDATIONS
    # ======================================
    context 'description', :description_context do
      [
        # Invalid description lower partition 0
        { description: '', is_valid: false }, # invalid lower

        # Valid description partition 1 - 2_000
        { description: 'A', is_valid: true }, # valid lower
        { description: 'AA', is_valid: true }, # +1 char
        { description: 'I like AI food' * 15, is_valid: true }, # equivalence partition
        { description: 'a' * 1_999, is_valid: true }, # -1 char from valid upper
        { description: 'a' * 2_000, is_valid: true }, # valid upper

        # Invalid description partition > 2_000
        { description: 'a' * 2_001, is_valid: false }, # +1 char
        { description: 'I like AI food' * 500, is_valid: false }, # equivalence partition

        # Edge cases: unexpected data type
        { description: nil, is_valid: false },
        { description: 1, is_valid: true },
        { description: true, is_valid: true }
      ].each do |example|
        description = example[:description]
        size_or_datatype = description.is_a?(String) ? "length #{description.size}" : description.class

        it "#{example[:is_valid] ? 'accepts ' : 'rejects in'}valid description with #{size_or_datatype}" do
          recipe = Recipe.new(valid_attributes.merge(description: description))
          example[:is_valid] ? (expect(recipe).to be_valid) : (expect(recipe).to_not be_valid)
        end
      end
    end

    # ======================================
    # INSTRUCTIONS VALIDATIONS
    # ======================================
    context 'instructions', :instructions_context do
      [
        # instructions partition 0 - 3_000
        { instructions: [''], is_valid: true }, # valid lower
        { instructions: ['u'], is_valid: true }, # +1 char
        { instructions: ['t', 't', 'aaa' * 120], is_valid: true }, # equivalence partition
        { instructions: ['t' * 2_999], is_valid: true }, # -1 char from valid upper
        { instructions: ['t' * 3_000], is_valid: true }, # valid upper

        # Invalid instructions partition > 3_000
        { instructions: ['t' * 1_500, 't' * 1_501], is_valid: false }, # +1 char
        { instructions: ['t' * 2_500, 't' * 3_899], is_valid: false }, # equivalence partition

        # Edge cases: unexpected data type
        { instructions: nil, is_valid: false },
        { instructions: 1, is_valid: false },
        { instructions: 'a string', is_valid: false },
        { instructions: true, is_valid: false }
      ].each do |example|
        instructions = example[:instructions]
        size_or_datatype = instructions.is_a?(String) ? "length #{instructions.size}" : instructions.class

        it "#{example[:is_valid] ? 'accepts ' : 'rejects in'}valid instructions with #{size_or_datatype}" do
          recipe = Recipe.new(valid_attributes.merge(instructions: instructions))
          example[:is_valid] ? (expect(recipe).to be_valid) : (expect(recipe).to_not be_valid)
        end
      end
    end

    # ============================
    # DIFFICULTY VALIDATIONS
    # ============================
    context 'difficulty', :difficulty_context do
      [
        # valid options
        { difficulty: 'easy', is_valid: true },
        { difficulty: 'medium', is_valid: true },
        { difficulty: 'hard', is_valid: true },

        # Edge cases: unexpected data type
        { difficulty: 'Easy', is_valid: false },
        { difficulty: 'very easy', is_valid: false },
        { difficulty: nil, is_valid: true },
        { difficulty: 1, is_valid: false },
        { difficulty: true, is_valid: false }
      ].each do |example|
        difficulty = example[:difficulty]
        size_or_datatype = difficulty.is_a?(String) ? "#{difficulty}" : difficulty.class

        it "#{example[:is_valid] ? 'accepts ' : 'rejects in'}valid difficulty: #{size_or_datatype}" do
          recipe = Recipe.new(valid_attributes.merge(difficulty: difficulty))
          example[:is_valid] ? (expect(recipe).to be_valid) : (expect(recipe).to_not be_valid)
        end
      end
    end

    # ==========================
    # SERVINGS VALIDATIONS
    # ==========================
    context 'servings', :servings_context do
      [
        # Valid servings partition 0 - 100
        { servings: 0, is_valid: true }, # valid lower
        { servings: 1, is_valid: true }, # +1 from valid lower
        { servings: 50, is_valid: true }, # equivalence partition
        { servings: 99, is_valid: true }, # -1 from valid upper
        { servings: 100, is_valid: true }, # valid upper

        # Invalid servings partition > 100
        { servings: 101, is_valid: false }, # +1
        { servings: 10_000, is_valid: false }, # invalid equivalence partition

        # Edge cases: unexpected data type
        { servings: nil, is_valid: true },
        { servings: '2', is_valid: true },
        { servings: "hey", is_valid: false },
        { servings: true, is_valid: false }
      ].each do |example|
        servings = example[:servings]
        size_or_datatype = servings.is_a?(String) ? "#{servings}" : servings.class

        it "#{example[:is_valid] ? 'accepts ' : 'rejects in'}valid servings with #{size_or_datatype}" do
          recipe = Recipe.new(valid_attributes.merge(servings: servings))
          example[:is_valid] ? (expect(recipe).to be_valid) : (expect(recipe).to_not be_valid)
        end
      end
    end
  end
end

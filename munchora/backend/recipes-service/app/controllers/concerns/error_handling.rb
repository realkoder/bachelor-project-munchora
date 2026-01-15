module ErrorHandling
  extend ActiveSupport::Concern

  included do
    # Standard errors
    rescue_from ActiveRecord::RecordNotFound, with: :handle_not_found
    rescue_from ActiveRecord::RecordInvalid, with: :handle_unprocessable_entity
    rescue_from ActionController::ParameterMissing, with: :handle_bad_request
    rescue_from ActionDispatch::Http::Parameters::ParseError, with: :handle_bad_request
    rescue_from JWT::DecodeError, with: :handle_unauthorized

    # Catch-all fallback
    rescue_from StandardError, with: :handle_internal_error unless Rails.env.development?
  end

  private

  def handle_not_found(exception)
    render_error(404, 'Resource not found', exception.message)
  end

  def handle_unprocessable_entity(exception)
    # ActiveModel::ValidationError stores the model in `exception.model`
    error_messages = exception.model.errors.full_messages
    render_error(422, 'Validation failed', error_messages)
  end

  def handle_bad_request(exception)
    render_error(400, 'Bad request', exception.message)
  end

  def handle_unauthorized(exception)
    render_error(401, 'Unauthorized', exception.message)
  end

  def handle_internal_error(exception)
    Rails.logger.error(exception.message)
    Rails.logger.error(exception.backtrace.join("\n"))
    render_error(500, 'Internal Server Error', 'Something went wrong')
  end

  def render_error(status, title, detail)
    render json: {
      error: {
        status: status,
        title: title,
        detail: detail
      }
    }, status: status
  end
end

module ApplicationCable
  class Connection < ActionCable::Connection::Base
    identified_by :current_user_id, :connection_uuid

    def connect
      self.current_user_id = find_verified_user
      self.connection_uuid = SecureRandom.uuid
      track_connection!
      logger.info "User #{current_user_id} connected to ActionCable"
    end

    def disconnect
      untrack_connection!
      logger.info "User #{current_user_id} disconnected from ActionCable"
    end

    private

    def redis
      @redis ||= begin
        Redis.new(url: ENV['UPSTASH_REDIS_URL'])
      end
    end

    def track_connection!
      value = "user_id:#{current_user_id};connection_uuid:#{connection_uuid}"
      redis.sadd('action_cable:connections', value)
    end

    def untrack_connection!
      value = "user_id:#{current_user_id};connection_uuid:#{connection_uuid}"
      redis.srem('action_cable:connections', value)
    end

    def find_verified_user
      token = cookies[:jwt_auth]

      raise 'No token' unless token

      decoded_token = Auth::JsonWebToken.decode(token)
      raise 'Invalid token' unless decoded_token && decoded_token['user']['user_id']

      user_id = CurrentUser.from_jwt(decoded_token['user']).id
      raise 'No user_id in token' unless user_id

      user_id
    rescue => e
      puts "ActionCable: auth failed - #{e.message}"
      reject_unauthorized_connection
    end
  end
end

class NotificationsChannel < ApplicationCable::Channel
  def subscribed
    stream_from "notifications:#{current_user_id}"
    puts "User #{current_user_id} subscribed to notifications channel"
  end

  def unsubscribed
    # Cleanup if needed
  end
end

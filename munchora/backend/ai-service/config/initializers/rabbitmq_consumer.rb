Rails.application.config.after_initialize do
  RabbitmqConsumer.start unless Rails.env.test?
end

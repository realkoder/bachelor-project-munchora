class Users::UsersUploadsService
  def self.call(user:, uploaded_file:, request:)
    processor = ImageUpload::Processor.new(
      uploaded_file: uploaded_file,
      request: request,
      upload_dir: Rails.root.join('public', 'uploads', 'user-profile-pics')
    )

    result = processor.process
    return result unless result.success?

    delete_old_image(user: user)
    user.update(image_src: result.public_url)

    result
  end

  def self.delete_old_image(user:)
    return unless user.image_src.present? && user.image_src.include?('uploads/user-profile-pics')

    image_path = URI.parse(user.image_src).path
    full_path = Rails.root.join('public', image_path.delete_prefix('/'))
    File.delete(full_path) if File.exist?(full_path)
  rescue => e
    Rails.logger.error("Failed to delete old recipes image: #{e.message}")
  end
end

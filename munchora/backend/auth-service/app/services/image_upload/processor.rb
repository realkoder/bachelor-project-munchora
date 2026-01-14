class ImageUpload::Processor
  ALLOWED_TYPES = %w[image/png image/jpg image/jpeg image/webp image/gif]
  MAX_FILE_SIZE = 5.megabytes

  Result = Struct.new(:success?, :public_url, :error, keyword_init: true)

  def initialize(uploaded_file:, request:, upload_dir:)
    @file = uploaded_file
    @request = request
    @upload_dir = upload_dir
  end

  def process
    return error('No file uploaded') unless @file
    return error('Unsupported image format') unless ALLOWED_TYPES.include?(@file.content_type)
    return error('Image size must be less than 5MB') if @file.size > MAX_FILE_SIZE
    return error('Invalid image file') unless FastImage.type(@file.tempfile)

    FileUtils.mkdir_p(@upload_dir) unless Dir.exist?(@upload_dir)

    sanitized_filename = sanitize_filename(@file.original_filename)
    filename = "#{SecureRandom.uuid}_#{sanitized_filename}"
    filepath = @upload_dir.join(filename)

    File.open(filepath, 'wb') { |f| f.write(@file.read) }

    public_path = filepath.to_s.sub(Rails.root.join('public').to_s, '')
    full_url = "#{@request.base_url}#{public_path}"

    Result.new(success?: true, public_url: full_url)
  end

  private

  def error(msg)
    Result.new(success?: false, error: msg)
  end

  def sanitize_filename(filename)
    Pathname.new(filename).basename.to_s.gsub(/[^a-zA-Z0-9.\-_]/, '_')
  end
end

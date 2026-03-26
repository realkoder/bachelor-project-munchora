class Users::UsersSearchService
  def initialize(params)
    @params = params || {}
    @page = (@params[:page] || 1).to_i
    @per_page = (@params[:per_page] || 10).to_i
  end

  def call
    users = User.all

    if @params[:search].present?
      query = "%#{@params[:search].downcase}%" # Matches any string that contains search param and ignores case
      users = users.where(
        "LOWER(CONCAT(first_name, ' ', last_name)) LIKE ? OR LOWER(email) LIKE ?",
        query, query
      )
    end

    paginated_users = users.page(@page).per(@per_page)

    {
      total_count: paginated_users.total_count,
      total_pages: paginated_users.total_pages,
      current_page: paginated_users.current_page,
      per_page: @per_page,
      users: paginated_users
    }
  end
end

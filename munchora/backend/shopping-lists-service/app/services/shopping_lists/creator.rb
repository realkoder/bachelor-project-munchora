class ShoppingLists::Creator
  def self.call(user, params)
    user.shopping_lists.create!(params)
  end
end

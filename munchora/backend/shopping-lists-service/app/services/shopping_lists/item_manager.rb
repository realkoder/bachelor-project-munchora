class ShoppingLists::ItemManager
  def self.add_item(list, params, user)
    list.items.create!(
      name: params[:name],
      category: params[:category],
      added_by: user
    )
  end

  def self.remove_item(list, item_id)
    list.items.find(item_id).destroy!
  end
end

class ShoppingLists::Sharer
  def self.share(list, user_ids)
    users_to_add = ShoppingListOwner.where(id: user_ids).where.not(id: list.shared_user_ids)
    list.shared_users << users_to_add
  end

  def self.unshare(list, user_id)
    list.shared_users.delete(user_id)
  end
end

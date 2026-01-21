class ShoppingLists::NotifyEvents
  SHOPPING_LIST_NAME_UPDATED = 'shopping_list_shared_name_updated'
  SHOPPING_LIST_SHARED = 'shopping_list_shared'
  SHOPPING_LIST_UNSHARED = 'shopping_list_unshared'
  SHOPPING_LIST_DELETED = 'shopping_list_deleted'
  SHOPPING_ITEM_ADDED = 'shopping_item_added'
  SHOPPING_ITEM_REMOVED = 'shopping_item_removed'
  SHOPPING_ITEM_UPDATED = 'shopping_item_updated'

  def self.name_updated(shopping_list)
    recipients = self.all_recipients_for_shopping_list(shopping_list)
    self.broadcast(recipients, SHOPPING_LIST_NAME_UPDATED, { shopping_list_id: shopping_list.id, updated_name: shopping_list.name })
  end

  def self.share_list(shopping_list)
    recipients = self.all_recipients_for_shopping_list(shopping_list)
    payload = {
      shopping_list: shopping_list.as_json(
        include: [
          :items,
          { shared_users: { only: [:id, :fullname, :image_src] } }
        ]
      )
    }
    self.broadcast(recipients, SHOPPING_LIST_SHARED, payload)
  end

  def self.unshare_list(shopping_list, kicked_user_id)
    recipients = self.all_recipients_for_shopping_list(shopping_list)
    self.broadcast(recipients, SHOPPING_LIST_UNSHARED, { shopping_list_id: shopping_list.id, kicked_user_id: kicked_user_id })
  end

  def self.list_deleted(shopping_list)
    recipients = self.all_recipients_for_shopping_list(shopping_list)
    self.broadcast(recipients, SHOPPING_LIST_DELETED, { shopping_list_id: shopping_list.id })
  end

  def self.item_added(shopping_list, added_item)
    recipients = self.all_recipients_for_shopping_list(shopping_list)
    self.broadcast(recipients, SHOPPING_ITEM_ADDED, { shopping_list_id: shopping_list.id, item: added_item })
  end

  def self.item_updated(shopping_list, updated_item)
    recipients = self.all_recipients_for_shopping_list(shopping_list)
    self.broadcast(recipients, SHOPPING_ITEM_UPDATED, { shopping_list_id: shopping_list.id, item: updated_item })
  end

  def self.item_removed(shopping_list, removed_item_id)
    recipients = self.all_recipients_for_shopping_list(shopping_list)
    self.broadcast(recipients, SHOPPING_ITEM_REMOVED, { shopping_list_id: shopping_list.id, removed_item_id: removed_item_id })
  end

  private

  def self.all_recipients_for_shopping_list(shopping_list)
    user_ids = [shopping_list.owner_id] + shopping_list.shopping_list_shares.pluck(:shopping_list_owner_id)
    ShoppingListOwner.where(id: user_ids.uniq)
  end

  def self.broadcast(recipients, type, payload)
    begin
      correlation_id = SecureRandom.uuid
      response = {
        "event_id": SecureRandom.uuid,
        "type": type,
        "receivers": recipients,
        "payload": payload,
        "created_at": DateTime.now
      }.to_json

      # Publish response back
      RABBITMQ_CHANNEL.default_exchange.publish(
        response,
        routing_key: NOTIFICATION_SERVICE_QUEUE.name,
        persistent: true,
        content_type: 'application/json',
        correlation_id: correlation_id
      )

    rescue => e
      error_response = {
        correlation_id: correlation_id,
        status: 'failed',
        error: e.message
      }.to_json

      RABBITMQ_CHANNEL.default_exchange.publish(
        error_response,
        routing_key: AI_PROMPT_RESPONSE_QUEUE.name,
        correlation_id: correlation_id
      )
    end
  end
end

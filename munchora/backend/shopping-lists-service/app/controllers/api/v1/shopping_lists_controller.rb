class Api::V1::ShoppingListsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_shopping_list, only: [:update, :destroy, :add_item, :remove_item, :share, :unshare]

  def index
    owned_lists = current_shopping_list_owner.shopping_lists.includes(:items, :shared_users)
    shared_lists = current_shopping_list_owner.shared_shopping_lists.includes(:items, :shared_users)

    all_lists = (owned_lists + shared_lists).uniq { |list| list.id }

    render json: all_lists.as_json(
      include: [
        :items,
        { shared_users: { only: [:id, :first_name, :image_src] } }
      ]
    )
  end

  def create
    list = current_shopping_list_owner.shopping_lists.create(shopping_list_params)

    if list.persisted?
      render json: list.as_json(include: [:items, shared_users: { only: [:id, :first_name, :last_name, :image_src] }]), status: :created
    else
      render json: { errors: list.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    if @shopping_list.update(shopping_list_params)
      ShoppingLists::NotifyEvents.name_updated(@shopping_list)
      render json: @shopping_list
    else
      render json: { errors: @shopping_list.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    if @shopping_list.owner_id == current_shopping_list_owner.id
      @shopping_list.destroy!
      ShoppingLists::NotifyEvents.list_deleted(@shopping_list)
      head :no_content
    else
      ShoppingLists::NotifyEvents.unshare_list(@shopping_list, current_shopping_list_owner.id)
      ShoppingLists::Sharer.unshare(@shopping_list, current_shopping_list_owner.id)
      head :no_content
    end
  end

  def add_item
    item = ShoppingLists::ItemManager.add_item(@shopping_list, item_params, current_shopping_list_owner)

    ShoppingLists::NotifyEvents.item_added(@shopping_list, item)
    render json: item, status: :created
  rescue ActiveRecord::RecordInvalid => e
    render json: { errors: e.record.errors().full_messages }, status: :unprocessable_entity
  end

  # DELETE /api/v1/shopping_lists/:id/remove-item/:item_id
  def remove_item
    item_id = params[:item_id]
    ShoppingLists::ItemManager.remove_item(@shopping_list, item_id)
    ShoppingLists::NotifyEvents.item_removed(@shopping_list, item_id)
    head :no_content
  rescue
    render status: :unprocessable_entity
  end

  def share
    user_ids = Array(params[:user_ids])
    ShoppingLists::Sharer.share(@shopping_list, user_ids)
    ShoppingLists::NotifyEvents.share_list(@shopping_list)
    head :no_content
  end

  def unshare
    ShoppingLists::NotifyEvents.unshare_list(@shopping_list, params[:user_id])
    ShoppingLists::Sharer.unshare(@shopping_list, params[:user_id])
    head :no_content
  end

  def update_item
    item = ShoppingListItem.find(params[:item_id])
    @shopping_list = item.shopping_list

    unless @shopping_list.owner_id == current_shopping_list_owner.id || @shopping_list.shared_users.exists?(id: current_shopping_list_owner.id)
      return head :forbidden
    end

    update_attrs = {}
    update_attrs[:is_completed] = params[:is_completed] unless params[:is_completed].nil?
    update_attrs[:name] = params[:name] if params[:name].present?
    update_attrs[:category] = params[:category] if params[:category].present?

    if item.update(update_attrs)
      ShoppingLists::NotifyEvents.item_updated(@shopping_list, item)
      render json: item
    else
      render json: { errors: item.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def set_shopping_list
    @shopping_list = ShoppingList.find(params[:id])

    unless @shopping_list.owner_id == current_shopping_list_owner.id || @shopping_list.shared_users.exists?(id: current_shopping_list_owner.id)
      head :forbidden and return
    end
  end

  def shopping_list_params
    params.require(:shopping_list).permit(:name)
  end

  def item_params
    params.require(:item).permit(:name, :category)
  end

  def update_item_params
    params.permit(:is_completed)
  end
end

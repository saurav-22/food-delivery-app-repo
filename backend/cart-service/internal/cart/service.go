package cart

import (
	"context"
	"errors"
)

type Service struct{}

func NewService() *Service {
	return &Service{}
}

// Ensure a cart exists for this user+restaurant OR clear & create new if conflict
func (s *Service) GetOrCreateCart(ctx context.Context, userID int64, restaurantSlug string) (*Cart, error) {
	existing, err := findActiveCart(ctx, userID)
	if err != nil {
		return nil, err
	}
	if existing == nil {
		// no cart → create new
		return createCart(ctx, userID, restaurantSlug)
	}

	if existing.RestaurantSlug != restaurantSlug {
		// rule: clear & create new (as per our decision)
		if err := clearCart(ctx, existing.ID); err != nil {
			return nil, err
		}
		return createCart(ctx, userID, restaurantSlug)
	}
	return existing, nil
}

func (s *Service) AddItem(ctx context.Context, userID int64, restaurantSlug string, menuItemID int64, pricePaise int, qty int) (*CartWithItems, error) {
	if qty <= 0 {
		return nil, errors.New("qty must be > 0")
	}

	// ensure cart exists and respects single-restaurant
	cart, err := s.GetOrCreateCart(ctx, userID, restaurantSlug)
	if err != nil {
		return nil, err
	}

	// insert as new row every time (no merging logic here)
	if err := insertItem(ctx, cart.ID, menuItemID, pricePaise, qty); err != nil {
		return nil, err
	}

	return s.ViewCart(ctx, userID)
}

func (s *Service) UpdateQty(ctx context.Context, itemID int64, qty int) (*CartWithItems, error) {
	if qty <= 0 {
		return nil, errors.New("qty must be > 0")
	}
	if err := updateItemQty(ctx, itemID, qty); err != nil {
		return nil, err
	}
	// we don't know userID here → caller must handle
	return nil, nil
}

func (s *Service) ClearCart(ctx context.Context, userID int64) error {
	cart, err := findActiveCart(ctx, userID)
	if err != nil || cart == nil {
		return nil
	}
	return clearCart(ctx, cart.ID)
}

func (s *Service) ViewCart(ctx context.Context, userID int64) (*CartWithItems, error) {
	cart, err := findActiveCart(ctx, userID)
	if err != nil {
		return nil, err
	}
	// empty cart behavior
	if cart == nil {
		return &CartWithItems{
			CartID:         nil,
			RestaurantSlug: nil,
			Items:          []ItemView{},
			SubtotalPaise:  0,
		}, nil
	}

	items, subtotal, err := listItemsAndSubtotal(ctx, cart.ID)
	if err != nil {
		return nil, err
	}

	return &CartWithItems{
		CartID:         &cart.ID,
		RestaurantSlug: &cart.RestaurantSlug,
		Items:          items,
		SubtotalPaise:  subtotal,
	}, nil
}

<?php

namespace App;

use Exception;

class OrderService
{
    private OrderRepository $repo;
    private string $cartBaseUrl;

    public function __construct(OrderRepository $repo, string $cartBaseUrl)
    {
        $this->repo = $repo;
        $this->cartBaseUrl = rtrim($cartBaseUrl, '/');
    }

    private function httpGet(string $url): array
    {
        $res = file_get_contents($url);
        if ($res === false) throw new Exception("http_get_failed");
        return json_decode($res, true);
    }

    private function httpDelete(string $url): void
    {
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "DELETE");
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_exec($ch);
        curl_close($ch);
    }

    public function create(int $userId, int $addressId, int $paymentId): array
    {
        // 1) Fetch cart
        $cart = $this->httpGet($this->cartBaseUrl . "/cart/" . $userId);

        if (!$cart || empty($cart['items'])) {
            throw new Exception("empty_cart");
        }

        $restaurant = $cart['restaurant_slug'];
        $subtotal = $cart['subtotal_paise'];

        $this->repo->begin();
        try {
            // 2) Insert order
            $orderId = $this->repo->insertOrder(
                $userId,
                $addressId,
                $restaurant,
                $paymentId,
                $subtotal
            );

            // 3) Insert order_items
            foreach ($cart['items'] as $it) {
                $this->repo->insertOrderItem(
                    $orderId,
                    $it['menu_item_id'],
                    $it['price_snapshot_paise'],
                    $it['qty']
                );
            }

            $this->repo->commit();

            // 4) Clear cart
            $this->httpDelete($this->cartBaseUrl . "/cart/" . $userId);

            return ['id' => $orderId, 'status' => 'PLACED'];
        } catch (\Throwable $e) {
            $this->repo->rollback();
            throw $e;
        }
    }

    public function listByUser(int $userId): array
    {
        return $this->repo->listByUser($userId);
    }

    public function getOne(int $orderId): array
    {
        $order = $this->repo->getOne($orderId);
        if (!$order) throw new Exception("not_found");
        return $order;
    }

    public function markDelivered(int $orderId): void
    {
        $this->repo->markDelivered($orderId);
    }
}

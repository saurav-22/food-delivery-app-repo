<?php

namespace App;

use PDO;

class OrderRepository
{
    private PDO $db;

    public function __construct(PDO $pdo)
    {
        $this->db = $pdo;
        $this->db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    }

    public function begin()
    {
        $this->db->beginTransaction();
    }

    public function commit()
    {
        $this->db->commit();
    }

    public function rollback()
    {
        $this->db->rollBack();
    }

    public function insertOrder(int $userId, int $addressId, string $restaurantSlug, int $paymentId, int $totalPaise): int
    {
        $sql = "INSERT INTO orders (user_id,address_id,restaurant_slug,payment_id,total_paise)
                VALUES (:u,:a,:r,:p,:t)
                RETURNING id";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            ':u' => $userId,
            ':a' => $addressId,
            ':r' => $restaurantSlug,
            ':p' => $paymentId,
            ':t' => $totalPaise,
        ]);
        return (int)$stmt->fetchColumn();
    }

    public function insertOrderItem(int $orderId, int $menuId, int $pricePaise, int $qty): void
    {
        $sql = "INSERT INTO order_items (order_id,menu_item_id,price_snapshot_paise,qty)
                VALUES (:o,:m,:p,:q)";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            ':o' => $orderId,
            ':m' => $menuId,
            ':p' => $pricePaise,
            ':q' => $qty,
        ]);
    }

    public function listByUser(int $userId): array
    {
        $stmt = $this->db->prepare("SELECT * FROM orders WHERE user_id = :u ORDER BY id DESC");
        $stmt->execute([':u' => $userId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getOne(int $orderId): ?array
    {
        $o = $this->db->prepare("SELECT * FROM orders WHERE id=:id");
        $o->execute([':id'=>$orderId]);
        $order = $o->fetch(PDO::FETCH_ASSOC);
        if (!$order) return null;

        $i = $this->db->prepare("SELECT * FROM order_items WHERE order_id=:id");
        $i->execute([':id'=>$orderId]);
        $items = $i->fetchAll(PDO::FETCH_ASSOC);

        return ['order' => $order, 'items' => $items];
    }

    public function markDelivered(int $orderId): void
    {
        $stmt = $this->db->prepare("UPDATE orders SET status='DELIVERED', updated_at=now() WHERE id=:id");
        $stmt->execute([':id'=>$orderId]);
    }
}

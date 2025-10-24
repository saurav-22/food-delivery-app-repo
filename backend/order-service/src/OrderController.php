<?php

namespace App;

use PDO;
use Exception;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class OrderController
{
    private function makeService(): OrderService
    {
        $pdo = new PDO(
            sprintf("pgsql:host=%s;port=%s;dbname=%s",
                getenv("DB_HOST"),
                getenv("DB_PORT") ?: 5432,
                getenv("DB_NAME")
            ),
            getenv("DB_USER"),
            getenv("DB_PASS")
        );

        $repo = new OrderRepository($pdo);
        $cartBase = getenv("CART_SERVICE_URL"); // must be set externally
        return new OrderService($repo, $cartBase);
    }

    public function create(Request $req, Response $res): Response
    {
        $data = json_decode((string)$req->getBody(), true);
        if (!$data || !isset($data['user_id'], $data['address_id'], $data['payment_id'])) {
            return $this->json($res, 400, ['error'=>'invalid_payload']);
        }

        try {
            $out = $this->makeService()->create(
                $data['user_id'],
                $data['address_id'],
                $data['payment_id']
            );
            return $this->json($res, 201, $out);
        } catch (Exception $e) {
            $err = $e->getMessage();
            if ($err === "empty_cart") return $this->json($res, 400, ['error'=>'empty_cart']);
            return $this->json($res, 500, ['error'=>'order_failed']);
        }
    }

    public function listByUser(Request $req, Response $res, array $args): Response
    {
        $uid = (int)($args['user_id'] ?? 0);
        return $this->json($res, 200, $this->makeService()->listByUser($uid));
    }

    public function getOne(Request $req, Response $res, array $args): Response
    {
        try {
            return $this->json($res, 200, $this->makeService()->getOne((int)$args['order_id']));
        } catch (Exception $e) {
            return $this->json($res, 404, ['error'=>'not_found']);
        }
    }

    public function markDelivered(Request $req, Response $res, array $args): Response
    {
        $this->makeService()->markDelivered((int)$args['order_id']);
        return $res->withStatus(204);
    }

    private function json(Response $res, int $code, array $body): Response
    {
        $res->getBody()->write(json_encode($body));
        return $res->withHeader('Content-Type','application/json')->withStatus($code);
    }
}

<?php

use Slim\App;
use App\OrderController;

return function (App $app) {

    $app->post('/orders', [OrderController::class, 'create']);
    // Handle GET /orders (no user_id) so frontend calls without user_id don't 405
    $app->get('/orders', function ($request, $response, $args) {
        $payload = [];
        $response->getBody()->write(json_encode($payload));
        return $response->withHeader('Content-Type', 'application/json');
    });
    $app->get('/orders/{user_id}', [OrderController::class, 'listByUser']);
    $app->get('/orders/by-id/{order_id}', [OrderController::class, 'getOne']);
    $app->put('/orders/{order_id}/deliver', [OrderController::class, 'markDelivered']);

};

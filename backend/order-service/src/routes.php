<?php

use Slim\App;
use App\OrderController;

return function (App $app) {

    $app->post('/orders', [OrderController::class, 'create']);
    $app->get('/orders/{user_id}', [OrderController::class, 'listByUser']);
    $app->get('/orders/by-id/{order_id}', [OrderController::class, 'getOne']);
    $app->put('/orders/{order_id}/deliver', [OrderController::class, 'markDelivered']);

};

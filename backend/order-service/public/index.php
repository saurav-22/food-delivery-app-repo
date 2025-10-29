<?php

use Slim\Factory\AppFactory;

require __DIR__ . '/../vendor/autoload.php';

$app = AppFactory::create();

// Add CORS middleware
$app->add(function ($request, $handler) {
    $response = $handler->handle($request);
    return $response
        ->withHeader('Access-Control-Allow-Origin', '*')
        ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        ->withHeader('Access-Control-Allow-Headers', '*');
});

// Handle preflight OPTIONS
$app->options('/{routes:.+}', function ($request, $response, $args) {
    return $response;
});

// Production mode — do not expose errors
$app->addErrorMiddleware(false, false, false);

require __DIR__ . '/../src/routes.php';

$app->run();
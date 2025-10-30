<?php

use Slim\Factory\AppFactory;

require __DIR__ . '/../vendor/autoload.php';

// Use the standard Slim 4 factory method. createFromContainer requires a container
// instance; calling create() is the common, simpler setup and prevents an
// ArgumentCountError when no container is passed.
$app = AppFactory::create();

// Add body parsing and routing middleware
$app->addBodyParsingMiddleware();
$app->addRoutingMiddleware();

// Load routes file which returns a callable that accepts the App instance.
// Call it to register application routes. The routes.php file returns a
// function(App $app) { ... } so we must invoke it.
$routes = require __DIR__ . '/../src/routes.php';
if (is_callable($routes)) {
    $routes($app);
}
// Add CORS middleware
$app->add(function ($request, $handler) {
    $response = $handler->handle($request);
    return $response
        ->withHeader('Access-Control-Allow-Origin', '*')
        ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        ->withHeader('Access-Control-Allow-Headers', '*')
        ->withHeader('Access-Control-Allow-Credentials', 'false');
});

// Ensure API endpoints under /orders always return JSON Content-Type (defensive)
$app->add(function ($request, $handler) {
    $response = $handler->handle($request);
    $path = $request->getUri()->getPath();
    if (strpos($path, '/orders') === 0) {
        return $response->withHeader('Content-Type', 'application/json');
    }
    return $response;
});

// Handle preflight OPTIONS globally — respond with CORS headers so browsers
// can proceed to the actual request.
$app->options('/{routes:.+}', function ($request, $response, $args) {
    return $response
        ->withHeader('Access-Control-Allow-Origin', '*')
        ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        ->withHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        ->withHeader('Access-Control-Allow-Credentials', 'false');
});

// Production mode — do not expose errors
$app->addErrorMiddleware(true, true, true);

$app->run();
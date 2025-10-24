<?php

use Slim\Factory\AppFactory;

require __DIR__ . '/../vendor/autoload.php';

$app = AppFactory::create();

// Production mode — do not expose errors
$app->addErrorMiddleware(false, false, false);

require __DIR__ . '/../src/routes.php';

$app->run();

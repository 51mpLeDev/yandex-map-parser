<?php

return [
    'paths' => [
        'api/*',
        'sanctum/csrf-cookie',
        'login',
        'logout',
        'auth'
    ],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        'http://localhost:15173',
        'http://127.0.0.1:15173',
        'http://0.0.0.0:15173',
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'http://0.0.0.0:5173',
    ],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,
];

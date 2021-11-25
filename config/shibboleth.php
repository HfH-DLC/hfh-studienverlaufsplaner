<?php
return [

    /*
    |--------------------------------------------------------------------------
    | Views / Endpoints
    |--------------------------------------------------------------------------
    |
    | Set your login page, or login routes, here. If you provide a view,
    | that will be rendered. Otherwise, it will redirect to a route.
    |
 */

    'idp_login' => '/Shibboleth.sso/Login',
    'idp_logout' => '/Shibboleth.sso/Logout',
    'authenticated' => '/',


    /*
    |--------------------------------------------------------------------------
    | Emulate an IdP
    |--------------------------------------------------------------------------
    |
    | In case you do not have access to your Shibboleth environment on
    | homestead or your own Vagrant box, you can emulate a Shibboleth
    | environment with the help of Shibalike.
    |
    | The password is the same as the username.
    |
    | Do not use this in production for literally any reason.
    |
     */

    'emulate_idp' => env('EMULATE_IDP', false),
    'emulate_idp_users' => [
        'admin' => [
            'Shib-cn' => 'John Doe',
            'Shib-mail' => 'john.doe@example.com',
            'Shib-givenName' => 'John',
            'Shib-sn' => 'Doe',
            'Shib-emplId' => 'jod',
        ]
    ],

    /*
    |--------------------------------------------------------------------------
    | Server Variable Mapping
    |--------------------------------------------------------------------------
    |
    | Change these to the proper values for your IdP.
    |
     */

    'entitlement' => 'Shib-isMemberOf',

    'user' => [
        // fillable user model attribute => server variable
        'name' => 'Shib-cn',
        'first_name' => 'Shib-givenName',
        'last_name' => 'Shib-sn',
        'email' => 'Shib-mail',
        'emplid' => 'Shib-emplId',
    ],

    //The user model field (from the user array above) that should be used for authentication
    'user_authentication_field' => 'email',

    /*
    |--------------------------------------------------------------------------
    | User Creation and Groups Settings
    |--------------------------------------------------------------------------
    |
    | Allows you to change if / how new users are added
    |
     */

    'add_new_users' => true,
];

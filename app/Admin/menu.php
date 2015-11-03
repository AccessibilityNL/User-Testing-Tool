<?php
Admin::menu()->url('/')->label('Start page')->icon('fa-dashboard');

Admin::menu('App\Models\License')->icon('fa-key');

Admin::menu()->label('Users')->icon('fa-users')->items(function () {
    Admin::menu('App\Models\Organization')->icon('fa-sitemap');
    Admin::menu('App\Models\Member')->icon('fa-user');
    Admin::menu('App\Models\Sector')->icon('fa-puzzle-piece');
    Admin::menu('App\Models\Country')->icon('fa-flag');
});

Admin::menu()->label('Test results')->icon('fa-cogs')->items(function () {
    Admin::menu('App\Models\Evaluation')->icon('fa-desktop');
    Admin::menu('App\Models\Webpage')->icon('fa-globe');
    Admin::menu('App\Models\Result')->icon('fa-legal');
});


Admin::menu('SleepingOwl\AdminAuth\Entities\Administrator')->icon('fa-user');

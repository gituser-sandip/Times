<?php

use Illuminate\Support\Facades\Artisan;

Artisan::command('times:hello', function () {
    $this->comment('Times backend is ready.');
});

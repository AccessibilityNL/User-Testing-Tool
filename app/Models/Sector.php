<?php

namespace App\Models;

class Sector extends BaseModel
{
    /** @var string The table associated with the model. */
    protected $table = 'sector';

    /** @var array The attributes that are mass assignable. */
    protected $fillable = ['name', 'description'];
}
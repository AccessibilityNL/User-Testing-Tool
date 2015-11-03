<?php

namespace App\Models;

class MemberLocation extends BaseModel
{
    /** @var string The table associated with the model. */
    protected $table = 'member_location';

    /** @var array The attributes that are mass assignable. */
    protected $fillable = ['member_id', 'location_id', 'type'];
}
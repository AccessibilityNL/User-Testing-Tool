<?php

namespace App\Models;

class MemberLicense extends BaseModel
{
    /** @var string The table associated with the model. */
    protected $table = 'member_license';

    /** @var array The attributes that are mass assignable. */
    protected $fillable = ['member_id', 'license_id', 'description', 'is_enabled', 'is_validated', 'starts_at', 'ends_at'];

    /** @var array The attributes that are visible in json. */
    protected $visible = ['description', 'starts_at', 'ends_at'];

    /** @var array The attributes that should be mutated to dates. */
    protected $dates = ['starts_at', 'ends_at'];

	/**
	 * The member relation
	 */
    public function member()
    {
        return $this->belongsTo('App\Models\Member');
    }

	/**
	 * The license relation
	 */
    public function license()
    {
        return $this->belongsTo('App\Models\License');
    }
}
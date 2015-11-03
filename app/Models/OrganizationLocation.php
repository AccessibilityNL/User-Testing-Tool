<?php

namespace App\Models;

class OrganizationLocation extends BaseModel
{
    /** @var string The table associated with the model. */
    protected $table = 'organization_location';

    /** @var array The attributes that are mass assignable. */
    protected $fillable = ['organization_id', 'location_id', 'type'];

    /** @var bool Indicates if the model should be timestamped. */
    public $timestamps = false;

	/**
	 * The organization relation
	 */
    public function location()
    {
        return $this->belongsTo('App\Models\Location');
    }
}
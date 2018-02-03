<?php

namespace App\Models;

class OrganizationLicense extends BaseModel
{
    /** @var string The table associated with the model. */
    protected $table = 'organization_license';

    /** @var array The attributes that are mass assignable. */
    protected $fillable = ['organization_id', 'license_id', 'description', 'is_enabled', 'is_validated', 'starts_at', 'ends_at'];

    /** @var array The attributes that are visible in json. */
    protected $visible = ['description', 'starts_at', 'ends_at'];

    /** @var array The attributes that should be mutated to dates. */
    protected $dates = ['starts_at', 'ends_at'];

	/**
	 * The organization relation
	 */
    public function organization()
    {
        return $this->belongsTo('App\Models\Organization');
    }

	/**
	 * The license relation
	 */
    public function license()
    {
        return $this->belongsTo('App\Models\License');
    }
}
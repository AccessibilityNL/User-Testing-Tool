<?php

namespace App\Models;

class OrganizationLicense extends BaseModel
{
    /** @var string The table associated with the model. */
    protected $table = 'organization_license';

    /** @var array The attributes that are mass assignable. */
    protected $fillable = ['organization_id', 'license_id', 'description', 'is_enabled', 'is_validated', 'starts_at', 'ends_at'];

	/**
	 * The organization relation
	 */
    public function organization()
    {
        return $this->belongsTo('App\Models\Organization');
    }
}
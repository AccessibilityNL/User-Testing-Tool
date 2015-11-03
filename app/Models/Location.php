<?php

namespace App\Models;

class Location extends BaseModel
{
    /** @var string The table associated with the model. */
    protected $table = 'location';

    /** @var array The attributes that are mass assignable. */
    protected $fillable = ['country_code', 'city', 'zipcode', 'street', 'email', 'phone', 'url'];

	/**
	 * The country relation
	 */
    public function country()
    {
        return $this->belongsTo('App\Models\Country', 'country_code', 'code');
    }

	/**
	 * The organization relation
	 */
    public function organizationLocations()
    {
        return $this->hasMany('App\Models\OrganizationLocation');
    }
}
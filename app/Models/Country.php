<?php

namespace App\Models;

class Country extends BaseModel
{
    /** @var string The table associated with the model. */
    protected $table = 'country';

	/** @var string The primary key for the model.*/
	protected $primaryKey = 'code';

    /** @var array The attributes that are mass assignable. */
    protected $fillable = ['code', 'name', 'local_name'];

	/**
	 * The location relation
	 */
    public function locations()
    {
        return $this->hasMany('App\Models\Location', 'country_code', 'code');
    }
}
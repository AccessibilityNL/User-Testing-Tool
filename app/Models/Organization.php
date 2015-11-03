<?php

namespace App\Models;

class Organization extends BaseModel
{
    /** @var string The table associated with the model. */
    protected $table = 'organization';

    /** @var array The attributes that are mass assignable. */
    protected $fillable = ['sector_id', 'name', 'description', 'kvk', 'email', 'phone', 'url'];

	/**
	 * The "booting" method of the model.
	 *
	 * @return void
	 */
    public static function boot()
    {
        parent::boot();

        static::saving(function($item)
        {
            $item->key = hash('sha512', microtime().rand());
        });
    }

	/**
	 * The organization relation
	 */
    public function sector()
    {
        return $this->belongsTo('App\Models\Sector');
    }

	/**
	 * The organization relation
	 */
    public function locations()
    {
        return $this->hasMany('App\Models\OrganizationLocation');
    }
}
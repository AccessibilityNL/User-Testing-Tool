<?php

namespace App\Models;

class License extends BaseModel
{
    /** @var string The table associated with the model. */
    protected $table = 'license';

    /** @var array The attributes that are mass assignable. */
    protected $fillable = ['slug', 'name', 'description', 'duration', 'permissions', 'is_enabled', 'needs_validation'];

    /** @var array The attributes that should be casted to native types. */
    protected $casts = ['duration' => 'integer'];

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
            $item->slug = ($item->slug ? $item->slug : str_replace(' ', '_', strtolower($item->name)));
        });
    }

    /**
     * The MemberLicense relation
     */
    public function memberLicenses()
    {
        return $this->hasMany('App\Models\MemberLicense');
    }

    /**
     * The MemberLicense relation
     */
    public function organizationLicenses()
    {
        return $this->hasMany('App\Models\OrganizationLicense');
    }
}
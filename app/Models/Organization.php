<?php

namespace App\Models;

use Carbon\Carbon;

class Organization extends BaseModel
{

    /** @var string The table associated with the model. */
    protected $table = 'organization';

    /** @var array The attributes that are mass assignable. */
    protected $fillable = ['sector_id', 'name', 'description', 'kvk', 'email', 'password', 'phone', 'url'];

    /** @var array The attributes that should be casted to native types. */
    protected $casts = ['is_enabled' => 'boolean'];

    /** @var array The attributes default values. */
    protected $attributes = ['is_enabled' => true];

    /**
     * The "booting" method of the model.
     *
     * @return void
     */
    public static function boot()
    {
        parent::boot();

        static::saving(function ($item) {
            $item->key = $item->key;
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

    /**
     * The organization licenses
     */
    public function licenses()
    {
        return $this->hasMany('App\Models\OrganizationLicense');
    }

    /**
     * The organization relation
     */
    public function members()
    {
        return $this->hasMany('App\Models\Member');
    }

    /**
     * Get the contact members
     *
     * @param Member The Contact member
     * @return string
     */
    public function getContacts()
    {
        return $this->members()->where('type', 'contact')->get();
    }

    /**
     * Check for valid license
     */
    public function hasAccess()
    {
        return ($this->is_enabled && $this->hasLicense() ? true : false);
    }

    /**
     * Check for valid license
     */
    public function hasLicense()
    {
        $licenses = $this->licenses()
            ->where('is_enabled', 1)
            ->where('is_validated', 1)
            ->where('starts_at', '<=', Carbon::now())
            ->where(function ($query) {
                $query->where('ends_at', null)
                ->orWhere('ends_at', '>=', Carbon::now());
            })
            ->count();

        return ($licenses ? true : false);
    }

    /**
     * Get valid license
     */
    public function getLicense()
    {
        $license = $this->licenses()
            ->where('is_enabled', 1)
            ->where('is_validated', 1)
            ->where('starts_at', '<=', Carbon::now())
            ->where(function ($query) {
                $query->where('ends_at', null)
                    ->orWhere('ends_at', '>=', Carbon::now());
            })
            ->first();

        return $license;
    }

    /**
     * Get the user's key
     *
     * @param string $value
     * @return string
     */
    public function getKeyAttribute($value)
    {
        return ($value ? $value : hash('sha512', $this->id . microtime() . rand()));
    }

    /**
     * Set the user's key
     *
     * @param string $value
     * @return string
     */
    public function setKeyAttribute($value)
    {
        $this->attributes['key'] = ($value ? $value : $this->key);
    }
    
    /**
     * Get the user's pass
     *
     * @param string $value
     * @return string
     */
    public function setPasswordAttribute($value)
    {
        $this->attributes['password'] = ($value ? hash('sha512', $value): $this->password);
    }
}

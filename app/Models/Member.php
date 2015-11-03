<?php

namespace App\Models;

use Carbon\Carbon;
use App\Models\License;

class Member extends BaseModel
{

    /** @var string The table associated with the model. */
    protected $table = 'member';

    /** @var array The attributes that are mass assignable. */
    protected $fillable = ['key', 'organization_id', 'type', 'title', 'first_name', 'last_name', 'email', 'phone', 'url', 'is_enabled'];

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

        static::saving(function($item) {
            $item->key = $item->key;
        });
    }

    /**
     * The licenses relation
     */
    public function licenses()
    {
        return $this->hasMany('App\Models\MemberLicense');
    }

    /**
     * The organization relation
     */
    public function organization()
    {
        return $this->belongsTo('App\Models\Organization');
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
     * Auto set the users license
     *
     * @param string $licenseID
     */
    public function createAutoLicense($licenseID)
    {
        if ($licenseID) {
            $license  = static::getAutoLicense($licenseID);

            if (!$this->hasLicense() && $license) {
                $startDate = new Carbon();
                $endDate   = $license->duration === 0 ? null : Carbon::now()->addSeconds($license->duration);

                $this->licenses()->create([
                    'member_id'    => $this->id,
                    'license_id'   => $license->id,
                    'is_enabled'   => 1,
                    'is_validated' => 1,
                    'description'  => 'Auto License',
                    'starts_at'    => $startDate,
                    'ends_at'      => $endDate
                ]);
            }
        }
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
     * Auto set the users license
     *
     * @param string $licenseID
     */
    public static function getAutoLicense($licenseID)
    {
        $license = null;

        if ($licenseID) {
            $license  = License::where(['slug' => $licenseID])->first();
        }

        return $license;
    }
}
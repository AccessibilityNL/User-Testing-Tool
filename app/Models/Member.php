<?php

namespace App\Models;

use Carbon\Carbon;
use App\Models\License;
use Illuminate\Support\Facades\DB;

class Member extends BaseModel
{

    /** @var string The table associated with the model. */
    protected $table = 'member';

    /** @var array The attributes that are mass assignable. */
    protected $fillable = [
        'key',
        'organization_id',
        'type',
        'title',
        'first_name',
        'last_name',
        'email',
        'phone',
        'url',
        'is_enabled',
        'info',
        'settings',
    ];
    
    /** @var array The attributes that should be visible in arrays. */
    protected $visible = ['id', 'key', 'rank', 'type', 'first_name', 'last_name', 'email', 'settings', 'info'];

    /** @var array The attributes that should be casted to native types. */
    protected $casts = ['is_enabled' => 'boolean', 'info' => 'array', 'settings' => 'array'];

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
     * The licenses relation
     */
    public function licenses()
    {
        return $this->hasMany('App\Models\MemberLicense');
    }

    /**
     * The evaluation relation
     */
    public function evaluations()
    {
        return $this->hasMany('App\Models\Evaluation');
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
     *
     * @return string
     */
    public function getInfoAttribute($value)
    {
        return ($value ? json_decode($value, true) : array('impairments' => ['']));
    }

    /**
     * Get the user's key
     *
     * @param string $value
     *
     * @return string
     */
    public function getSettingsAttribute($value)
    {
        return ($value ? json_decode($value, true) : array('popup' => 50, 'popup_enabled' => true));
    }

    /**
     * Get the user's key
     *
     * @param string $value
     *
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
     *
     * @return string
     */
    public function setKeyAttribute($value)
    {
        $this->attributes['key'] = ($value ? $value : $this->key);
    }

    /**
     * Set the user's key
     * @param string $value
     * @return string
     */
    public function setEmailAttribute($value)
    {
        $this->attributes['email'] = ($value ? $value : null);
    }
    
    /**
     * Auto set the users license
     *
     * @param string $licenseID
     */
    public function createAutoLicense($licenseID)
    {
        if ($licenseID) {
            $license = static::getAutoLicense($licenseID);

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
                    'ends_at'      => $endDate,
                ]);
            }
        }
    }

    /**
     * Check for valid license
     */
    public function hasAccess()
    {
        $OrganizationAccess = ($this->organization ? $this->organization->hasAccess() : true);

        return ($this->is_enabled && ($this->hasLicense() || $OrganizationAccess) ? true : false);
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
     * Check for valid license
     *
     * @return License
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

        return ($license ? $license : ($this->organization ? $this->organization->getLicense() : null));
    }

    /**
     * Auto set the users license
     *
     * @param string $licenseID
     *
     * @return License
     */
    public static function getAutoLicense($licenseID)
    {
        $license = null;

        if ($licenseID) {
            $license = License::where(['slug' => $licenseID])->first();
        }

        return $license;
    }
}

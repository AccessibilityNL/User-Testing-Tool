<?php

namespace App\Models;

use Jenssegers\Agent\Agent;

class Evaluation extends BaseModel
{

    /** @var string The table associated with the model. */
    protected $table = 'evaluation';

    /** @var array The attributes that are mass assignable. */
    protected $fillable = ['member_id', 'webpage_id', 'ip', 'user_agent'];

    /**
     * The organization relation
     */
    public function member()
    {
        return $this->belongsTo('App\Models\Member');
    }

    /**
     * The organization relation
     */
    public function webpage()
    {
        return $this->belongsTo('App\Models\Webpage');
    }

    /**
     * The organization relation
     */
    public function results()
    {
        return $this->hasMany('App\Models\Result');
    }

    /**
     * Set the updated at field
     *
     * @param string $value
     * @return string
     */
    public function setUpdatedAtAttribute($value)
    {
        
    }

    /**
     * Set the user agent field
     *
     * @param string $value
     * @return string
     */
    public function setUserAgentAttribute($value)
    {
        $agent = new Agent();
        $agent->setUserAgent($value);

        $this->browser         = $agent->browser();
        $this->browser_version = $agent->version($this->browser);

        $this->platform         = $agent->platform();
        $this->platform_version = $agent->version($this->platform);

        $this->device      = ($agent->device() && !$agent->isDesktop() ? $agent->device() : '');
        $this->device_type = ($agent->isMobile() ? 'mobile' : ($agent->isTablet() ? 'tablet' : ($agent->isDesktop() ? 'desktop' : '')));

        $this->attributes['user_agent'] = $value;
    }
}
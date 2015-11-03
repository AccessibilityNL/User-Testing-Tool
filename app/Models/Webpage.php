<?php

namespace App\Models;

class Webpage extends BaseModel
{

    /** @var string The table associated with the model. */
    protected $table = 'webpage';

    /** @var array The attributes that are mass assignable. */
    protected $fillable = ['scheme', 'host', 'path', 'query', 'fragment', 'url', 'description', 'is_enabled'];

    /** @var array The attributes that should be casted to native types. */
    protected $casts = ['is_enabled' => 'boolean'];

    /** @var array The attributes default values. */
    protected $attributes = ['is_enabled' => true];

    /**
     * The organization relation
     */
    public function evaluations()
    {
        return $this->hasMany('App\Models\Evaluation');
    }

    /**
     * Set the url attribute
     *
     * @param string $value
     * @return string
     */
    public function setUrlAttribute($value)
    {
        $page = parse_url($value);

        $this->attributes['url']      = $value;
        $this->attributes['scheme']   = isset($page['scheme']) ? $page['scheme'] : '';
        $this->attributes['host']     = isset($page['host']) ? $page['host'] : '';
        $this->attributes['path']     = isset($page['path']) ? $page['path'] : '';
        $this->attributes['query']    = isset($page['query']) ? $page['query'] : '';
        $this->attributes['fragment'] = isset($page['fragment']) ? $page['fragment'] : '';
    }
}
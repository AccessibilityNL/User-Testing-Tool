<?php

namespace App\Models;

class Result extends BaseModel
{

    /** @var string The table associated with the model. */
    protected $table = 'result';

    /** @var array The attributes that are mass assignable. */
    protected $fillable = ['evaluation_id', 'module', 'type', 'status', 'value', 'info'];

    /**
     * The organization relation
     */
    public function evaluation()
    {
        return $this->belongsTo('App\Models\Evaluation');
    }

    /**
     * Set the updated at field
     *
     * @param string $value
     * @return string
     */
    public function setUpdatedAtAttribute($value){ }
}
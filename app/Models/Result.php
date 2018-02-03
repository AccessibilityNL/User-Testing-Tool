<?php

namespace App\Models;

class Result extends BaseModel
{
    /** @var string The table associated with the model. */
    protected $table = 'result';

    /** @var array The attributes that are mass assignable. */
    protected $fillable = ['evaluation_id', 'module', 'type', 'status', 'value', 'info'];

    /** @var array The attributes that should be visible in arrays. */
    protected $visible = ['module', 'type', 'status', 'value', 'info', 'info_id', 'created_at'];
    
    /** @var array The accessors to append to the model's array form. */
    protected $appends = ['info_id'];

    /** @var bool Indicates if the model should be timestamped. */
    public $timestamps = false;

    /**
     * The "booting" method of the model.
     *
     * @return void
     */
    public static function boot()
    {
        parent::boot();

        static::creating(function (Result $item) {
            $item->setCreatedAt($item->freshTimestamp());
        });
    }

    /**
     * The organization relation
     */
    public function evaluation()
    {
        return $this->belongsTo('App\Models\Evaluation');
    }

    /**
     * Get the updated at field
     * @param string $value
     * @return string
     */
    public function getInfoIdAttribute()
    {
        $namespace = 'utt:';
        $label = '';

        $text = explode("\r\n", $this->info);
        $text = $text[0];

        $t = [
            'Is the text on this page easy to understand?' => 'text',
            'Are there difficult words on this page?' => 'words',
            'Is the information on this page up to date?' => 'info',
            'Does the text have an introduction or summary part?' => 'text:summary',
            'Is the website well displayed on a small screen?' => 'screen:small',
            'Can you navigate the site using only the keyboard?' => 'navigate:keyboard',
            'Can you navigate this page using only the keyboard?' => 'navigate:keyboard:site',
            'Is the focus of active elements visible?' => 'focus',
            'If you resize the text, is it then necessary to scroll horizontally?' => 'scroll:horizontally',
            'Does the video on this page have captions?' => 'video:captions',
            'Does the video on this page have audio descriptions?' => 'video:descriptions',
        ];

        switch($this->module){
            case 'title':
            case 'heading':
            case 'image':
                $label = $namespace . ':' . $this->module . ':' . $this->type;
                break;

            case 'rating':
                $label = $namespace . ':' . $this->module;
                break;
                break;

            case 'poll':
                $label = $namespace . ':' . $this->module . ':' . (isset($t[$text]) ? $t[$text] : '');
                break;
        }

        return $label;
    }
}
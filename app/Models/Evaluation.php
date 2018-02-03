<?php

namespace App\Models;

use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Jenssegers\Agent\Agent;

class Evaluation extends BaseModel
{
    /** @var string The table associated with the model. */
    protected $table = 'evaluation';

    /** @var array The attributes that are mass assignable. */
    protected $fillable = ['member_id', 'webpage_id', 'ip', 'user_agent'];

    /** @var array The attributes that should be visible in arrays. */
    protected $visible = ['created_at', 'ip', 'user_agent', 'browser', 'browser_version', 'platform', 'platform_version', 'device', 'device_type', 'webpage', 'results', 'good', 'bad', 'score', 'questions_asked', 'questions_answered'];

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
     * Results from a previous session by same user and same webpage
     *
     * @return Collection
     */
    public function previousResults()
    {
        $previous = Evaluation::where(['member_id' => $this->member_id, 'webpage_id' => $this->webpage_id])
            ->select('evaluation.id', DB::raw('count(result.id) as `num`', 'num'))
            ->leftJoin('result', 'result.evaluation_id', '=', 'evaluation.id')
            ->groupBy('evaluation.id')
            ->having('num', '>', 0)
            ->orderBy('evaluation.id', 'desc')
            ->first();

        if ($previous) {
            return $previous->results()
                ->where('type', 'feedback')
                ->get();
        }

        return null;
    }

    /**
     * Results from a previous session by same user and same webpage
     *
     * @return Collection
     */
    public function globalRatingResult()
    {
        return Result::where(['webpage_id' => $this->webpage_id, 'module' => 'rating', 'type' => 'feedback'])
            ->leftJoin('evaluation', 'result.evaluation_id', '=', 'evaluation.id')
            ->orderBy('result.created_at', 'desc')
            ->get();
    }

    /**
     * Results from a previous session by same user and same webpage
     *
     * @return Collection
     */
    public function globalRatingValue()
    {
        return Result::where(['webpage_id' => $this->webpage_id, 'module' => 'rating', 'type' => 'feedback'])
            ->select(DB::raw('ROUND(SUM(result.status)/COUNT(*), 1) as average'), DB::raw('COUNT(*) as total'))
            ->leftJoin('evaluation', 'result.evaluation_id', '=', 'evaluation.id')
            ->first();
    }

    /**
     * Results from a previous session by same user and same webpage
     *
     * @return Collection
     */
    public function previousRatingResult()
    {
        $previous = Evaluation::where(['member_id' => $this->member_id, 'webpage_id' => $this->webpage_id])
            ->where('module', 'rating')
            ->select('evaluation.id')
            ->leftJoin('result', 'result.evaluation_id', '=', 'evaluation.id')
            ->groupBy('evaluation.id')
            ->orderBy('evaluation.id', 'desc')
            ->first();

        if ($previous) {
            return $previous->results()
                ->where('module', 'rating')
                ->where('type', 'feedback')
                ->first();
        }

        return null;
    }

    /**
     * Results from a previous session by same user and same webpage
     *
     * @return Collection
     */
    public function groupedResults()
    {
        $results = $this->results()->orderBy('id', 'asc')->get();
        $feedback = Array();
        $grouped = Array(
            'w3c_nu' => [
                'status'   => 'pass',
                'answered' => 0,
            ],
            'readlevel' => [
                'status'   => 'incomplete',
                'answered' => 0,
            ],
            'link' => [
                'status'   => 'pass',
                'answered' => 0,
            ],
            'title' => [
                'status'   => 'pass',
                'answered' => 0,
            ],
            'heading' => [
                'status'   => 'pass',
                'answered' => 0,
            ],
            'image' => [
                'status'   => 'pass',
                'answered' => 0,
            ],
        );
        $total   = Array('incomplete' => 0, 'pass' => 0, 'fail' => 0, 'count' => 0);

        if ($results) {

            foreach ($results as $item) {
                if (isset($grouped[$item->module])) {
                    $module = $grouped[$item->module];

                    $module['answered'] += ($item->type == 'feedback' || isset($feedback[$item->value . '_' . $item->info]) ? 1 : -1);
                    $module['status'] = ($item->status == 'fail' ? 'fail' : ($item->status == 'incomplete' && $module['status'] != 'fail' ? 'incomplete' : (!in_array($item->status,
                        array('pass', 'incomplete')) ? $item->status : $module['status'])));
                    $module['value']  = $item->value;

                    $grouped[$item->module] = $module;

                    if ($item->type == 'feedback') {
                        $feedback[$item->value . '_' . $item->info] = true;
                    }
                }
            }

            foreach ($grouped as $key => &$item) {
                $item['status'] = ($item['status'] != 'fail' && $item['answered'] < 0 && $key != 'w3c_nu' ? 'incomplete' : $item['status']);

                $total['incomplete'] += ($item['status'] == 'incomplete' ? 1 : 0);
                $total['pass'] += ($item['status'] == 'pass' ? 1 : 0);
                $total['fail'] += ($item['status'] == 'fail' ? 1 : 0);
                $total['count']++;
            }

            $rating = $this->globalRatingValue();
            $grouped['rating'] = ['status' => ($rating['average'] ? number_format($rating['average'], 1, ',', '') : 'incomplete'), 'value' => $rating['total']];

            return ['total' => $total, 'grouped' => $grouped];
        }

        return null;
    }

    /**
     * Set the updated at field
     *
     * @param string $value
     *
     * @return string
     */
    public function setUpdatedAtAttribute($value)
    {
    }

    /**
     * Set the user agent field
     *
     * @param string $value
     *
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
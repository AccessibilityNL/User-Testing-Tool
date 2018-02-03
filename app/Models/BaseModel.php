<?php

namespace App\Models;

use Illuminate\Support\Facades\Lang;
use Illuminate\Database\Eloquent\Model;

class BaseModel extends Model
{
    /**
     * Create a list based on localisation
     *
     * @param string $prefix The localization prefix/file
     * @param string $key The key column in the resulting array
     * @param string $value The value column in the resulting array
     * @return Array The array containing the list
     *
     * @author Zaïd Sadhoe <z.m.f.sadhoe@gmail.com>
     */
    public static function listTranslated($prefix = '', $key = 'id', $value = 'name')
    {
        $results = self::lists($value, $key);

        foreach ($results as $key => &$value) {
            if (Lang::has($prefix . $key)) {
                $value = Lang::get($prefix . $key);
            } else if (Lang::has($prefix . $value)) {
                $value = Lang::get($prefix . $value);
            }
        }

        asort($results);

        return $results;
    }
}
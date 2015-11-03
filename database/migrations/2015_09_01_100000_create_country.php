<?php
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use App\Models\Country;

class CreateCountry extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('country', function(Blueprint $table) {
            $table->engine = 'InnoDB';

            $table->string('code', 2)->primary()->unique();
            $table->string('name')->index();
            $table->string('local_name')->index();

            $table->timestamps();
        });

        // FIXTURES EU Countries
        $data  = [];
        $file  = file_get_contents(base_path() . '/database/fixtures/countries.csv');
        $lines = str_getcsv($file, "\n");

        foreach ($lines as $line) {
            $keys = ['local_name', 'name', 'code'];
            $row  = array_combine($keys, str_getcsv($line, ';'));

            Country::create($row);
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('country');
    }
}
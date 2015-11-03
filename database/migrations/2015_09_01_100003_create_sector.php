<?php
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use App\Models\Sector;

class CreateSector extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sector', function(Blueprint $table) {
            $table->engine = 'InnoDB';

            $table->increments('id');

            $table->string('name')->index();
            $table->text('description')->nullable();

            $table->timestamps();
        });

        // FIXTURES Sectors
        $data  = [];
        $file  = file_get_contents(base_path() . '/database/fixtures/sectors.csv');
        $lines = str_getcsv($file, "\n");

        foreach ($lines as $line) {
            $keys = ['name'];
            $row  = array_combine($keys, str_getcsv($line, ';'));

            Sector::create($row);
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('sector');
    }
}
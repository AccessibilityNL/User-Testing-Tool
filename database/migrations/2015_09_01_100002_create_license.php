<?php
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use App\Models\License;

class CreateLicense extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('license', function(Blueprint $table) {
            $table->engine = 'InnoDB';

            $table->increments('id');
            $table->string('key', 128)->unique();
            $table->string('slug')->unique();

            $table->string('name')->index();
            $table->text('description')->nullable();

            $table->integer('duration')->nullable()->unsigned()->index();
            $table->text('permissions')->nullable();

            $table->boolean('is_enabled')->default(true)->index();
            $table->boolean('needs_validation')->default(false)->index();

            $table->timestamps();
        });

        // FIXTURES Licenses
        $data  = [];
        $file  = file_get_contents(base_path() . '/database/fixtures/licenses.csv');
        $lines = str_getcsv($file, "\n");

        foreach ($lines as $line) {
            $keys = ['slug', 'name', 'description', 'duration', 'permissions', 'is_enabled', 'needs_validation'];
            $row  = array_combine($keys, str_getcsv($line, ';'));

            License::create($row);
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('license');
    }
}
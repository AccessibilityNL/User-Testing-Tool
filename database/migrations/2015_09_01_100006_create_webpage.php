<?php
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateWebpage extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('webpage', function(Blueprint $table) {
            $table->engine = 'InnoDB';

            $table->increments('id');

            $table->string('scheme', 10)->index();
            $table->string('host')->index();
            $table->string('path')->nullable();
            $table->string('query')->nullable();
            $table->string('fragment')->nullable();
            $table->string('url');

            $table->text('description')->nullable();
            $table->boolean('is_enabled')->default(true)->index();

            $table->timestamps();

            $table->unique(['url']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('webpage');
    }
}
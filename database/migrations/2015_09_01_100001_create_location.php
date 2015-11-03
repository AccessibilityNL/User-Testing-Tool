<?php
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateLocation extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('location', function(Blueprint $table) {
            $table->engine = 'InnoDB';

            $table->increments('id');

            $table->string('country_code', 2)->nullable();
            $table->foreign('country_code')->references('code')->on('country')->onDelete('set null');

            $table->string('city')->nullable();
            $table->string('zipcode')->nullable();
            $table->string('street')->nullable()->index();

            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->string('url')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('location');
    }
}
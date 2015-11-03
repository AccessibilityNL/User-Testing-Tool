<?php
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateResult extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('result', function(Blueprint $table) {
            $table->engine = 'InnoDB';

            $table->increments('id');

            $table->integer('evaluation_id')->unsigned();
            $table->foreign('evaluation_id')->references('id')->on('evaluation')->onDelete('cascade');

            $table->string('module')->index();
            $table->string('type')->index();
            $table->string('status')->index();
            $table->string('value')->nullable();
            $table->string('info')->nullable();

            $table->timestamp('created_at');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('result');
    }
}
<?php
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateEvaluation extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('evaluation', function(Blueprint $table) {
            $table->engine = 'InnoDB';

            $table->increments('id');

            $table->integer('member_id')->unsigned();
            $table->foreign('member_id')->references('id')->on('member')->onDelete('cascade');

            $table->integer('webpage_id')->unsigned();
            $table->foreign('webpage_id')->references('id')->on('webpage')->onDelete('cascade');

            $table->string('ip')->nullable()->index();
            $table->string('user_agent')->inullable()->ndex();

            $table->string('browser', 20)->nullable()->index();
            $table->string('browser_version', 20)->nullable()->index();
            $table->string('platform', 20)->nullable()->index();
            $table->string('platform_version', 20)->nullable()->index();
            $table->string('device', 20)->nullable()->index();
            $table->string('device_type', 10)->nullable()->index();

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
        Schema::dropIfExists('evaluation');
    }
}
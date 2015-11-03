<?php
use Illuminate\Database\Migrations\Migration;

class DropOld extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::dropIfExists('assertions');
        Schema::dropIfExists('evaluations');
        Schema::dropIfExists('webpages');
        Schema::dropIfExists('assertors');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {

    }
}
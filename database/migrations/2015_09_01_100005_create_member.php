<?php
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateMember extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('member', function(Blueprint $table) {
            $table->engine = 'InnoDB';

            $table->increments('id');

            $table->integer('organization_id')->nullable()->unsigned();
            $table->foreign('organization_id')->references('id')->on('organization')->onDelete('set null');

            $table->string('key', 128)->unique();

            $table->string('type')->default('user')->index();

            $table->string('title')->nullable();
            $table->text('description')->nullable();

            $table->string('first_name')->nullable();
            $table->string('last_name')->nullable();

            $table->string('email')->nullable()->unique();
            $table->string('phone')->nullable();
            $table->string('url')->nullable();

            $table->string('status')->default('new')->index();
            $table->boolean('is_enabled')->default(true)->index();

            $table->timestamps();
        });

        Schema::create('member_license', function(Blueprint $table) {
            $table->engine = 'InnoDB';

            $table->increments('id');

            $table->integer('member_id')->unsigned();
            $table->foreign('member_id')->references('id')->on('member')->onDelete('cascade');

            $table->integer('license_id')->nullable()->unsigned();
            $table->foreign('license_id')->references('id')->on('license')->onDelete('set null');

            $table->text('description')->nullable();

            $table->boolean('is_enabled')->default(true)->index();
            $table->boolean('is_validated')->default(false)->index();

            $table->timestamp('starts_at');
            $table->timestamp('ends_at')->nullable();

            $table->timestamps();
        });

        Schema::create('member_location', function(Blueprint $table) {
            $table->engine = 'InnoDB';

            $table->increments('id');

            $table->integer('member_id')->unsigned();
            $table->foreign('member_id')->references('id')->on('member')->onDelete('cascade');

            $table->integer('location_id')->unsigned();
            $table->foreign('location_id')->references('id')->on('location')->onDelete('cascade');

            $table->string('type')->default('address')->index();

            $table->timestamps();

            $table->unique(['member_id', 'location_id', 'type']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('member_location');
        Schema::dropIfExists('member_license');
        Schema::dropIfExists('member');
    }
}
<?php
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use App\Models\Organization;
use App\Models\OrganizationLicense;

class CreateOrganization extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('organization', function(Blueprint $table) {
            $table->engine = 'InnoDB';

            $table->increments('id');

            $table->integer('sector_id')->nullable()->unsigned();
            $table->foreign('sector_id')->references('id')->on('sector')->onDelete('set null');

            $table->string('key', 128)->unique();

            $table->string('name')->index();
            $table->text('description')->nullable();

            $table->string('kvk')->nullable();
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->string('url')->nullable();

            $table->string('status')->default('new')->index();
            $table->boolean('is_enabled')->default(true)->index();

            $table->timestamps();
        });

        Schema::create('organization_license', function(Blueprint $table) {
            $table->engine = 'InnoDB';

            $table->increments('id');

            $table->integer('organization_id')->unsigned();
            $table->foreign('organization_id')->references('id')->on('organization')->onDelete('cascade');

            $table->integer('license_id')->nullable()->unsigned();
            $table->foreign('license_id')->references('id')->on('license')->onDelete('set null');

            $table->text('description')->nullable();

            $table->boolean('is_enabled')->default(true)->index();
            $table->boolean('is_validated')->default(false)->index();

            $table->timestamp('starts_at');
            $table->timestamp('ends_at')->nullable();

            $table->timestamps();
        });

        Schema::create('organization_location', function(Blueprint $table) {
            $table->engine = 'InnoDB';

            $table->integer('organization_id')->unsigned();
            $table->foreign('organization_id')->references('id')->on('organization')->onDelete('cascade');

            $table->integer('location_id')->unsigned();
            $table->foreign('location_id')->references('id')->on('location')->onDelete('cascade');

            $table->string('type')->default('address')->index();

            $table->timestamps();

            $table->unique(['organization_id', 'location_id', 'type']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('organization_license');
        Schema::dropIfExists('organization_location');
        Schema::dropIfExists('organization');
    }
}
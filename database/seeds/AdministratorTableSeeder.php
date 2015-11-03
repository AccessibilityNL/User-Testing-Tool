<?php

use Illuminate\Database\Seeder;
use Illuminate\Database\Eloquent\Model;
use SleepingOwl\AdminAuth\Entities\Administrator;

class AdministratorTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('administrators')->delete();

        Administrator::create(array(
            'name'     => 'info@accessiblecheck.com',
            'username' => 'admin',
            'password' => 'admin',
        ));
    }

}

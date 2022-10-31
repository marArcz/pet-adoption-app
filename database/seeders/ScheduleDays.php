<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ScheduleDays extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //
        $days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

        foreach ($days as $key => $day) {
        DB::table('schedule_days')->insert([
                'day' => $key,
                'label' => $day
            ]);
        }
    }
}

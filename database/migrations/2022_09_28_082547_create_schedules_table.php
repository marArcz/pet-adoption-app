<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('schedules', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->unsignedBigInteger('petId');
            $table->unsignedBigInteger('applicationId');
            $table->date('date');
            $table->time('time');

            $table->foreign('petId')->references('id')->on('pets');
            $table->foreign('applicationId')->references('id')->on('applications');

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('schedules');
    }
};

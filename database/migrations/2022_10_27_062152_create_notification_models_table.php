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
        Schema::create('notification_models', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string('content');
            $table->unsignedBigInteger('userId');
            $table->foreign('userId')->references('id')->on('users')->cascadeOnDelete();
            $table->string('link')->nullable();
            $table->string('title')->nullable();

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('notification_models');
    }
};

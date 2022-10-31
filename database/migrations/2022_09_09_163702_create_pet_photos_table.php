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
        Schema::create('pet_photos', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string("src");
            $table->unsignedBigInteger("petId");
            $table->foreign("petId")->references("id")->on("pets");
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('pet_photos');
    }
};

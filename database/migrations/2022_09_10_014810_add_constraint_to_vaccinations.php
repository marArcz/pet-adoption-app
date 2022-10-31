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
        Schema::table('vaccinations', function (Blueprint $table) {
            $table->dropForeign(["petId"]);
            $table->dropForeign(["vaccineId"]);
            $table->foreign("petId")->references("id")->on("pets")->onDelete("cascade");
            $table->foreign("vaccineId")->references("id")->on("vaccines")->onDelete("cascade");
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('vaccinations', function (Blueprint $table) {
            //
        });
    }
};

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
        Schema::table('adopters', function (Blueprint $table) {
            $table->dropColumn("email");
            $table->dropColumn("password");
            $table->unsignedBigInteger("accountId");
            $table->foreign("accountId")->references("id")->on("users")->onDelete("cascade");
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('adopters', function (Blueprint $table) {
            //
            $table->string("email");
            $table->string("password");
            $table->dropColumn("accountId");
            $table->dropForeign("accountId");
        });
    }
};

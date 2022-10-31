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
        Schema::create('applications', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->unsignedBigInteger("adopterId");
            $table->foreign("adopterId")->references("id")->on("adopters");
            $table->string("name");
            $table->string("nickname");
            $table->unsignedBigInteger("age");
            $table->string("status");
            $table->string("address");
            $table->string("contact_no");
            $table->string("facebook");
            $table->string("occupation");
            $table->string("dwelling");
            $table->string("landlord_name")->nullable(true);
            $table->string("landlord_phone")->nullable(true);
            $table->boolean("move_out");
            $table->string("living_with_relatives");
            $table->string("permission");
            $table->string("no_of_adults");
            $table->string("no_of_children");
            $table->boolean("allergies_asthma");
            $table->string("supported_by_family");
            $table->string("responsible");
            $table->string("income_source");
            $table->boolean("adopted_an_animal");
            $table->string("return_reason")->nullable(true);
            $table->string("gift_plan");
            $table->string("pets_owned");
            $table->string("have_pet");
            $table->string("interested_pet");
            $table->string("kept_at_night");
            $table->string("outside_shelter")->nullable(true);
            $table->string("time_alone");
            $table->string("food_type");
            $table->string("fence_type");
            $table->string("past_experience");
            $table->string("reason_for_adoption");
            $table->string("certify");
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('applications');
    }
};

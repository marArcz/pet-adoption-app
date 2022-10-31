<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Application extends Model
{
    use HasFactory;
    
    protected $fillable = [
        "adopterId",
        "petId",
        "name",
        "nickname",
        "age",
        "status",
        "address",
        "contact_no",
        "facebook",
        "occupation",
        "dwelling",
        "landlord_name",
        "landlord_phone",
        "move_out",
        "living_with_relatives",
        "permission",
        "no_of_adults",
        "no_of_children",
        "allergies_asthma",
        "supported_by_family",
        "responsible",
        "income_source",
        "adopted_an_animal",
        "return_reason",
        "gift_plan",
        "pets_owned",
        "have_pet",
        "interested_pet",
        "keep_at_night",
        "keep_at_day",
        "outside_shelter",
        "time_alone",
        "food_type",
        "fence_type",
        "past_experience",
        "reason_for_adoption",
        "children_ages",
        "certify",
        "email",
        "application_no"
    ];
    public function adopter(){
        return $this->belongsTo(Adopters::class,"adopterId","id")->with('account');
    }
    public function pet(){
        return $this->belongsTo(Pets::class,"petId","id")->with(['photos','breeds','category','vaccinations']);
    }
    public function schedule(){
        return $this->hasOne(Schedule::class,"applicationId","id")->with('pet');
    }
}

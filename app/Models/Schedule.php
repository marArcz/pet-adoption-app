<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Schedule extends Model
{
    use HasFactory;

    protected $fillable = [
        "applicationId",
        "date",
        "time_id",
        "petId"
    ];

    public function application_form(){
        return $this->belongsTo(Application::class,"applicationId","id")->with('adopter');
    }
    public function pet(){
        return $this->belongsTo(Pets::class,"petId","id");
    }
    public function time(){
        return $this->belongsTo(ScheduleTime::class,"time_id","id");
    }
    
}

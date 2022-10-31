<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ScheduleTime extends Model
{
    use HasFactory;

    protected $fillable = [
        "time_from",
        "time_to",
        "slots",
    ];

    public function available_slots($date){
        $scheds = Schedule::where("date", $date)->andWhere("time_id", $this->id)->get();

        $available = $this->slots - count($scheds);

        return $available;
    
    }
}

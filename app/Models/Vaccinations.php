<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vaccinations extends Model
{
    use HasFactory;

    protected $fillable = [
        "petId",
        "vaccineId"
    ];

    public function pet(){
        return $this->hasOne("App\Models\Pets");
    }

    public function vaccine(){
        return $this->belongsTo("App\Models\Vaccines","vaccineId","id");
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Breedings extends Model
{
    use HasFactory;

    protected $fillable =[
        "petId",
        "breedId"
    ];

    public function details(){
        return $this->belongsTo(Breeds::class, "breedId","id");
    }
}


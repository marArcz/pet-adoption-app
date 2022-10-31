<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PetPhotos extends Model
{
    use HasFactory;

    protected $fillable = [
        "petId",
        "src",
        "is_main"
    ];
}

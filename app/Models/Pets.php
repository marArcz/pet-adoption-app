<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pets extends Model
{
    use HasFactory;
    protected $fillable = [
        "name",
        "description",
        "age",
        "address",
        "gender",
        "categoryId",
        "status"
    ];

    public function category(){
        return $this->belongsTo("App\Models\Categories","categoryId","id");
    }
    public function breeds(){
        return $this->hasMany(Breedings::class, "petId","id")->with(['details']);
    }
    public function vaccinations(){
        return $this->hasMany("App\Models\Vaccinations","petId","id")->with(['vaccine']);
    }
    public function photos(){
        return $this->hasMany(PetPhotos::class,"petId","id")->orderBy('is_main','DESC');
    }
}

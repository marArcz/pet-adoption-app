<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Categories extends Model
{
    use HasFactory;

    protected $fillable = [
        "name"
    ];

    public function pets(){
        return $this->hasMany("App\Models\Pets");
    }

    public function breeds(){
        return $this->hasMany("App\Models\Breeds","categoryId", "id");
    }
    public function vaccines(){
        return $this->hasMany(Vaccines::class, "categoryId","id");

    }
}

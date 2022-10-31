<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vaccines extends Model
{
    use HasFactory;

    protected $fillable = [
        "name",
        "categoryId"
    ];
    public function category(){
        return $this->belongsTo("App\Models\Categories","categoryId","id");
    }
}

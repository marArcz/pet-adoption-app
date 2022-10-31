<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Adopters extends Model
{
    use HasFactory;

    protected $fillable = [
        "firstname",
        "middlename",
        "lastname",
        "location",
        "state",
        "photo",
        "status",
        "accountId"
    ];

    public function account(){
        return $this->belongsTo(User::class,"accountId","id");
    }
}

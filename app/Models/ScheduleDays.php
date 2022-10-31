<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ScheduleDays extends Model
{
    use HasFactory;
    protected $fillable = [
        "day",
        "label"
    ];
}

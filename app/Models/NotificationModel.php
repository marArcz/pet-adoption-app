<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NotificationModel extends Model
{
    use HasFactory;

    protected $fillable = [
        'userId',
        'content',
        'link',
        'title',
        'status',
        'photo'
    ];

    public function user(){
        return $this->belongsTo(User::class,'userId','id');
    }
}

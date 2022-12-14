<?php

use App\Http\Controllers\PetsController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/admin/{route?}/{subpage?}/{action?}', function () {
    return view('admin.index');
});
Route::get('/{route?}/{subpage?}/{actio?}', function () {
    return view('users.index');
});


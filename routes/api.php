<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AdoptersController;
use App\Http\Controllers\ApplicationController;
use App\Http\Controllers\BreedsController;
use App\Http\Controllers\CategoriesController;
use App\Http\Controllers\MailController;
use App\Http\Controllers\NotificationModelController;
use App\Http\Controllers\PetPhotosController;
use App\Http\Controllers\PetsController;
use App\Http\Controllers\ScheduleController;
use App\Http\Controllers\VaccinesController;
use App\Http\Controllers\VerificationController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
// Route::post('/admin/signup',[AdminController::class,'signup']);

Route::prefix("/admin")->group(function(){
    Route::post('/login',[AdminController::class,'login']);
    Route::post('/register',[AdminController::class,'signup']);
    Route::post('/hasAdmin',[AdminController::class,'hasAdmin']);
    Route::post("/update",[AdminController::class,'update']);
    Route::middleware(["auth:sanctum"])->get('/me',[AdminController::class, 'me']);
    Route::get('/email/verify', [VerificationController::class, 'verify'])->name('verification.verify');
});


Route::prefix("/pets")->group(function(){
    Route::get("/",[PetsController::class,'getAll']);
    Route::post("/insert",[PetsController::class,'insert']);
    Route::post("/update",[PetsController::class,'update']);
    Route::get("/{id}/delete/",[PetsController::class,"delete"]);
    Route::get("/{id}",[PetsController::class,"get"]);
    Route::get("/{id}/get",[PetsController::class,"getOne"]);
    Route::post("/photos/insert",[PetPhotosController::class, "insert"]);
    Route::get("/photos/{id}/delete",[PetPhotosController::class, "delete"]);
    Route::post("/photos/setMain", [PetPhotosController::class,"setMainPhoto"]);
    Route::post("/update-status", [PetsController::class,"updateStatus"]);

});

Route::prefix("/categories")->group(function(){
    Route::get("/",[CategoriesController::class,'getAll']);
    Route::get("/getOne/{categoryId}",[CategoriesController::class,'getOne']);
    Route::post("/insert",[CategoriesController::class,'insert']);
    Route::post("/update",[CategoriesController::class,'update']);
    Route::get("/{id}/delete",[CategoriesController::class,'delete']);

});

Route::prefix("/breeds")->group(function(){
    // Route::get("/",[PetsController::class,'getAll']);
    Route::get("/{categoryId}/getAll",[BreedsController::class,"getAll"]);
    Route::post("/insert",[BreedsController::class,"insert"]);
    Route::post("/update",[BreedsController::class,"update"]);
    Route::post("/delete",[BreedsController::class,"delete"]);

});
Route::prefix("/vaccines")->group(function(){
    // Route::get("/",[PetsController::class,'getAll']);
    Route::get("/{categoryId}/getAll",[VaccinesController::class,"getAll"]);
    Route::post("/delete",[VaccinesController::class,"delete"]);
    Route::post("/insert",[VaccinesController::class,"insert"]);
    Route::post("/update",[VaccinesController::class,"update"]);

});

Route::prefix("/adopters")->group(function(){
    Route::get("/delete/{id}", [AdoptersController::class,"delete"]);
    Route::get("/getAll", [AdoptersController::class,"getAll"]);
    Route::post("/register", [AdoptersController::class,"insert"]);
    Route::post("/login", [AdoptersController::class,"login"]);
    Route::post("/update", [AdoptersController::class,"update"]);
    Route::post("/update", [AdoptersController::class,"update"]); 
    Route::post("/update-status", [AdoptersController::class,"update_status"]); 
    Route::get("/change-password", [AdoptersController::class,"change_password"]);
    Route::middleware(["auth:sanctum"])->get('/me',[AdoptersController::class, 'me']);

});
Route::prefix("/application")->group(function(){
    Route::post("/add", [ApplicationController::class,"add"]);
    Route::post("/get", [ApplicationController::class,"get"]);
    Route::post("/update-status", [ApplicationController::class,"updateStatus"]);
});
Route::prefix("/mails")->group(function(){
    Route::post("/send/application", [MailController::class,"notifyAdopter"]);
});

Route::prefix("/schedules")->group(function(){
    Route::get("/", [ScheduleController::class,"getSchedules"]);
    Route::get("/time", [ScheduleController::class,"getScheduleTime"]);
    Route::get("/days", [ScheduleController::class,"getScheduleDays"]);
    Route::post("/days/update", [ScheduleController::class,"update"]);
    Route::post("/time/add", [ScheduleController::class,"addTime"]);
    Route::post("/time/update", [ScheduleController::class,"updateTime"]);
    Route::post("/time/get", [ScheduleController::class,"getTimeForDate"]);
    Route::get("/time/delete/{id}", [ScheduleController::class,"deleteTime"]);
});
Route::prefix("/notifications")->group(function(){
    Route::get("/{userId}", [NotificationModelController::class,"getAll"]);
    Route::get("/clear", [NotificationModelController::class,"deleteALl"]);
    Route::post("/add", [NotificationModelController::class,"insert"]);
    Route::post("/update-status", [NotificationModelController::class,"updateStatus"]);

});





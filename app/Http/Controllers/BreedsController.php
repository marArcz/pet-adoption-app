<?php

namespace App\Http\Controllers;

use App\Models\Breeds;
use Illuminate\Http\Request;

class BreedsController extends Controller
{
    //
    public function getAll($categoryId){
        $breeds = Breeds::with(['category'])->where("categoryId",$categoryId)->get();

        return response()->json($breeds,200);
    }
    public function insert(Request $request){
        $breed = Breeds::create([
            "name"=>$request->name,
            "categoryId"=>$request->categoryId
        ]);

        if($breed){
            return response()->json([
                "breed"=>$breed
            ],200);
        }else{
            return response()->json([
                "message"=>"Failed to add new breed!"
            ],500);
        }
    }

    public function update(Request $request){
        $breed = Breeds::find($request->id);

        if(!$breed){
            return response()->json([
                "message"=>"Breed Not found!"
            ],404);
        }else{
            $breed->name = $request->name;
            if(!$breed->save()){
                return response()->json(['message'=>'Error updating breed!'],500);
            }

            return response()->json($breed,200);
        }
    }
    public function delete(Request $request){
        $breed = Breeds::find($request->id);

        if(!$breed){
            return response()->json([
                "message"=>"Breed Not found!"
            ],404);
        }else{
            $breed->delete();
            return response()->json([
                "message"=>"successfully deleted!"
            ],200);
        }

    }
}

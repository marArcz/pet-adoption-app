<?php

namespace App\Http\Controllers;

use App\Models\Vaccines;
use Illuminate\Http\Request;

class VaccinesController extends Controller
{
    public function getAll($categoryId){
        $vaccines = Vaccines::with(['category'])->where("categoryId",$categoryId)->get();

        return response()->json($vaccines,200);
    }

    public function insert(Request $request){
        $vaccine = Vaccines::create([
            "name"=>$request->name,
            "categoryId"=>$request->categoryId
        ]);

        if(!$vaccine){
            return response()->json([
                "message"=>"Failed to add vaccine!",
            ],500);
        }

        return response()->json([
            "vaccine"=>$vaccine
        ],200);
    }

    public function update(Request $request){
        $vaccine = Vaccines::find($request->id);
        $vaccine->name = $request->name;
        $vaccine->save();
        return response()->json($vaccine,200);
    }
    public function delete(Request $request){
         $vaccine = Vaccines::find($request->id);
         if(!$vaccine){
            return response()->json([
                "message"=>"Vaccine is not found!"
            ],404);
         }
         $vaccine->delete();
         return response()->json([
            "message"=>"Successfully deleted!"
        ],200);
    }
}

<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Categories;
class CategoriesController extends Controller
{
    //

    public function insert(Request $request){
        $category = Categories::create([
            "name"=>$request->name
        ]);

        return response()->json([
            "message"=>"successfully added a category!",
            "category"=>$category
        ],200);
    }

    public function update(Request $request){
        $category = Categories::find($request->id);
        if(!$category){
            return response()->json([
                "message"=>"No record found!"
            ],404);
        }
        $category->name = $request->name;

        if($category->save()){
            return response()->json($category,200);
        }else{
            return response()->json([
                "message" => "Cannot update category!"
            ], 500);
        }

    }
    public function getAll(){
        $categories = Categories::with(['vaccines','breeds'])->get();

        return response()->json($categories,200);
    }

    public function delete($id){
        $category = Categories::find($id);

        if(!$category){
            return response()->json(["message"=>"Category is not found!"],404);
        }else{
            $category->delete();
            return response()->json(["message"=>"Deleted successfully!"],200);
        }
    }

    public function getOne($categoryId){
        $category = Categories::with(['breeds','vaccines'])->find($categoryId);
        if(!$category){
            return response()->json(["message"=>"Category is not found!"],404);
        }else{
            return response()->json($category,200);
        }
    }
}

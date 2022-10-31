<?php

namespace App\Http\Controllers;

use App\Models\Breeding;
use App\Models\PetPhotos;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Pets;
use App\Models\Vaccinations;
use App\Models\Breedings;

class PetsController extends Controller
{
    public function index()
    {
        return response()->json("Welcome to pets endpoint yeah!");
    }

    public function getAll()
    {
        $pets = Pets::with(["category","breeds","vaccinations","photos"])->orderBy('id','desc')->get();
        return response()->json($pets, 200);
    }

    public function get($id)
    {
        $pet = Pets::with(["category","breeds","vaccinations","photos"])->where("categoryId",$id)->get();
        return response()->json($pet, 200);
    }
    public function getOne($id)
    {
        $pet = Pets::with(["category","breeds","vaccinations","photos"])->where("id",$id)->firstOrFail();
        return response()->json($pet, 200);
    }


    public function insert(Request $request)
    {
        $vaccines = $request->vaccineId;
        $breeds = $request->breedId;
        $pet = Pets::create([
            "name" => $request->name,
            "description" => $request->description,
            "age" => $request->age,
            "address" => $request->address,
            "gender" => $request->gender,
            "categoryId" => $request->categoryId,
        ]);


        if (!$pet) {
            return response()->json([
                "message" => "failed to insert pet",
                "vaccinesPassed" => $request->vaccineId,
            ], 500);
        }

        foreach($vaccines as $vaccine){
            Vaccinations::create([
                "petId"=>$pet->id,
                "vaccineId"=>$vaccine
            ]);
        }
        foreach($breeds as $breed){
            Breedings::create([
                "petId"=>$pet->id,
                "breedId"=>$breed
            ]);
        }

        $photos = $request->file('photo');
        $x=0;
        foreach ($photos as $photo) {
            $imageName = $photo->getClientOriginalName();

            $photo->move(public_path('images'), $imageName);
            $petPhoto = array(
                "petId" => $pet->id,
                "src" => asset('images'). "/" . $imageName
            );

            if($x==0){
                $petPhoto['is_main'] = true;
            }
            $x++;
            PetPhotos::create($petPhoto);
        }


        return response()->json([
            "message"=>"Successfully added new pet!"
        ], 200);
    }
    public function update(Request $request)
    {
        $pet = Pets::where('id',$request->id)->firstOrFail();


        $pet->name = $request->name;
        $pet->description = $request->description;
        $pet->age = $request->age;
        $pet->gender = $request->gender;
        $pet->address =  $request->address;
        $pet->categoryId = $request->categoryId;

        // delete vaccinations
        $vaccinations = Vaccinations::where('petId',$request->id)->get();
        foreach ($vaccinations as $v){
            $v->delete();
        }
        // delete breeds
        $breeds = Breedings::where('petId',$request->id)->get();
        foreach ($breeds as $b){
            $b->delete();
        }

        $vaccines = $request->vaccineId;
        $breeds = $request->breedId;

        foreach($vaccines as $vaccine){
            Vaccinations::create([
                "petId"=>$request->id,
                "vaccineId"=>$vaccine
            ]);
        }
        foreach($breeds as $breed){
            Breedings::create([
                "petId"=>$request->id,
                "breedId"=>$breed
            ]);
        }


        if (!$pet->save()) {
            return response()->json([
                "message" => "Failed to update pet",
            ], 500);
        }

        return response()->json([
            "message"=>"Successfully updated pet!"
        ], 200);
    }

    public function delete($id)
    {
        $pet = Pets::find($id);
        if (!$pet) {
            return response()->json([
                "message" => "Pet is not found!",
            ], 404);
        }


        if (!$pet->delete()) {
            return response()->json([
                "message" => "Failed to delete pet",
            ], 500);
        }

        return response()->json([
            "message"=>"Successfully deleted pet!"
        ], 200);
    }

    public function updateStatus(Request $request){
        $pet = Pets::find($request->id);

        $pet->status = $request->status;
        $data['msg'] = "Successfully updated!";
        $pet->save();
        return response()->json($pet,200);
    }
}

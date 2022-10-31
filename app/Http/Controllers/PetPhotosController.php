<?php

namespace App\Http\Controllers;

use App\Models\PetPhotos;
use Illuminate\Http\Request;

class PetPhotosController extends Controller
{

    public function insert(Request $request)
    {
        $photos = $request->file('photo');
        $x = 0;
        foreach ($photos as $photo) {
            $imageName = $photo->getClientOriginalName();

            $photo->move(public_path('images'), $imageName);
            $petPhoto = array(
                "petId" => $request->petId,
                "src" => asset('images') . "/" . $imageName
            );
            if ($x == 0 && $request->has("isMain")) {
                // unset main photo
                $mainPhoto = PetPhotos::where([["petId", $request->petId], ["is_main", true]])->get();
                if (count($mainPhoto) > 0) {
                    $mainPhoto[0]->is_main = false;
                    $mainPhoto[0]->save();
                }
                $petPhoto['is_main'] = true;
            }
            PetPhotos::create($petPhoto);

            $x++;
        }

        return response()->json(['Successfully added'], 200);
    }

    public function setMainPhoto(Request $request)
    {
        $petId = $request->petId;
        $photoId = $request->photoId;

        $mainPhoto = PetPhotos::where([
            ["petId", $request->petId],
            ["is_main", true]
        ])->get();
        if (count($mainPhoto) > 0) {
            $mainPhoto[0]->is_main = false;
            $mainPhoto[0]->save();
        }

        $photo = PetPhotos::find($photoId);
        $photo->is_main = true;
        $photo->save();

        return response()->json(['Successfully updated photos!'], 200);
    }

    public function delete($id)
    {
        $photo = PetPhotos::find($id);
        if (!$photo) {
            return response()->json(['message' => "Cannot be found!"], 404);
        } else {
            // if($photo->is_main){
            //     $petId = $phot
            // }
            $photo->delete();
            return response()->json(['message' => "Successfully deleted!"], 200);
        }
    }
}

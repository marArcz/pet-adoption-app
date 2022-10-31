<?php

namespace App\Http\Controllers;

use App\Models\Adopters;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AdoptersController extends Controller
{
    //
    public function getAll()
    {
        $adopters = Adopters::with(['account'])->get();
        return response()->json($adopters, 200);
    }
    public function update(Request $request)
    {
        // find adopter to update
        $adopter = Adopters::find($request->id);
        if (!$adopter) {
            return response()->json(['message', 'Adopter cannot be found!'], 404);
        } else {
            $account = User::find($adopter->accountId);

            $adopter->firstname = $request->firstname;
            $adopter->middlename = $request->middlename;
            $adopter->lastname = $request->lastname;
            $account->email = $request->email;

            if ($request->has('photo')) {
                $photo = $request->file('photo');
                $imageName = $photo->getClientOriginalName();
                $photo->move(public_path('images'), $imageName);

                $adopter->photo = asset('images') . '/' . $imageName;
            }
            $account->save();
            $adopter->save();

            return response()->json(['message', 'Successfully updated!'], 200);
        }
    }

    public function insert(Request $request)
    {
        $photo = $request->file('photo');

        $imageName = $photo->getClientOriginalName();
        $photo->move(public_path('images'), $imageName);
        $account = User::create([
            "email" => $request->email,
            "password" =>  Hash::make($request->password),
        ]);

        if ($account) {
            $account->attachRole("user");
            $adopter = [
                'firstname' => $request->firstname,
                'middlename' => $request->middlename,
                'lastname' => $request->lastname,
                'location' => $request->location,
                'state' => $request->state,
                'status' => 1,
                'photo' => asset('images') . "/" . $imageName,
                'accountId' => $account->id
            ];

            $newAdopter = Adopters::create($adopter);
            $token = $account->createToken('auth_token')->plainTextToken;

            if (!$newAdopter) {
                $account->delete();
                return response()->json(["message" => "Cannot create account!"], 500);
            }

            $data['adopter'] = $newAdopter;
            $data['account'] = $account;
            $data['access_token'] = $token;
            $data['token_type'] = "Bearer";

            return response()->json($data, 200);
        }
    }

    public function login(Request $request)
    {
        if (!Auth::attempt($request->only("email", "password"),true)) {
            return response()->json([
                "message" => "Invalid login details!"
            ], 401);
        }
        $user = User::where('email', $request->email)->firstOrFail();

        $token = $user->createToken('auth_token')->plainTextToken;
        $adopter = Adopters::where('accountId', $user->id)->with(['account'])->firstOrFail();

        return response()->json([
            "account" => $adopter,
            'access_token' => $token,
            'token_type' => 'Bearer',
        ]);
    }
    public function me(Request $request)
    {
        $user = $request->user();
        $adopters = Adopters::where('accountId', $user->id)->with(['account'])->firstOrFail();
        return response()->json($adopters, 200);
    }

    public function change_password(Request $request){
        $account = User::find($request->id);
        
        $account->password = Hash::make($request->password);

        $account->save();

        return response()->json($account);
    }
    public function delete($id){
        $account = User::find($id);

        $account->delete();
        $data['msg'] = "Successfully deleted!";
        return response()->json($data);
    }

    public function update_status(Request $request){
        $adopter = Adopters::find($request->id);
        $adopter->status = $request->status;

        $adopter->save();
        $data['msg'] = 'Successfully updated!';
        return response()->json($data);

    }
}

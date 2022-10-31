<?php

namespace App\Http\Controllers;

use App\Models\admin;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AdminController extends Controller
{
    //

    public function hasAdmin(Request $request)
    {
        $hasAdmin = count(Admin::all()) > 0 ? "true" : "false";

        return response()->json(["hasAdmin" => $hasAdmin], 200);
    }

    public function signup(Request $request)
    {
        $photoSrc = asset('images/profile.jpg');
        if ($request->has('photo')) {

            $photo = $request->file("photo");
            if ($photo) {
                $imageName = $photo->getClientOriginalName();

                $photo->move(public_path('images'), $imageName);
                $photoSrc = asset('images') . '/' . $imageName;
            }
        }
        $user = User::create([
            'email' => $request->email,
            'password' => Hash::make($request->password)
        ]);



        $user->attachRole("admin");

        $admin = admin::create([
            'firstname' => $request->firstname,
            'middlename' => $request->middlename,
            'lastname' => $request->lastname,
            'photo' => $photoSrc,
            'accountId' => $user->id
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;
        $user->sendEmailVerificationNotification();



        return response()->json([
            "account" => $admin,
            'access_token' => $token,
            'token_type' => 'Bearer',
        ], 200);
    }

    public function login(Request $request)
    {
        if (!Auth::attempt($request->only("email", "password"))) {
            return response()->json([
                "message" => "Invalid login details!"
            ], 401);
        }
        $user = User::where('email', $request['email'])->firstOrFail();

        $token = $user->createToken('auth_token')->plainTextToken;
        $admin = Admin::where('accountId', $user->id)->with(['account'])->firstOrFail();

        return response()->json([
            "account" => $admin,
            'access_token' => $token,
            'token_type' => 'Bearer',
        ]);
    }


    public function me(Request $request)
    {
        $user = $request->user();
        $admin = Admin::where('accountId', $user->id)->with(['account'])->firstOrFail();
        return response()->json($admin, 200);
    }

    public function update(Request $request)
    {
        $admin = Admin::find($request->id);
        $account = User::find($admin->accountId);

        $admin->firstname = $request->firstname;
        $admin->middlename = $request->middlename;
        $admin->lastname = $request->lastname;
        if ($request->has('photo')) {
            $photo = $request->file("photo");
            $imageName = $photo->getClientOriginalName();

            $photo->move(public_path('images'), $imageName);

            $admin->photo = asset('images') . '/' . $imageName;
        }

        $account->email = $request->email;
        if ($request->has('password')) {
            $account->password = Hash::make($request->password);
        }

        $admin->save();
        $account->save();

        return response()->json(['message' => "Successfully updated!"], 200);
    }
}

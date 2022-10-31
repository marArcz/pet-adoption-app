<?php

namespace App\Http\Controllers;

use App\Models\Admin;
use App\Models\Adopters;
use App\Models\Application;
use App\Models\NotificationModel;
use App\Models\Pets;
use App\Models\Schedule;
use Illuminate\Http\Request;

class ApplicationController extends Controller
{
    // add application form 
    public function add(Request $request)
    {
        $code =   time() . date('d-F,Y') . $request->name . "" . $request->adopterId;
      

        $form = [
            "application_no" => "",
            "adopterId" => $request->adopterId,
            "email" => $request->email,
            "name" => $request->name,
            "nickname" => $request->nickname,
            "age" => $request->age,
            "status" => $request->status,
            "address" => $request->address,
            "contact_no" => $request->contact_no,
            "facebook" => $request->facebook,
            "occupation" => $request->occupation,
            "dwelling" => $request->dwelling,
            "landlord_name" => $request->landlord_name,
            "landlord_phone" => $request->landlord_phone,
            "move_out" => $request->move_out,
            "living_with_relatives" => $request->living_with_relatives,
            "permission" => $request->permission,
            "no_of_adults" => $request->no_of_adults,
            "no_of_children" => $request->no_of_children,
            "allergies_asthma" => $request->allergies_asthma,
            "supported_by_family" => $request->supported_by_family,
            "responsible" => $request->responsible,
            "income_source" => $request->income_source,
            "adopted_an_animal" => $request->adopted_an_animal,
            "return_reason" => $request->return_reason,
            "gift_plan" => $request->gift_plan,
            "pets_owned" => $request->pets_owned,
            "have_pet" => $request->have_pet,
            "interested_pet" => $request->interested_pet,
            "keep_at_night" => $request->keep_at_night,
            "keep_at_day" => $request->keep_at_day,
            "outside_shelter" => $request->outside_shelter,
            "time_alone" => $request->time_alone,
            "food_type" => $request->food_type,
            "fence_type" => $request->fence_type,
            "past_experience" => $request->past_experience,
            "reason_for_adoption" => $request->reason_for_adoption,
            "certify" => $request->certify,
            "children_ages" => $request->children_ages,
            "petId" => $request->petId
        ];

        $app_form = Application::create($form);

        

        if ($app_form) {
            $code = $app_form->id . $code;
            $code = strtoupper(md5($code));
            $code = substr($code, 0, 8);
            $code = "GHR-" . $code;

            $form = Application::find($app_form->id);
            $form->application_no = $code;
            $form->save();

            $schedule = Schedule::create([
                "date" => $request->date,
                "time_id" => $request->time_id,
                "petId" => $request->petId,
                "applicationId" => $app_form->id
            ]);

            if (!$schedule) {
                $app_form->delete();
            }

            // insert notification
            $admin = Admin::with('account')->get()[0];
            $adopter = Adopters::find($app_form->adopterId);
            $notification = NotificationModel::create([
                'userId'=>$admin->account->id,
                'title'=>'New Application',
                'content'=>'Recieved new application',
                'link'=>'/success/applications/'.$app_form->id,
                'status'=>0,
                'photo'=>$adopter->photo

            ]);

            return response()->json([$app_form, $schedule], 200);
        } else {
            return response()->json([
                "msg" => "Cannot add application form!"
            ], 500);
        }
    }

    public function get(Request $request)
    {
        if ($request->has('adopterId')) {
            $app_form = Application::where("adopterId", $request->adopterId)->with(['schedule', 'pet','adopter'])->orderBy('id','desc')->get();
        } else if ($request->has('id')) {
            $app_form = Application::with(['schedule', 'pet', 'adopter'])->find($request->id);
        } else if ($request->has("status")) {
            $app_form = Application::with(['schedule', 'pet', 'adopter'])->where('application_status', $request->status)->orderBy('id','desc')->get();
        } else {
            $app_form = Application::with(['schedule', 'pet', 'adopter'])->orderBy('id','desc')->get();
        }

        return response()->json($app_form);
    }
    public function find(Request $request)
    {
        $app_form = Application::with(['schedule', 'pet'])->find($request->id);

        return response()->json($app_form);
    }

    public function updateStatus(Request $request)
    {
        $app_form = Application::with(['pet'])->find($request->id);
        $status = $request->status;

        $app_form->application_status = $status;
        if($status == 3){
            $pet = Pets::find($app_form->pet->id);
            $pet->status = 0;
            $pet->save();
        }
        $app_form->save();


        return response()->json($app_form);

    }
}

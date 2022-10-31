<?php

namespace App\Http\Controllers;

use App\Models\Schedule;
use App\Models\ScheduleDays;
use App\Models\ScheduleTime;
use Illuminate\Http\Request;

class ScheduleController extends Controller
{
    //
    public function getSchedules()
    {
        $schedules = Schedule::with(["time","application_form"])->get();

        return response()->json($schedules, 200);
    }
    //
    public function getScheduleDays()
    {
        $days = ScheduleDays::all();

        return response()->json($days, 200);
    }

    public function update(Request $request)
    {
        $weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        $days = $request->day;
        ScheduleDays::where("id", "!=", 0)->delete();
        foreach ($days as $key => $day) {
            $schedDay = [
                "day" => $day,
                "label" => $weekdays[$day]
            ];

            ScheduleDays::create($schedDay);
        };

        return response()->json([
            'msg' => "Successfully updated"
        ]);
    }

    public function getScheduleTime()
    {
        $times = ScheduleTime::all();
        return response()->json($times);
    }

    public function addTime(Request $request)
    {
        $new_time = [
            "time_from" => $request->time_from,
            "time_to" => $request->time_to,
            "slots" => $request->slots,
        ];
        $time = ScheduleTime::create($new_time);

        if ($time) {
            return response()->json($time);
        } else {
            return response()->json([
                'msg' => "Cannot Add Time!"
            ], 500);
        }
    }
    public function updateTime(Request $request)
    {
        $time = ScheduleTime::find($request->id);

        $time->time_from =  $request->time_from;
        $time->time_to = $request->time_to;
        $time->slots = $request->slots;

        if ($time->save()) {
            return response()->json($time);
        } else {
            return response()->json([
                'msg' => "Cannot Update Time!"
            ], 500);
        }
    }

    public function deleteTime($id)
    {
        $time = ScheduleTime::find($id);
        $time->delete();

        return response()->json(['msg' => 'successfully deleted!']);
    }

    public function getTimeForDate(Request $request)
    {
        $times = [];

        $schedTimes = ScheduleTime::all();

        foreach ($schedTimes as $t) {
            $scheds = Schedule::where("date", $request->date)->where("time_id", $t->id)->get();
            $available = $t->slots - count($scheds);

            $t->available = $available;
        }

        return response()->json($schedTimes);
    }
}

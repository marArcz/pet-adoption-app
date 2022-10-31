<?php

namespace App\Http\Controllers;

use App\Models\NotificationModel;
use Illuminate\Http\Request;

class NotificationModelController extends Controller
{
    //

    public function getAll($userId)
    {
        $notifications = NotificationModel::where('userId', $userId)->with('user')->orderBy('id', 'desc')->get();

        return response()->json($notifications);
    }

    public function insert(Request $request)
    {
        $requestData = [
            'userId' => $request->userId,
            'content' => $request->content,
            'title' => $request->title,
            'link' => $request->link,
            'status' => 0,
        ];

        $notification = NotificationModel::create($requestData);

        return response()->json($notification);
    }

    public function updateStatus(Request $request)
    {
        $notification = NotificationModel::find($request->id);

        $notification->status = $request->status;
        $notification->save();
        return response()->json($notification);
    }

    public function deleteAll()
    {

        if (NotificationModel::whereNotNull('id')->delete()) {
            $data['msg'] = "Successfully deleted!";
            return response()->json([
                'msg' => "Successfully deleted"
            ]);
        }else{
            return response()->json([
                'msg' => "Failed to delete"
            ]);
        }
    }
}

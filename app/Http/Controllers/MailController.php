<?php

namespace App\Http\Controllers;

use App\Models\Adopters;
use App\Models\Application;
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;
use Illuminate\Http\Request;

class MailController extends Controller
{
    /* 
    * For appplications status Notifications 
    * Notify adopters when status is updated
    * request: email,status:string('approved','declined','proccessed'),name,application_no
   */
    public function notifyAdopter(Request $request)
    {
        $application = Application::where('application_no',$request->application_no)->with('schedule')->firstOrFail();
        if ($request->status == "approved") {
            $message = " Your application for pet adoption has been approved, you may visit us on the date and time of your application schedule.";
            $subject = "Your application is approved";
        } else if ($request->status == "declined") {
            $message = "Sorry, your application for pet adoption has been declined.";
            $subject = "Your application is declined";
        } else if($request->status == "completed"){
            $message = "Thank you so much for adopting a pet, your application has been successfully processed you will contacted by our staff for further information.";
            $subject = "Your application was successfully processed";
        }
        else{
            $message = "Sorry, your application for pet adoption has been cancelled.";
            $subject = "Your application is cancelled";
        }

        $template = file_get_contents(resource_path('mail/application_email.html'));
        $template = str_replace("{name}", $request->name, $template);
        $template = str_replace("{message}", $message, $template);
        $template = str_replace("{application_no}", $request->application_no, $template);
        $template = str_replace("{date}", $application->schedule->date, $template);
        $template = str_replace("{time}", $application->schedule->time->time_from . "-" . $application->schedule->time->time_to, $template);


        //Create an instance; passing `true` enables exceptions
        $mail = new PHPMailer(true);

        try {
            //Server settings
            $mail->SMTPDebug = SMTP::DEBUG_SERVER;                      //Enable verbose debug output
            $mail->isSMTP();                                            //Send using SMTP
            $mail->Mailer = env('MAIL_MAILER');
            $mail->Host       = env('MAIL_HOST');                     //Set the SMTP server to send through
            $mail->SMTPAuth   = true;                                   //Enable SMTP authentication
            $mail->Username   = env('MAIL_USERNAME');                     //SMTP username
            $mail->Password   = env('MAIL_PASSWORD');                               //SMTP password
            $mail->SMTPSecure = "tls";            //Enable implicit TLS encryption
            $mail->Port       = env('MAIL_PORT');                                    //TCP port to connect to; use 587 if you have set `SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS`

            //Recipients
            $mail->setFrom(env('MAIL_FROM_ADDRESS'), env('MAIL_FROM_NAME'));
            $mail->addAddress($request->email, $request->name);     //Add a recipient
            $mail->addReplyTo(env('MAIL_FROM_ADDRESS'), 'Information');

            //Content
            $mail->isHTML(true);                                  //Set email format to HTML
            $mail->Subject = $subject;
            $mail->Body = $template;
            
            $mail->send();
            
            return response()->json("Successfully sent!");
        } catch (Exception $e) {
            $data['msg'] = "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
            return response()->json($data,500);
        }
    }
}

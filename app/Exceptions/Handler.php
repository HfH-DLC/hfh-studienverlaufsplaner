<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Throwable;
use Inertia\Inertia;

class Handler extends ExceptionHandler
{
    /**
     * A list of the exception types that are not reported.
     *
     * @var string[]
     */
    protected $dontReport = [
        //
    ];

    /**
     * A list of the inputs that are never flashed for validation exceptions.
     *
     * @var string[]
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     *
     * @return void
     */
    public function register()
    {
        $this->reportable(function (Throwable $e) {
            //
        });
    }



    /**
     * Prepare exception for rendering.
    *
    * @param  \Throwable  $e
    * @return \Throwable
    */
   /*  public function render($request, Throwable $e)
    {
        $response = parent::render($request, $e);

        if (in_array($response->getStatusCode(), [500, 503, 404, 403])) {
            return Inertia::render('Error', ['status' => $response->getStatusCode()])
            ->toResponse($request)
            ->setStatusCode($response->getStatusCode());
        } elseif ($response->getStatusCode() === 419) {
            return back()->with([
            'message' => 'The page expired, please try again.',
            ]);
        }

        return $response;
    } */
}

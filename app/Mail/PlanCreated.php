<?php

namespace App\Mail;

use App\Models\Plan;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\URL;

class PlanCreated extends Mailable
{
    use Queueable, SerializesModels;

    protected $plan;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(Plan $plan)
    {
        $this->plan = $plan;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        $planerSlug = $this->plan->planer->slug;
        $slug = $this->plan->slug;
        $url = URL::to("/$planerSlug/$slug");
        return $this
            ->subject('Ihr HfH Studienverlaufsplan (' . $this->plan->slug . ')')
            ->view('emails.plan_created')
            ->with([
                'url' => $url,
                'brochure_url' => $this->plan->planer->meta["brochureUrl"],
                'module_directory_url' => $this->plan->meta["moduleDirectoryUrl"]
            ]);
    }
}

<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

class CreateUser extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'user:create';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Creates a new user';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $name = $this->ask('What is the name?');
        $email = $this->ask('What is the email address?');
        $password = $this->secret('What is the password?');
        $passwordConfirm = $this->secret('Confirm the password:');

        if ($password === $passwordConfirm) {
            User::create([
                'name' => $name,
                'email' => $email,
                'password' => $password
            ]);
        
            $this->info("User $email was created.");
        } else {
            $this->error("Passwords did not match. No user created.");
        }
    }
}

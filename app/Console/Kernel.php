<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * Define the application's command schedule.
     */
    protected function schedule(Schedule $schedule): void
    {
        // Check for inactive users weekly but do not mark them
        $schedule->command('users:check-inactive')
                 ->weekly()
                 ->emailOutputTo('admin@example.com');
        
        // Only run automatic marking as inactive monthly and only after a long period
        $schedule->command('users:check-inactive --mark-inactive --days=120')
                 ->monthly()
                 ->emailOutputTo('admin@example.com');
    }

    /**
     * Register the commands for the application.
     */
    protected function commands(): void
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}
<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Mail;

class SendLowStockEmail implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     */
  public function __construct(public $product) {}

    /**
     * Execute the job.
     */
  public function handle(): void {
    $adminEmail = 'admin@prodhub.com'; // Dummy admin
    $message = "Product Low Stock Alert: {$this->product->name} has only {$this->product->stock_quantity} left.";
    
    Mail::to($adminEmail)->send(new \App\Mail\AdminNotification("Low Stock: {$this->product->name}", $message));
}
}

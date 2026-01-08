<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class DailySalesReport extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'report:daily-sales';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
   public function handle() {
    // Get all items marked as 'paid' today
    $sales = \App\Models\Cart::where('status', 'paid')
        ->whereDate('updated_at', today())
        ->with('product')
        ->get();

    $totalRevenue = 0;
    $reportText = "Sales Report for " . today()->toDateString() . "\n\n";

    foreach ($sales as $sale) {
        $price = $sale->product->price * $sale->quantity;
        $reportText .= "- {$sale->product->name}: {$sale->quantity} units ($$price)\n";
        $totalRevenue += $price;
    }

    $reportText .= "\nTotal Revenue: $$totalRevenue";

    \Mail::to('admin@prodhub.com')->send(new \App\Mail\AdminNotification("Daily Sales Report", $reportText));
}
}

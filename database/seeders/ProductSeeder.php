<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $products = [
            'Laravel SaaS Starter', 'Business Pro Bundle', 'SEO Masterclass', 
            'React UI Kit', 'Excel Finance Pack', 'Digital Marketing Guide', 
            'Python Automation Scripts', 'Canva Design Templates', 
            'Database Optimization Ebook', 'Cloud Architecture Map'
        ];

        foreach ($products as $name) {
            Product::create([
                'name' => $name,
                'price' => rand(15, 99),
                'stock_quantity' => rand(5,10),
            ]);
        }
    }
}
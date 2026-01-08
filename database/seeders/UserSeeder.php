<?php

namespace Database\Seeders;
use App\Models\User;
use Hash;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@admin.com'], 
            [
                'name' => 'Admin User',
                'password' => Hash::make('@123456789@'),
                'email_verified_at' => now(),
            ]
        );
    }
}

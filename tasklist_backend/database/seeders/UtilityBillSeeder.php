<?php
// database/seeders/UtilityBillSeeder.php
namespace Database\Seeders;

use App\Models\Property;
use App\Models\User;
use App\Models\UtilityBill;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class UtilityBillSeeder extends Seeder
{
    public function run()
    {
        $user = User::first();
        $properties = Property::all();

        // Using TANESCO (electricity), DAWASCO (water), and TPDC (gas) as references
        $bills = [
            // City View Apartments bills
            [
                'property_id' => 1,
                'user_id' => $user->id,
                'type' => 'electricity',
                'amount' => 182500,
                'bill_date' => Carbon::now()->subMonths(2),
            ],
            [
                'property_id' => 1,
                'user_id' => $user->id,
                'type' => 'water',
                'amount' => 65000,
                'bill_date' => Carbon::now()->subMonths(2),
            ],
            [
                'property_id' => 1,
                'user_id' => $user->id,
                'type' => 'gas',
                'amount' => 98000,
                'bill_date' => Carbon::now()->subMonths(2),
            ],

            // Ocean Breeze Residences bills
            [
                'property_id' => 2,
                'user_id' => $user->id,
                'type' => 'electricity',
                'amount' => 215000,
                'bill_date' => Carbon::now()->subMonths(1),
            ],
            [
                'property_id' => 2,
                'user_id' => $user->id,
                'type' => 'water',
                'amount' => 78500,
                'bill_date' => Carbon::now()->subMonths(1),
            ],

            // Peninsula Office Complex bills
            [
                'property_id' => 3,
                'user_id' => $user->id,
                'type' => 'electricity',
                'amount' => 750000,
                'bill_date' => Carbon::now()->subMonths(1),
            ],
            [
                'property_id' => 3,
                'user_id' => $user->id,
                'type' => 'water',
                'amount' => 320000,
                'bill_date' => Carbon::now()->subMonths(1),
            ],
            [
                'property_id' => 3,
                'user_id' => $user->id,
                'type' => 'gas',
                'amount' => 248000,
                'bill_date' => Carbon::now()->subMonths(1),
            ],

            // Green Acres Villa bills
            [
                'property_id' => 4,
                'user_id' => $user->id,
                'type' => 'electricity',
                'amount' => 165000,
                'bill_date' => Carbon::now()->subMonths(3),
            ],
            [
                'property_id' => 4,
                'user_id' => $user->id,
                'type' => 'gas',
                'amount' => 105000,
                'bill_date' => Carbon::now()->subMonths(3),
            ],

            // Kariakoo Market Plaza bills
            [
                'property_id' => 5,
                'user_id' => $user->id,
                'type' => 'electricity',
                'amount' => 925000,
                'bill_date' => Carbon::now()->subDays(15),
            ],
            [
                'property_id' => 5,
                'user_id' => $user->id,
                'type' => 'water',
                'amount' => 425000,
                'bill_date' => Carbon::now()->subDays(15),
            ],
            [
                'property_id' => 5,
                'user_id' => $user->id,
                'type' => 'gas',
                'amount' => 305000,
                'bill_date' => Carbon::now()->subDays(15),
            ],

            // Recent bills for City View Apartments
            [
                'property_id' => 1,
                'user_id' => $user->id,
                'type' => 'electricity',
                'amount' => 195000,
                'bill_date' => Carbon::now()->subDays(5),
            ],
            [
                'property_id' => 1,
                'user_id' => $user->id,
                'type' => 'water',
                'amount' => 72000,
                'bill_date' => Carbon::now()->subDays(5),
            ],
        ];

        foreach ($bills as $bill) {
            UtilityBill::create($bill);
        }
    }
}

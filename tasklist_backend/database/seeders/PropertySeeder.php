<?php
// database/seeders/PropertySeeder.php
namespace Database\Seeders;

use App\Models\Property;
use Illuminate\Database\Seeder;

class PropertySeeder extends Seeder
{
    public function run()
    {
        $properties = [
            [
                'name' => 'City View Apartments',
                'address' => '23 Bagamoyo Road, Upanga, Dar es Salaam',
                'type' => 'residential',
            ],
            [
                'name' => 'Ocean Breeze Residences',
                'address' => '74 Toure Drive, Masaki, Dar es Salaam',
                'type' => 'residential',
            ],
            [
                'name' => 'Peninsula Office Complex',
                'address' => '15 Samora Avenue, CBD, Dar es Salaam',
                'type' => 'commercial',
            ],
            [
                'name' => 'Green Acres Villa',
                'address' => '32 Kenyatta Road, Mikocheni, Dar es Salaam',
                'type' => 'residential',
            ],
            [
                'name' => 'Kariakoo Market Plaza',
                'address' => '56 Lumumba Street, Kariakoo, Dar es Salaam',
                'type' => 'commercial',
            ],
        ];

        foreach ($properties as $property) {
            Property::create($property);
        }
    }
}

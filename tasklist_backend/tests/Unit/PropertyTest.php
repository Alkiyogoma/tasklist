<?php

namespace Tests\Unit;

use App\Models\Property;
use App\Models\UtilityBill;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Illuminate\Support\Str;

class PropertyTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_has_fillable_attributes()
    {
        $property = new Property();

        $this->assertEquals(
            ['name', 'address', 'type'],
            $property->getFillable()
        );
    }

    /** @test */
    public function it_uses_uuid_trait()
    {
        // Create a property which should trigger the HasUuid trait
        $property = Property::create([
            'name' => 'Test Property',
            'address' => '123 Test Street',
            'type' => 'residential'
        ]);

        // UUID should be a string in the uuid column
        $this->assertIsString($property->uuid);
        $this->assertTrue(Str::isUuid($property->uuid));

        // id should be an integer auto-increment
        $this->assertIsNumeric($property->id);
    }

    /** @test */
    public function it_has_many_utility_bills()
    {
        // Create a property
        $property = Property::create([
            'name' => 'Test Property',
            'address' => '123 Test Street',
            'type' => 'residential'
        ]);

        // Create a user for the utility bills
        $user = User::factory()->create();

        // Create related utility bills
        $utilityBill1 = UtilityBill::create([
            'property_id' => $property->id,  // Using the numeric ID for the foreign key
            'type' => 'electricity',
            'amount' => 150.50,
            'bill_date' => now(),
            'user_id' => $user->id
        ]);

        $utilityBill2 = UtilityBill::create([
            'property_id' => $property->id,  // Using the numeric ID for the foreign key
            'type' => 'water',
            'amount' => 75.25,
            'bill_date' => now(),
            'user_id' => $user->id
        ]);

        // Refresh the property model to get the relationship
        $property->refresh();

        $this->assertInstanceOf('Illuminate\Database\Eloquent\Collection', $property->utilities);
        $this->assertCount(2, $property->utilities);
        $this->assertInstanceOf(UtilityBill::class, $property->utilities->first());
    }
}
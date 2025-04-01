<?php

namespace Tests\Unit;

use App\Models\Property;
use App\Models\User;
use App\Models\UtilityBill;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;
use Illuminate\Support\Str;

class UtilityBillTest extends TestCase
{
    use DatabaseTransactions;

    /** @test */
    public function it_has_fillable_attributes()
    {
        $utilityBill = new UtilityBill();

        $this->assertEquals(
            ['property_id', 'type', 'amount', 'bill_date', 'user_id'],
            $utilityBill->getFillable()
        );
    }

    /** @test */
    public function it_uses_uuid_trait()
    {
        // Create a property first
        $property = Property::create([
            'name' => 'Test Property',
            'address' => '123 Test Street',
            'type' => 'residential'
        ]);

        // Create a user
        $user = User::factory()->create();

        // Create utility bill
        $utilityBill = UtilityBill::create([
            'property_id' => $property->id,
            'type' => 'electricity',
            'amount' => 150.50,
            'bill_date' => now(),
            'user_id' => $user->id
        ]);

        // UUID should be a string in the uuid column
        $this->assertIsString($utilityBill->uuid);
        $this->assertTrue(Str::isUuid($utilityBill->uuid));

        // id should be an integer auto-increment
        $this->assertIsNumeric($utilityBill->id);
    }

    /** @test */
    public function it_casts_attributes_correctly()
    {
        // Create a property first
        $property = Property::create([
            'name' => 'Test Property',
            'address' => '123 Test Street',
            'type' => 'residential'
        ]);

        // Create a user
        $user = User::factory()->create();

        $date = now();

        // Create utility bill
        $utilityBill = UtilityBill::create([
            'property_id' => $property->id,
            'type' => 'electricity',
            'amount' => '150.50', // String value
            'bill_date' => $date,
            'user_id' => $user->id
        ]);

        // Reload from database to ensure casts are applied
        $utilityBill = UtilityBill::find($utilityBill->id);

        // Test date casting
        $this->assertInstanceOf(\Illuminate\Support\Carbon::class, $utilityBill->bill_date);
        $this->assertEquals($date->toDateString(), $utilityBill->bill_date->toDateString());

        // Test decimal casting
        $this->assertEquals('150.50', (string)$utilityBill->amount);
    }

    /** @test */
    public function it_belongs_to_a_property()
    {
        // Create a property first
        $property = Property::create([
            'name' => 'Test Property',
            'address' => '123 Test Street',
            'type' => 'residential'
        ]);

        // Create a user
        $user = User::factory()->create();

        // Create utility bill
        $utilityBill = UtilityBill::create([
            'property_id' => $property->id,
            'type' => 'electricity',
            'amount' => 150.50,
            'bill_date' => now(),
            'user_id' => $user->id
        ]);

        // Reload from database to ensure relationships are loaded
        $utilityBill = UtilityBill::find($utilityBill->id);

        $this->assertInstanceOf(Property::class, $utilityBill->property);
        $this->assertEquals($property->id, $utilityBill->property->id);
    }

    /** @test */
    public function it_belongs_to_a_user()
    {
        // Create a property first
        $property = Property::create([
            'name' => 'Test Property',
            'address' => '123 Test Street',
            'type' => 'residential'
        ]);

        // Create a user
        $user = User::factory()->create();

        // Create utility bill
        $utilityBill = UtilityBill::create([
            'property_id' => $property->id,
            'type' => 'electricity',
            'amount' => 150.50,
            'bill_date' => now(),
            'user_id' => $user->id
        ]);

        // Reload from database to ensure relationships are loaded
        $utilityBill = UtilityBill::find($utilityBill->id);

        $this->assertInstanceOf(User::class, $utilityBill->user);
        $this->assertEquals($user->id, $utilityBill->user->id);
    }
}
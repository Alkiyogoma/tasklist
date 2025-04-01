<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('utility_bills', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid');
            $table->foreignId('property_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->enum('type', ['electricity', 'water', 'gas']);
            $table->decimal('amount', 10, 2);
            $table->date('bill_date');
            $table->timestamps();

            // Utility bills indexes for frequently queried columns
            $table->index('type');
            $table->index('bill_date');
            $table->index(['property_id', 'type']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('utility_bills');
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('properties', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid');
            $table->string('name');
            $table->text('address');
            $table->enum('type', ['residential', 'commercial']);
            $table->timestamps();

            // Properties index for improved query performance
            $table->index('type');
        });
    }

    public function down()
    {
        Schema::dropIfExists('properties');
    }
};

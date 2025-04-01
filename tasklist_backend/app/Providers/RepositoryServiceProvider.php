<?php

namespace App\Providers;

use App\Repositories\Interfaces\PropertyRepositoryInterface;
use App\Repositories\Interfaces\UtilityBillRepositoryInterface;
use App\Repositories\PropertyRepository;
use App\Repositories\UtilityBillRepository;
use Illuminate\Support\ServiceProvider;

class RepositoryServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        $this->app->bind(PropertyRepositoryInterface::class, PropertyRepository::class);
        $this->app->bind(UtilityBillRepositoryInterface::class, UtilityBillRepository::class);
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}

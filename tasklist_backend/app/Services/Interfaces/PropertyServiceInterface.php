<?php

namespace App\Services\Interfaces;

interface PropertyServiceInterface
{
    public function getAllProperties();
    public function getProperty($id);
    public function createProperty(array $data);
    public function updateProperty($id, array $data);
    public function deleteProperty($id);
}

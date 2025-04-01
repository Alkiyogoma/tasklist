<?php

namespace App\Repositories\Interfaces;

interface UtilityBillRepositoryInterface
{
    public function getByPropertyId($propertyId);
    public function create(array $data);
    public function update($id, array $data);
    public function delete($id);
}

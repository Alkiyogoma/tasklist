<?php

namespace App\Services\Interfaces;

interface UtilityBillServiceInterface
{
    public function getAllBills();
    public function getBillsByProperty($propertyId);
    public function createBill(array $data);
    public function updateBill($id, array $data);
    public function deleteBill($id);
}

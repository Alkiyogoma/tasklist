<?php

namespace App\Services;

use App\Repositories\Interfaces\UtilityBillRepositoryInterface;

class UtilityBillService
{
    protected $utilityRepository;

    public function __construct(UtilityBillRepositoryInterface $utilityRepository)
    {
        $this->utilityRepository = $utilityRepository;
    }

    public function getUtilitiesByPropertyId($propertyId)
    {
        return $this->utilityRepository->getByPropertyId($propertyId);
    }

    public function createUtility(array $data)
    {
        // Validation is now handled in the FormRequest
        return $this->utilityRepository->create($data);
    }

    public function updateUtility($id, array $data)
    {
        // Validation is now handled in the FormRequest

        return $this->utilityRepository->update($id, $data);
    }

    public function deleteUtility($id)
    {
        return $this->utilityRepository->delete($id);
    }
}
